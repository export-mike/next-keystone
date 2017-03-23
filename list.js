if (process.env.IS_SERVER) {
	console.log('requiring keystone!');
	console.log('ENV', process.env);
	const key = 'keystone';
	const keystone = require(key);
	module.exports = (list) => keystone.list(list);
} else {
	module.exports = (list) => ({
		model: {
			find: () => Promise.resolve([{
				email: 'm@miokej.com'
			}]),
		},
	});
}
