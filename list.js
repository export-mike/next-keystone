if (process.env.IS_SERVER) {
	const key = 'keystone';
	const keystone = require(key);
	module.exports = (list) => keystone.list(list);
} else {
	module.exports = require('./model');
}
