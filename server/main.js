`use strict`

import chalk from 'chalk';
import express from 'express';
const path = require('path');
import SocketServer from './sockets';

const app = require('./app').default()

const port = process.env.PORT || 4040;
const server = app.listen(port, (err) => {
	if (err) throw err;
	console.log(chalk.cyan(`Server listening on port ${port}.`))
});

//instantiate socketServer which handles io
const socketServer = new SocketServer(server)
