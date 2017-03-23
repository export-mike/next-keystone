const keystone = require('keystone');
const Joi = require('joi');
const validationMiddleware = require('./validationMiddleware');

module.exports = nextApp => keystoneApp => {
	const handle = nextApp.getRequestHandler();
	keystoneApp.get('/a', (req, res) => {
		return nextApp.render(req, res, '/b', req.query);
	});

	keystoneApp.get('/b', (req, res) => {
		return nextApp.render(req, res, '/a', { query: req.query, hi: 'test' });
	});

	function capitalize (list) {
		return list.charAt(0).toUpperCase() + list.slice(1);
	}

	keystoneApp.use('/api/', validationMiddleware);
	keystoneApp.get('/api/:list', (req, res, next) => {
		const listName = capitalize(req.params.list);
		const list = keystone.list(listName);

		if (list && list.publicMethods && list.publicMethods.list) {

			if (list.publicMethods.list.sanitize) {
				list.publicMethods.list.sanitize = n => n;
			}

			return list.model.find()
			.then(results => results.map(list.publicMethods.list.sanitize))
			.then(cleanData => {
				res.json(cleanData);
			})
			.catch(next);
		}

		return res.status(404).json({
			message: `${req.path} not found`,
		});
	});

	keystoneApp.post('/api/:list', (req, res, next) => {
		const listName = capitalize(req.params.list);
		const list = keystone.list(listName);

		if (list && list.publicMethods && list.publicMethods.post) {
			const { post } = list.publicMethods.post;
			return new list.model(req.body)
				.save()
				.then((saved) => res.json(post.sanitize(saved)))
				.catch(next);
		}

		return res.status(404).json({
			message: `${req.path} not found`,
		});
	});

	keystoneApp.get('*', (req, res) => {
		return handle(req, res);
	});
};
