import Game from './game';

let socket = io.connect('http://localhost:4040')
let game = null;

socket.on('gameStart', () => {
	if (game) {
		game.wipe()
	}

	game = new Game(socket)
})
