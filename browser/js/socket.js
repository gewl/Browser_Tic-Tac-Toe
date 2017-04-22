export default class Socket {
	constructor(socket, game) {
		this.socket = socket
		this.game = game;

		socket.on('serverPassMove', moveObj => {
			let { piece, x, y } = moveObj
			setTimeout(() => this.game.move(piece, x, y), 1000)
		})

		// socket.on('winEvent', board => {
		// 	setTimeout(() => this.game.onWin(board), 1000)
		// })

		// socket.on('loseEvent', board => {
		// 	setTimeout(() => this.game.onLose(board), 1000)
		// })
	}

	sendGameState(gameState) {
		this.socket.emit('clientPassBoard', gameState)
	}
}

