import Game from './game';

export default class Board {
	constructor(properties) {
		// create canvas
		const canvas = document.createElement("canvas")
		// maintaining reference to HTML5 canvas for rendering
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// setting dimensions
		let boardWidth = 450
		canvas.width = boardWidth
		canvas.height = boardWidth

		// sizing
		this.boardWidth = boardWidth;
		this.cellWidth = boardWidth/3;

		//event listener for clicks to allow piece movement
		canvas.addEventListener('mousedown', e => {
			let mouse = this.getMouse(e)
		})

		let stretcher = document.getElementById("stretcher")
		stretcher.appendChild(canvas);
	}

	getMouse(event) {
		let { cellWidth } = this;

		// click coordinate
		let x = Math.floor( event.offsetX / cellWidth )
		let y = Math.floor( event.offsetY / cellWidth )

		// pass coordinates to Game method
		this.game.evaluateClick(x, y)
	}

	drawPiece(type, x, y) {
		let { cellWidth, ctx } = this
		if (type === "O") {
			ctx.beginPath();
			ctx.arc(x + cellWidth/2, y + cellWidth/2, cellWidth/2 - 3,0,Math.PI*2,true);
			ctx.lineWidth = 2
			ctx.stroke();
		} else if (type === "X") {
			ctx.beginPath()
			ctx.moveTo(x + 10, y + 10)
			ctx.lineTo(x + cellWidth - 10, y + cellWidth - 10)
			ctx.moveTo(x + cellWidth - 10, y + 10)
			ctx.lineTo(x + 10, y + cellWidth - 10)
			ctx.lineWidth = 2
			ctx.stroke()
		}
	}

	drawPieces(gameState) {
		let { cellWidth, ctx } = this

		gameState.forEach(( row, y ) => {
			row.forEach(( square, x ) => {
				if (square) {
					this.drawPiece(square, x * cellWidth, y * cellWidth)
				}
			})
		})
	}

	passGame(game) {
		this.game = game
	}

	drawBoard() {
		let { game } = this

		this.ctx.clearRect(0, 0, this.boardWidth, this.boardWidth)
		let gameState = game.getState()

		this.render()
		this.drawPieces(gameState)
	}

	writeText(text) {
		let { ctx, boardWidth } = this
		let dim = boardWidth/2
		ctx.textAlign = 'center'
		ctx.font = '72px Helvetica'
		ctx.fillStyle = 'white'
		ctx.strokeStyle = 'black'
		ctx.fillText(text, dim, dim)
		ctx.strokeText(text, dim, dim)
		ctx.fill()
		ctx.stroke()
	}

	render() {
		let { ctx, boardWidth, cellWidth } = this

		ctx.strokeStyle = 'black'
		for (let i = cellWidth; i < boardWidth; i += cellWidth)	 {
			ctx.beginPath()
			ctx.moveTo(i, 0)
			ctx.lineTo(i, boardWidth)
			ctx.moveTo(0, i)
			ctx.lineTo(boardWidth, i)
			ctx.lineWidth = 2
			ctx.stroke()
		}
	}

	deleteBoard() {
		document.body.removeChild(this.canvas)
	}
}
