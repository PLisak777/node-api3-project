const express = require('express');
const postDb = require('./postDb');

const router = express.Router();

router.use('/:id', validatePostId);

router.get('/', (req, res) => {
	postDb
		.get()
		.then((r) => {
			res.status(200).json({
				message: 'Posts retrieved',
				posts: r,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to retrieve posts',
				err,
			});
		});
});

router.get('/:id', (req, res) => {
	postDb
		.getById(req.user.id)
		.then((r) => {
			res.status(200).json({
				message: `Post id: ${req.params.id} successfully retrieved`,
				post: r,
			});
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ message: `Unable to retrieve post id: ${req.params.id}`, err });
		});
});

router.delete('/:id', (req, res) => {
	postDb
		.remove(req.user.id)
		.then((r) => {
			res.status(200).json({
				message: `Post ${req.params.id} deleted successfully`,
				deleted: '',
				deleted_post: r,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to delete post',
				err,
			});
		});
});

router.put('/:id', (req, res) => {
	postDb
		.update(req.params.id, req.body)
		.then((r) => {
			res.status(200).json({
				message: 'Update Success',
				post: r,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to update post',
				err,
			});
		});
});

// custom middleware

function validatePostId(req, res, next) {
	postDb
		.getById(req.params.id)
		.then((r) => {
			if (r) {
				next();
			} else {
				res.status(400).json({
					message: `Post with ID: ${req.params.id} does not exist`,
				});
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Unable to retrieve post data',
				err,
			});
		});
}

module.exports = router;
