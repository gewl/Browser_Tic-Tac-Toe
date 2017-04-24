import Board from './board';
import Socket from './socket';

export default class Game {
	constructor(socketInstance) {
		this.socket = new Socket(socketInstance, this);
		this.handleWin = this.handleWin.bind(this)
		this.handleDraw = this.handleDraw.bind(this)

		this._init()

		let board = new Board()
		board.passGame(this)
		board.drawBoard()
		this.board = board
	}

	_init() {
		// empty board
		this.gameState = [
			[ null, null, null ],
			[ null, null, null ],
			[ null, null, null ]
		]

		this.playerPiece = "X"
		this.computerPiece = this.playerPiece === "X" ? "O" : "X"
		this.isPlayerTurn = true
		this.gameOver = false;
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
		let { board, socket, handleWin, handleDraw, gameState } = this, boardWidth = gameState.length;
		this.gameState[y][x] = piece
		board.drawBoard()

		// check for win after move made
		// rows
		for (let i = 0; i < boardWidth; i++) {
			if (gameState[y][i] != piece) {
				break;
			}
			if (i === boardWidth-1) {
			 	handleWin(piece)
			}
		}

		// columns
		for (let i = 0; i < boardWidth; i++) {
			if (gameState[i][x] != piece) {
				break;
			}
			if (i === boardWidth-1) {
				handleWin(piece)
			}
		}

		// upper-left to bottom-right diagonal
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

		// upper-right to bottom-left diagonal
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
			if (!gameState.some(row => row.some(cell => !cell))) {
				handleDraw()
			} else if (this.isPlayerTurn) {
				socket.sendGameState(gameState)		
				this.isPlayerTurn = false
			} else {
				this.isPlayerTurn = true
			}
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

	handleDraw() {
		this.gameOver = true;

		this.board.writeText("It's a draw!");
	}

	// used in case of redundant game starting from server
	// which causes undesirable board duplicates
	wipe() {
		this.board.deleteBoard()
	}
}
