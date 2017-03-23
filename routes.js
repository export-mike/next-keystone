module.exports = nextApp => keystoneApp => {
	const handle = nextApp.getRequestHandler();
	keystoneApp.get('/a', (req, res) => {
		return nextApp.render(req, res, '/b', req.query);
	});

	keystoneApp.get('/b', (req, res) => {
		return nextApp.render(req, res, '/a', req.query);
	});

	keystoneApp.get('*', (req, res) => {
		return handle(req, res);
	});
};
