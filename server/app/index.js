`use strict`

import path from 'path';
import express from 'express';
const app = express();

export default function() {
	require('./middleware').default(app);

	//middleware to serve proper 404s to urls that prompt 
	//server to attempt to serve from express.static
	app.use( ( req, res, next) => {
		if (path.extname(req.path).length > 0) {
			res.status(404).end()
		} else {
			next(null)
		}
	})

	app.get('./*', ( req, res ) => {
		res.sendFile('index.html')
	})

	return app;
}
