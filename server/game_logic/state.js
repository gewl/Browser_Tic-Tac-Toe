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

	transfer(aiMovesCount, turn, terminal, board) {
		Object.assign(this, { aiMovesCount, turn, terminal })
		
		this.board = _.clone(board)
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
		let { board } = this, boardWidth = board.length

		for (let i = 0; i < boardWidth; i++) {
			if (board[y][i] != piece) {
				break;
			}
			if (i === boardWidth-1) {
			 	return true
			}
		}

		for (let i = 0; i < boardWidth; i++) {
			if (board[i][x] != piece) {
				break;
			}
			if (i === boardWidth-1) {
				return true
			}
		}

		if (x === y) { 
			for (let i = 0; i < boardWidth; i++) {
				if (board[i][i] != piece) {
					break;
				}

				if (i === boardWidth-1) {
					return true
				}
			}
		}	
		if (x + y === boardWidth-1) { 
			for (let i = 0; i < boardWidth; i++) {
				if (board[i][(boardWidth-1) - i] != piece) {
					break;
				}

				if (i === boardWidth-1) {
					return true
				}
			}
		}

		return false
	}

	isTerminal() {
		if (checkForWin("X")) {
			this.winner = "player"
			return true
		} else if (checkForWin("O")) {
			this.winner = "computer"
			return true
		} else if (!getEmptyCells.length) {
			this.winner = "draw"
			return true
		} else {
			return false
		}
	}
}
