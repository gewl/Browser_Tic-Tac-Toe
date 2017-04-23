export default class Socket {
	constructor(socket, game) {
		this.socket = socket
		this.game = game;

		socket.on('serverPassMove', move => {
			let { x, y } = move
			setTimeout(() => this.game.move(x, y), 1000)
		})
	}

	sendGameState(gameState) {
		this.socket.emit('clientPassState', gameState)
	}
}

