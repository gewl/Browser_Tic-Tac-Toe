`use strict`
import _ from 'lodash'

export default class State {
	constructor() {
		this.board = []
		this.turn = null
		this.aiMovesCount = 0
		this.terminal = false
		this.winner = null
	}

	score() {
		if (this.terminal) {
			if (this.winner === "player") {
				return 10 - this.aiMovesCount
			} else if (this.winner === "computer") {
				return -10 + this.aiMovesCount
			} else {
				return 0
			}
		}
	}

	transfer(aiMovesCount, turn, terminal, board) {
		Object.assign(this, { aiMovesCount, turn, terminal })
		
		this.board = _.clone(board)

		return this
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
			if(firstCell && B[y][1] === firstCell && B[y][2] === firstCell) {
				this.winner = firstCell
				return true;
			}
		}

		//check columns
		for (let x = 0; x < 3; x++) {
			let firstCell = B[0][x]
			if(firstCell && B[1][x] === firstCell && B[2][x] === firstCell) {
				this.winner = firstCell
				return true;
			}
		}

		//check diagonals
		if (B[0][0] && B[1][1] === B[0][0] && B[2][2] === B[0][0]) {
			this.winner = B[0][0]
			return true
		}
		if (B[0][2] && B[1][1] === B[0][2] && B[2][0] === B[0][2]) {
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
	} else if (!this.getEmptyCells.length) {
		this.winner = "draw"
		return true
	} else {
		return false
	}
}
}
