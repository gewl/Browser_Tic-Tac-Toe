import Board from './board';
import Socket from './socket';

export default class Game {
	constructor(socketInstance) {
		// empty board
		this.gameState = [
			[ null, null, null ],
			[ null, null, null ],
			[ null, 'X', null ]
		]

		this.socket = new Socket(socketInstance, this);

		let board = new Board()
		board.passGame(this)
		board.drawBoard()

		this.playerPiece = "X"
		this.computerPiece = this.playerPiece === "X" ? "O" : "X"
		this.isPlayerTurn = true
		this.board = board
		this.gameOver = false;

		this.handleWin = this.handleWin.bind(this)
	}

	getState() {
		return this.gameState
	}

	evaluateClick(x, y) {
		let { isPlayerTurn, playerPiece, board, gameOver } = this;
		// check if legal move
		if (!this.gameState[y][x] && isPlayerTurn && !gameOver) {
			this.move(x, y, playerPiece)
		} 
	}

	// default parameter for piece to make passing moves back from server easier
	move(x, y, piece = this.computerPiece) {
		let { board, socket, handleWin, gameState } = this, boardWidth = gameState.length;
		this.gameState[y][x] = piece
		board.drawBoard()

		// check for win after move made
		for (let i = 0; i < boardWidth; i++) {
			if (gameState[y][i] != piece) {
				break;
			}
			if (i === boardWidth-1) {
			 	handleWin(piece)
			}
		}

		for (let i = 0; i < boardWidth; i++) {
			if (gameState[i][x] != piece) {
				break;
			}
			if (i === boardWidth-1) {
				handleWin(piece)
			}
		}

		if (x === y) { 
			for (let i = 0; i < boardWidth; i++) {
				if (gameState[i][i] != piece) {
					break;
				}

				if (i === boardWidth-1) {
					handleWin(piece)
				}
			}
		}

		if (x + y === boardWidth-1) { 
			for (let i = 0; i < boardWidth; i++) {
				if (gameState[i][(boardWidth-1) - i] != piece) {
					break;
				}

				if (i === boardWidth-1) {
					handleWin(piece)
				}
			}
		}

		if (!this.gameOver) {
			if (this.isPlayerTurn) {
				socket.sendGameState(gameState)		
			}
			this.isPlayerTurn = !this.isPlayerTurn
		}
	}

	handleWin(piece) {
		let { playerPiece, board } = this;
		this.gameOver = true;

		if (piece === playerPiece) {
			board.writeText("You win!");
		} else {
			board.writeText("You lose!");
		}
	}

	// used in case of redundant game starting from server
	// which causes undesirable board duplicates
	wipe() {
		this.board.deleteBoard()
	}
}
