const express = require('express');
const db = require('./userDb');
const postDb = require('../posts/postDb');
const postRouter = require('../posts/postRouter');

const router = express.Router();
router.use('/:id', validateUserId);
router.use('/:id/posts', postRouter);

router.post('/', validateUser, (req, res) => {
	db.insert(req.body).then((response) => {
		res.status(201).json(response);
	});
});

router.post('/:id/posts', validatePost, (req, res) => {
	postDb
		.insert(req.body)
		.then((response) => {
			res.status(201).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong!' });
		});
});

router.get('/', (req, res) => {
	db.get()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong!' });
		});
});

router.delete('/:id', validateUserId, (req, res) => {
	db.remove(req.user.id)
		.then((response) => {
			console.log(response);
			res.status(204).end();
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong!' });
		});
});

router.put('/:id', validateUser, (req, res) => {
	db.update(req.user.id, req.body)
		.then((response) => {
			console.log(response);
			res.status(200).json({ ...req.body, id: req.user.id });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong!' });
		});
});

//custom middleware

function validateUserId(req, res, next) {
	const userId = req.params.id ? req.params.id : -1;
	db.getById(userId)
		.then((response) => {
			if (!response) {
				res.status(400).json({ message: 'invalid user id' });
			} else {
				req.user = response;
				next();
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ message: 'Something went wrong!' });
		});
}

function validateUser(req, res, next) {
	if (!req.body) {
		res.status(400).json({ message: 'missing user data' });
	} else if (!req.body.name) {
		res.status(400).json({ message: 'missing required name field' });
	} else {
		next();
	}
}

function validatePost(req, res, next) {
	if (!req.body) {
		res.status(400).json({ message: 'missing post data' });
	} else if (!req.body.text) {
		res.status(400).json({ message: 'missing required text field' });
	} else {
		req.body.user_id = req.params.id;
		next();
	}
}

module.exports = router;
