`use strict`

export default class State {
	constructor(aiMovesCount = 0, turn = "X", terminal = false, board = []) {
		this.winner = null

		Object.assign(this, { aiMovesCount, turn, terminal })

		this.board = board.map(row => row.slice(0))
	}

	nextTurn() {
		this.turn = this.turn === "X" ? "O" : "X";
	}

	getEmptyCells() {
		let emptyCells = []

		this.board.forEach(( row, y ) => {
			row.forEach(( cell, x ) => {
				if (!cell) {
					emptyCells.push([x, y])
				}
			})
		})

		return emptyCells
	}

	checkForWin(piece) {
		var B = this.board;

		//check rows
		for (let y = 0; y < 3; y++) {
			let firstCell = B[y][0]
			if (firstCell === piece && B[y][1] === firstCell && B[y][2] === firstCell) {
				this.winner = firstCell
				return true;
			}
		}

		//check columns
		for (let x = 0; x < 3; x++) {
			let firstCell = B[0][x]
			if(firstCell === piece && B[1][x] === firstCell && B[2][x] === firstCell) {
				this.winner = firstCell
				return true;
			}
		}

		//check diagonals
		if (B[0][0] === piece && B[1][1] === piece && B[2][2] === piece) {
			this.winner = B[0][0]
			return true
		}
		if (B[0][2] === piece && B[1][1] === piece && B[2][0] === piece) {
			this.winner = B[0][2]
			return true
		}

		let available = this.getEmptyCells();
		if (available.length == 0) {
			//the game is draw
			this.winner = "draw"; 
			return true;
		} else {
			return false;
		}
	}

	isTerminal() {
		if (this.checkForWin("X")) {
			this.winner = "player"
			return true
		} else if (this.checkForWin("O")) {
			this.winner = "computer"
			return true
		} else if (!this.getEmptyCells().length) {
			this.winner = "draw"
			return true
		} else {
			return false
		}
	}
}
