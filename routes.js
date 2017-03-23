const validationMiddleware = require('./validationMiddleware');
const sanitizeMiddleware = require('./sanitizeMiddleware');

module.exports = nextApp => keystoneApp => {
	const handle = nextApp.getRequestHandler();
	keystoneApp.get('/a', (req, res) => {
		return nextApp.render(req, res, '/b', req.query);
	});
	// can I uncomment and get b still?
	keystoneApp.get('/b', (req, res) => {
		return nextApp.render(req, res, '/a', { query: req.query, hi: 'test' });
	});

	keystoneApp.use('/api/', validationMiddleware, sanitizeMiddleware);
	keystoneApp.get('/api/:list', (req, res, next) => {
		const list = req.list;
		return list.model.find()
		.then(results => results.map(list.sanitize))
		.then(cleanData => {
			res.json(cleanData);
		})
		.catch(next);
	});

	keystoneApp.get('/api/:list/:id', (req, res, next) => {
		const list = req.list;
		return list.model.findById(req.params.id)
		.then(list.sanitize)
		.then(cleanData => {
			res.json(cleanData);
		})
		.catch(next);
	});

	keystoneApp.post('/api/:list', (req, res, next) => {
		const list = req.list;
		new list.model(req.body)
		.save()
		.then((saved) => res.json(list.sanitize(saved)))
		.catch(next);
	});

	keystoneApp.get('*', (req, res) => {
		return handle(req, res);
	});
};
