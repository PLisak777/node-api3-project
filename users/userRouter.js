const express = require('express');

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();
router.use('/:id', validateUserId);

router.post('/', validateUser, (req, res) => {
	userDb
		.insert(req.body)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to create user',
				err,
			});
		});
});

router.post('/:id/posts', validatePost, (req, res) => {
	postDb
		.insert(req.body)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ message: 'Something went wrong! Unable to create new post!' });
		});
});

router.get('/', (req, res) => {
	userDb
		.get()
		.then((response) => {
			res.status(200).json({
				message: 'Retrieved User List',
				users: response,
			});
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ message: 'Something went wrong! Unable to retrieve users' });
		});
});

router.get('/:id', (req, res) => {
	userDb
		.getById(req.params.id)
		.then((response) => {
			res.status(200).json({
				message: 'Retrieved User',
				user: response,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Error retriving information',
				err,
			});
		});
});

router.get('/:id/posts', (req, res) => {
	userDb
		.getUserPosts(req.params.id)
		.then((response) => {
			res.status(200).json({
				message: 'Retrieved posts',
				posts: response,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to retrieve posts',
				err,
			});
		});
});

router.delete('/:id', (req, res) => {
	userDb
		.remove(req.params.id)
		.then((response) => {
			res.status(200).json({
				message: 'User successfully deleted',
				response,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Something went wrong! Unable to delete user!',
				err,
			});
		});
});

router.put('/:id', (req, res) => {
	userDb
		.update(req.params.id, req.body)
		.then((response) => {
			res.status(200).json({
				message: 'User successfully updated',
				user: response,
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Something went wrong! Unable to update user!',
			});
		});
});

//custom middleware

function validateUserId(req, res, next) {
	userDb
		.getById(req.params.id)
		.then((r) => {
			if (r && r.name && r.id) {
				req.user = r;
				next();
			} else {
				res.status(404).json({
					message: 'Invalid User Id',
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				message: 'Something went wrong! Unable to retrienve user info',
			});
		});
}

function validateUser(req, res, next) {
	if (req.body) {
		if (req.body.name) {
			const minLength = 2;
			if (req.body.name.length >= minLength) {
				next();
			} else {
				res.status(400).json({
					message: `Username must contain at least ${minLength} characters`,
				});
			}
		} else {
			res.status(400).json({
				message: 'Missing Username',
			});
		}
	} else {
		res.status(400).json({
			message: 'Missing User Data',
		});
	}
}

function validatePost(req, res, next) {
	if (req.body) {
		if (req.body.text) {
			const minLength = 5;
			if (req.body.text.length >= minLength) {
				req.body.user_id = req.params.id;
				next();
			} else {
				res.status(400).json({
					message: 'Text must contain at least 5 characters',
				});
			}
		} else {
			res.status(400).json({
				message: 'Post must contain text',
			});
		}
	} else {
		res.status(400).json({
			message: 'Post must contain a title',
		});
	}
}

module.exports = router;
