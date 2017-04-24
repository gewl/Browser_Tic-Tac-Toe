'use strict'

import path from 'path';
import express from 'express';

export default function(app) {

	const root = path.join(__dirname, '..','..','..')
	app.setValue("projectRoot", root)
	const publicPath = path.join(root, './public');
	const browserPath = path.join(root, './browser');

	app.use(express.static(publicPath));
	app.use(express.static(browserPath));
}
