require('dotenv').config();
const keystone = require('keystone');
// const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

keystone.init({
	'cookie secret': process.env.COOKIE_SECRET || 'secret',
	'name': 'next-keystone❤️',
	'user model': 'User',
	'auto update': true,
	'auth': true,
});

keystone.import('models');

app.prepare()
.then(() => {
	keystone.set('routes', require('./routes')(app));
	keystone.start();
});
