const keystone = require('keystone');
const Types = keystone.Field.Types;
const Joi = require('joi');
/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

User.publicMethods = {
	list: {
		sanitize: ({ name, email }) => ({ name, email }),
	},
	post: {
		sanitize: ({ name, email }) => ({ name, email }),
		validation: {
			body: Joi.schema({
				name: Joi.object().keys({
					first: Joi.string(),
					last: Joi.string(),
				}),
				email: Joi.string().email(),
			}),
		},
	},
};

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
