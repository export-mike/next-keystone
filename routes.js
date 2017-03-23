const keystone = require('keystone');

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

	keystoneApp.get('/api/:list', (req, res, next) => {
		const listName = capitalize(req.params.list);
		const list = keystone.list(listName);
		if (list.publicMethods.list) {
			list.model.find()
			.then(list.sanitizeForPublic)
			.then((cleanData) => {
				res.json(cleanData);
			})
			.catch(next);
		} else {
			return res.status(404).json({
				message: `${req.path} not found`,
			});
		}
	});

	keystoneApp.get('*', (req, res) => {
		return handle(req, res);
	});
};
