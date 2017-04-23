`use strict`

import State from './state.js'

// this (and other server-side game code) thanks in large part to
// https://mostafa-samir.github.io/Tic-Tac-Toe-AI/

export default class AI {
	constructor() {
		this.turn = "O"
	}

	getMinimaxValue(state) {
		if (state.isTerminal()) {
			return state.score()
		} else {
			let stateScore

			if (state.turn === "X") {
				stateScore = -1000
			} else {
				stateScore = 1000
			}

			let availablePositions = state.emptyCells()

			let availableNextStates = availablePositions.map(pos => { 
				let action = new AIAction(pos);

				let nextState = action.applyTo(state);

				return nextState;
			})

			availableNextStates.forEach(nextState => {
				let nextScore = minimaxValue(nextState); //recursive call

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

	move(board) {
		let currentState = new State().transfer(0, "O", false, board)

		let availableCells = currentState.getEmptyCells()

		let availableActions = availableCells.map( coords => {
			let action = new AIAction(coords)

			let next = action.applyTo(currentState)
			action.minimaxVal = this.getMinimaxValue(next)

			return action
		})

		availableActions.sort(AIAction.sortDescending)		

		let chosenAction = availableActions[0].moveCoords

		return chosenAction
	}

	plays(state) {
		this.state = state
	}
}

export class AIAction {
	// @param coords [Array]: [x, y]
	constructor(coords) {
		this.moveCoords = coords
		this.minimaxVal = 0
	}

	applyTo (state) {
		let next = new State();
		let actionX = this.moveCoords[0]
		let actionY = this.moveCoords[1]

		next.transfer(state.aiMovesCount, state.turn, state.terminal, state.board)

		next.board[actionY][actionX] = state.turn;

		if(state.turn === "O") {
			next.aiMovesCount++;
		}

		next.nextTurn();

		return next;
	}

	sortAscending (firstAction, secondAction) {
		if (firstAction.minimaxVal < secondAction.minimaxVal) {
			return -1 // benefits O
		} else if (firstAction.minimaxVal > secondAction.minimaxVal) {
			return 1  // benefits X
		} else {
			return 0 // draw
		}
	}

	sortDescending (firstAction, secondAction) {
		if (firstAction.minimaxVal > secondAction.minimaxVal) {
			return -1 // benefits X
		} else if (firstAction.minimaxVal < secondAction.minimaxVal) {
			return 1  // benefits O
		} else {
			return 0 // draw
		}
	}
}
