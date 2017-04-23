`use strict`

import socketio from 'socket.io';
import AI from '../ai'

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
			let move = AI.move(state)

			socket.emit('serverPassMove', move)
		})
	}

}

function generateRandomMove(state) {
	let testX = Math.floor(Math.random() * 3)
	let testY = Math.floor(Math.random() * 3)

	while (state[testY][testX] != null) {
		testX = Math.floor(Math.random() * 3)
		testY = Math.floor(Math.random() * 3)
	}

	return { x: testX, y: testY }
}
