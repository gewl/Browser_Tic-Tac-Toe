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

		// array holding winning moves, highest priority
		let movesToWin = []
		// array holding desirable moves + associated winning moves, second-highest priority
		let desirableMoves = []

		socket.on('clientPassState', state => {
			let ai = new AI()
			let moveCoords = ai.move(state)

			socket.emit('serverPassMove', { x: moveCoords[0], y: moveCoords[1] })
		})
	}

}
