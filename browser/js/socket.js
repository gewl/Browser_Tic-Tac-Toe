export default class Socket {
	constructor(socket, game) {
		this.socket = socket
		this.game = game;

		socket.on('serverPassMove', moveObj => {
			let { piece, x, y } = moveObj
			setTimeout(() => this.game.move(piece, x, y), 1000)
		})
	}

	sendGameState(gameState) {
		this.socket.emit('clientPassBoard', gameState)
	}
}

