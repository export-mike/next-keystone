const keystone = require('keystone');
const Joi = require('joi');
const POST = 'POST';
const PUT = 'PUT';
const GET = 'GET';
const DELETE = 'DELETE';

function capitalize (list) {
	return list.charAt(0).toUpperCase() + list.slice(1);
}

const log = msg => {
	if (process.env.NODE_ENV === 'development' || process.env.DEBUG_VALIDATION_MIDDLEWARE) {
		console.log(msg);
	}
};

function createValidationHandler (method) {
	return function (req, res, next) {
		let validationErrors = [];
		const { [method]: httpMethod } = req.list.publicMethods;

		// For get all /models where validation is not required
		if (httpMethod && typeof (httpMethod) === 'boolean') return next();

		if (req.body && (!httpMethod.validation && !httpMethod.validation.body)) {
			log(`warning: No Validation for ${httpMethod}: ${req.path} body provided, you should probably add validation to your model`);
		} else {
			validationErrors.push(Joi.validate(req.body, httpMethod.validation.body));
		}

		if (req.params && (!httpMethod.validation && !httpMethod.validation.params)) {
			log(`warning: No Validation for ${httpMethod}: ${req.path} params provided, you should probably add validation to your model`);
		} else {
			validationErrors.push(Joi.validate(req.params, httpMethod.validation.params));
		}

		if (req.query && (!httpMethod.validation && !httpMethod.validation.query)) {
			console.log(`warning: No Validation for ${httpMethod}: ${req.path} query provided, you should probably add validation to your model`);
		} else {
			validationErrors.push(Joi.validate(req.query, httpMethod.validation.query));
		}
		const validationErrorsFiltered = validationErrors.filter(v => v.error.isJoi);
		if (validationErrorsFiltered.length) return next(validationErrorsFiltered);
		return next();
	};
}

const getHandler = createValidationHandler(GET);
const postHandler = createValidationHandler(POST);
const putHandler = createValidationHandler(PUT);
const deleteHandler = createValidationHandler(DELETE);

const handlers = {
	[GET]: getHandler,
	[POST]: postHandler,
	[PUT]: putHandler,
	[DELETE]: deleteHandler,
};

module.exports = (req, res, next) => {
	const handler = handlers[req.method];

	const listName = capitalize(req.params.list);
	const list = keystone.list(listName);
	if (!list.publicMethods || !handler) return res.status(404).json({ message: `${req.path} not found` });

	req.list = list;
	handler(req, res, next);
};
