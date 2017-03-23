const keystone = require('keystone');
const noop = n => n;
function capitalize (list) {
	return list.charAt(0).toUpperCase() + list.slice(1);
}
module.exports = (req, res, next) => {
	const listName = capitalize(req.params.list);
	const list = keystone.list(listName);
	if (!list.publicMethods) return next();

	req.list = list;
	req.list.sanitize = list.sanitize || noop;
};
