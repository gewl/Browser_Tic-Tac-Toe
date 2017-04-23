`use strict`

import State from './state.js'

// this (and other server-side game code) thanks in large part to
// https://mostafa-samir.github.io/Tic-Tac-Toe-AI/

function gameScore(state) {
		if (state.winner === "player") {
			return 10 - state.aiMovesCount
		} else if (state.winner === "computer") {
			return -10 + state.aiMovesCount
		} else {
			return 0
		}
}

export default class AI {
	constructor(state) {
		this.board = state
	}

	getMinimaxValue(state) {
		if (state.isTerminal()) {
			return gameScore(state)
		} else {
			let stateScore

			if (state.turn === "X") {
				stateScore = -1000
			} else {
				stateScore = 1000
			}

			let availablePositions = state.getEmptyCells()

			let availableNextStates = availablePositions.map(coords => { 
				let x = coords[0]
				let y = coords[1]
				let action = new AIAction(x, y);

				let nextState = action.applyTo(state);

				return nextState;
			})

			availableNextStates.forEach(nextState => {
				let nextScore = this.getMinimaxValue(nextState); //recursive call

				if (state.turn === "X") {
					if (nextScore > stateScore) {
						stateScore = nextScore
					}
				} else {
					if (nextScore < stateScore) {
						stateScore = nextScore
					}
				}
			})

			return stateScore;
		}
	}

	move() {
		let currentState = new State(0, "O", false, this.board)

		let availableCells = currentState.getEmptyCells()

		let availableActions = availableCells.map( coords => {
			let moveX = coords[0]
			let moveY = coords[1]
			let action = new AIAction(moveX, moveY) // creates action object

			let next = action.applyTo(currentState) // applies action to yield new state
			action.minimaxVal = this.getMinimaxValue(next)

			return action
		})

		if (currentState.turn === "X") {
			availableActions.sort(sortDescending)		
		} else {
			availableActions.sort(sortAscending)		
		}

		let chosenAction = {
			x: availableActions[0].x,
			y: availableActions[0].y
		}

		return chosenAction
	}

	plays(state) {
		this.state = state
	}
}

export class AIAction {
	// @param coords [Array]: [x, y]
	constructor(x, y) {
		this.x = x
		this.y = y
		this.minimaxVal = 0
	}

	applyTo (state) {
		let { x, y } = this
		let next = new State(state.aiMovesCount, state.turn, state.terminal, state.board)

		next.board[y][x] = next.turn;

		if (state.turn === "O") {
			next.aiMovesCount++;
		}

		next.nextTurn();

		return next;
	}
}

function sortAscending (firstAction, secondAction) {
	if (firstAction.minimaxVal < secondAction.minimaxVal) {
		return -1 // benefits O
	} else if (firstAction.minimaxVal > secondAction.minimaxVal) {
		return 1  // benefits X
	} else {
		return 0 // draw
	}
}

function sortDescending (firstAction, secondAction) {
	if (firstAction.minimaxVal > secondAction.minimaxVal) {
		return -1 // benefits X
	} else if (firstAction.minimaxVal < secondAction.minimaxVal) {
		return 1  // benefits O
	} else {
		return 0 // draw
	}
}
