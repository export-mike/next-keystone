const keystone = require('keystone');
const Joi = require('joi');
const HEAD = 'HEAD';
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
		let validationErrors;
		const { [method]: httpMethod } = req.list.publicMethods;
		if (req.body && (!httpMethod.validation && !httpMethod.validation.body)) {
			log(`warning: No Validation for ${httpMethod}: ${req.path} body provided, you should probably add validation to your model`);
		} else {
			validationErrors = {
				body: Joi.validate(req.body, httpMethod.validation.body),
			};
		}

		if (req.params && (!httpMethod.validation && !httpMethod.validation.params)) {
			log(`warning: No Validation for ${httpMethod}: ${req.path} params provided, you should probably add validation to your model`);
		} else {

			validationErrors = Object.assign({}, req.validationErrors, {
				params: Joi.validate(req.params, httpMethod.validation.params),
			});
		}

		if (req.query && (!httpMethod.validation && !httpMethod.validation.query)) {
			console.log(`warning: No Validation for ${httpMethod}: ${req.path} query provided, you should probably add validation to your model`);
		} else {
			validationErrors = Object.assign({}, req.validationErrors, {
				query: Joi.validate(req.query, httpMethod.validation.query),
			});
		}

		next(validationErrors);
	};
}

const getHandler = createValidationHandler(GET);
const postHandler = createValidationHandler(POST);
const putHandler = createValidationHandler(PUT);
const deleteHandler = createValidationHandler(DELETE);

function headHandler (req, res, next) {
	next();
}

const handlers = {
	[GET]: getHandler,
	[POST]: postHandler,
	[PUT]: putHandler,
	[DELETE]: deleteHandler,
	[HEAD]: headHandler,
};

module.exports = (req, res, next) => {
	const handler = handlers[req.method];
	if (!handler) return next();

	const listName = capitalize(req.params.list);
	const list = keystone.list(listName);
	if (!list.publicMethods) return next();

	req.list = list;
	handler(req, res, next);
};
