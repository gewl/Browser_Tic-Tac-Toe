`use strict`

// this (and other server-side game code) based heavily on
// https://mostafa-samir.github.io/Tic-Tac-Toe-AI/

export class AI {
	constructor() {
		this.turn = "O"
	}

	move(_state) {
		this.state = _state
	}
}

export class AIAction {
	constructor(coords) {
		this.moveCoords = coords
		this.minimaxVal = 0
	}

	applyTo (state) {
		let next = new State(state);

		next.board[this.movePosition] = state.turn;

		if(state.turn === "O")
			next.oMovesCount++;

		next.advanceTurn();

		return next;
	}
}
