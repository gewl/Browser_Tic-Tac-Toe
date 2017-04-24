`use strict`

import socketio from 'socket.io';
import AI from '../game_logic/ai.js'

export default class SocketServer {
	constructor(server) {
		const io = socketio.listen(server)

		io.sockets.on('connection', this.connectionCb)
	}

	// on connection, sends gameStart trigger for
	// client to instantiate board & game.
	connectionCb(socket) {
		console.log(`Socket connected: ${socket.id}`);
		socket.emit('gameStart')

		socket.on('clientPassState', state => {
			let ai = new AI(state)	
			let moveCoords = ai.move()

			socket.emit('serverPassMove', moveCoords)
		})
	}

}
