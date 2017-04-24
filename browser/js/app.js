import Game from './game';

let socket = io.connect('http://localhost:4040')
let resetButton = document.getElementById('reset')
let panel = document.getElementById('feedback')
var game = null;

socket.on('gameStart', () => {
	if (game) {
		game.wipe()
	}

	game = new Game(socket)
	panelToggle()
})


resetButton.onclick = function(e) {
	if (game) {
		game.wipe()
	}
	socket.disconnect()
	socket = io.connect('http://localhost:4040')

	game = new Game(socket)
}

export function panelToggle() {
	let currentClass = panel.classList.contains('loading') ? 'loading' : 'ready'
	let nextClass = currentClass === 'loading' ? 'ready' : 'loading'
	let newText = currentClass === 'loading' ? 'It\'s your turn!' : 'It\'s the AI\'s turn.'

	panel.classList.add(nextClass)
	panel.classList.remove(currentClass)
	panel.textContent = newText
}
