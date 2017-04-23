(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = io.connect('http://localhost:4040');
var game = null;

socket.on('gameStart', function () {
	if (game) {
		game.wipe();
	}

	game = new _game2.default(socket);
});

},{"./game":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Board = function () {
	function Board(properties) {
		var _this = this;

		_classCallCheck(this, Board);

		// create canvas
		var canvas = document.createElement("canvas");
		// maintaining reference to HTML5 canvas for rendering
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		// setting dimensions
		var boardWidth = 450;
		canvas.width = boardWidth;
		canvas.height = boardWidth;

		// sizing
		this.boardWidth = boardWidth;
		this.cellWidth = boardWidth / 3;

		//event listener for clicks to allow piece movement
		canvas.addEventListener('mousedown', function (e) {
			var mouse = _this.getMouse(e);
		});

		document.body.appendChild(canvas);
	}

	_createClass(Board, [{
		key: "getMouse",
		value: function getMouse(event) {
			var cellWidth = this.cellWidth;

			// click coordinate

			var x = Math.floor(event.offsetX / cellWidth);
			var y = Math.floor(event.offsetY / cellWidth);

			// pass coordinates to Game method
			this.game.evaluateClick(x, y);
		}
	}, {
		key: "drawPiece",
		value: function drawPiece(type, x, y) {
			var cellWidth = this.cellWidth,
			    ctx = this.ctx;

			if (type === "O") {
				ctx.beginPath();
				ctx.arc(x + cellWidth / 2, y + cellWidth / 2, cellWidth / 2 - 3, 0, Math.PI * 2, true);
				ctx.lineWidth = 2;
				ctx.stroke();
			} else if (type === "X") {
				ctx.beginPath();
				ctx.moveTo(x + 10, y + 10);
				ctx.lineTo(x + cellWidth - 10, y + cellWidth - 10);
				ctx.moveTo(x + cellWidth - 10, y + 10);
				ctx.lineTo(x + 10, y + cellWidth - 10);
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}
	}, {
		key: "drawPieces",
		value: function drawPieces(gameState) {
			var _this2 = this;

			var cellWidth = this.cellWidth,
			    ctx = this.ctx;


			gameState.forEach(function (row, y) {
				row.forEach(function (square, x) {
					if (square) {
						_this2.drawPiece(square, x * cellWidth, y * cellWidth);
					}
				});
			});
		}
	}, {
		key: "passGame",
		value: function passGame(game) {
			this.game = game;
		}
	}, {
		key: "drawBoard",
		value: function drawBoard() {
			var game = this.game;


			this.ctx.clearRect(0, 0, this.boardWidth, this.boardWidth);
			var gameState = game.getState();

			this.render();
			this.drawPieces(gameState);
		}
	}, {
		key: "writeText",
		value: function writeText(text) {
			var ctx = this.ctx;

			ctx.font = '72px Helvetica';
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
			ctx.fillText(text, 100, 240);
			ctx.strokeText(text, 100, 240);
			ctx.fill();
			ctx.stroke();
			var text = ctx.measureText(text);
		}
	}, {
		key: "render",
		value: function render() {
			var ctx = this.ctx,
			    boardWidth = this.boardWidth,
			    cellWidth = this.cellWidth;


			ctx.strokeStyle = 'black';
			for (var i = cellWidth; i < boardWidth; i += cellWidth) {
				ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.lineTo(i, boardWidth);
				ctx.moveTo(0, i);
				ctx.lineTo(boardWidth, i);
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}
	}, {
		key: "deleteBoard",
		value: function deleteBoard() {
			document.body.removeChild(this.canvas);
		}
	}]);

	return Board;
}();

exports.default = Board;

},{"./game":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _board = require('./board');

var _board2 = _interopRequireDefault(_board);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
	function Game(socketInstance) {
		_classCallCheck(this, Game);

		// empty board
		this.gameState = [[null, null, null], [null, null, null], [null, null, null]];

		this.socket = new _socket2.default(socketInstance, this);

		var board = new _board2.default();
		board.passGame(this);
		board.drawBoard();

		this.playerPiece = "X";
		this.computerPiece = this.playerPiece === "X" ? "O" : "X";
		this.isPlayerTurn = true;
		this.board = board;
		this.gameOver = false;

		this.handleWin = this.handleWin.bind(this);
	}

	_createClass(Game, [{
		key: 'getState',
		value: function getState() {
			return this.gameState;
		}
	}, {
		key: 'evaluateClick',
		value: function evaluateClick(x, y) {
			var isPlayerTurn = this.isPlayerTurn,
			    playerPiece = this.playerPiece,
			    board = this.board,
			    gameOver = this.gameOver;
			// check if legal move

			if (!this.gameState[y][x] && isPlayerTurn && !gameOver) {
				this.move(x, y, playerPiece);
			}
		}

		// default parameter for piece to make passing moves back from server easier

	}, {
		key: 'move',
		value: function move(x, y) {
			var piece = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.computerPiece;
			var board = this.board,
			    socket = this.socket,
			    handleWin = this.handleWin,
			    handleDraw = this.handleDraw,
			    gameState = this.gameState,
			    boardWidth = gameState.length;

			this.gameState[y][x] = piece;
			board.drawBoard();

			// check for win after move made
			// rows
			for (var i = 0; i < boardWidth; i++) {
				if (gameState[y][i] != piece) {
					break;
				}
				if (i === boardWidth - 1) {
					handleWin(piece);
				}
			}

			// columns
			for (var _i = 0; _i < boardWidth; _i++) {
				if (gameState[_i][x] != piece) {
					break;
				}
				if (_i === boardWidth - 1) {
					handleWin(piece);
				}
			}

			// upper-left to bottom-right diagonal
			if (x === y) {
				for (var _i2 = 0; _i2 < boardWidth; _i2++) {
					if (gameState[_i2][_i2] != piece) {
						break;
					}

					if (_i2 === boardWidth - 1) {
						handleWin(piece);
					}
				}
			}

			// upper-right to bottom-left diagonal
			if (x + y === boardWidth - 1) {
				for (var _i3 = 0; _i3 < boardWidth; _i3++) {
					if (gameState[_i3][boardWidth - 1 - _i3] != piece) {
						break;
					}

					if (_i3 === boardWidth - 1) {
						handleWin(piece);
					}
				}
			}

			var areAvailableMoves = gameState.some(function (row) {
				return row.some(function (cell) {
					return !cell;
				});
			});

			if (!areAvailableMoves) {
				handleDraw();
			}

			if (!this.gameOver) {
				if (this.isPlayerTurn) {
					socket.sendGameState(gameState);
					this.isPlayerTurn = false;
				} else {
					this.isPlayerTurn = true;
				}
			}
		}
	}, {
		key: 'handleWin',
		value: function handleWin(piece) {
			var playerPiece = this.playerPiece,
			    board = this.board;

			this.gameOver = true;

			if (piece === playerPiece) {
				board.writeText("You win!");
			} else {
				board.writeText("You lose!");
			}
		}
	}, {
		key: 'handleDraw',
		value: function handleDraw() {
			this.gameOver = true;

			this.board.writeText("It's a draw!");
		}

		// used in case of redundant game starting from server
		// which causes undesirable board duplicates

	}, {
		key: 'wipe',
		value: function wipe() {
			this.board.deleteBoard();
		}
	}]);

	return Game;
}();

exports.default = Game;

},{"./board":2,"./socket":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Socket = function () {
	function Socket(socket, game) {
		var _this = this;

		_classCallCheck(this, Socket);

		this.socket = socket;
		this.game = game;

		socket.on('serverPassMove', function (move) {
			var x = move.x,
			    y = move.y;
			// setTimeout(() => this.game.move(x, y), 1000)

			_this.game.move(x, y);
		});
	}

	_createClass(Socket, [{
		key: 'sendGameState',
		value: function sendGameState(gameState) {
			this.socket.emit('clientPassState', gameState);
		}
	}]);

	return Socket;
}();

exports.default = Socket;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyL2pzL2FwcC5qcyIsImJyb3dzZXIvanMvYm9hcmQuanMiLCJicm93c2VyL2pzL2dhbWUuanMiLCJicm93c2VyL2pzL3NvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLElBQUksU0FBUyxHQUFHLE9BQUgsQ0FBVyx1QkFBWCxDQUFiO0FBQ0EsSUFBSSxPQUFPLElBQVg7O0FBRUEsT0FBTyxFQUFQLENBQVUsV0FBVixFQUF1QixZQUFNO0FBQzVCLEtBQUksSUFBSixFQUFVO0FBQ1QsT0FBSyxJQUFMO0FBQ0E7O0FBRUQsUUFBTyxtQkFBUyxNQUFULENBQVA7QUFDQSxDQU5EOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLFVBQVosRUFBd0I7QUFBQTs7QUFBQTs7QUFDdkI7QUFDQSxNQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQTtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLEdBQUwsR0FBVyxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWDs7QUFFQTtBQUNBLE1BQUksYUFBYSxHQUFqQjtBQUNBLFNBQU8sS0FBUCxHQUFlLFVBQWY7QUFDQSxTQUFPLE1BQVAsR0FBZ0IsVUFBaEI7O0FBRUE7QUFDQSxPQUFLLFVBQUwsR0FBa0IsVUFBbEI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsYUFBVyxDQUE1Qjs7QUFFQTtBQUNBLFNBQU8sZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsYUFBSztBQUN6QyxPQUFJLFFBQVEsTUFBSyxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0EsR0FGRDs7QUFJQSxXQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0E7Ozs7MkJBRVEsSyxFQUFPO0FBQUEsT0FDVCxTQURTLEdBQ0ssSUFETCxDQUNULFNBRFM7O0FBR2Y7O0FB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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmxldCBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjQwNDAnKVxubGV0IGdhbWUgPSBudWxsO1xuXG5zb2NrZXQub24oJ2dhbWVTdGFydCcsICgpID0+IHtcblx0aWYgKGdhbWUpIHtcblx0XHRnYW1lLndpcGUoKVxuXHR9XG5cblx0Z2FtZSA9IG5ldyBHYW1lKHNvY2tldClcbn0pXG4iLCJpbXBvcnQgR2FtZSBmcm9tICcuL2dhbWUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb2FyZCB7XG5cdGNvbnN0cnVjdG9yKHByb3BlcnRpZXMpIHtcblx0XHQvLyBjcmVhdGUgY2FudmFzXG5cdFx0Y29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxuXHRcdC8vIG1haW50YWluaW5nIHJlZmVyZW5jZSB0byBIVE1MNSBjYW52YXMgZm9yIHJlbmRlcmluZ1xuXHRcdHRoaXMuY2FudmFzID0gY2FudmFzO1xuXHRcdHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuXHRcdC8vIHNldHRpbmcgZGltZW5zaW9uc1xuXHRcdGxldCBib2FyZFdpZHRoID0gNDUwXG5cdFx0Y2FudmFzLndpZHRoID0gYm9hcmRXaWR0aFxuXHRcdGNhbnZhcy5oZWlnaHQgPSBib2FyZFdpZHRoXG5cblx0XHQvLyBzaXppbmdcblx0XHR0aGlzLmJvYXJkV2lkdGggPSBib2FyZFdpZHRoO1xuXHRcdHRoaXMuY2VsbFdpZHRoID0gYm9hcmRXaWR0aC8zO1xuXG5cdFx0Ly9ldmVudCBsaXN0ZW5lciBmb3IgY2xpY2tzIHRvIGFsbG93IHBpZWNlIG1vdmVtZW50XG5cdFx0Y2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuXHRcdFx0bGV0IG1vdXNlID0gdGhpcy5nZXRNb3VzZShlKVxuXHRcdH0pXG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG5cdH1cblxuXHRnZXRNb3VzZShldmVudCkge1xuXHRcdGxldCB7IGNlbGxXaWR0aCB9ID0gdGhpcztcblxuXHRcdC8vIGNsaWNrIGNvb3JkaW5hdGVcblx0XHRsZXQgeCA9IE1hdGguZmxvb3IoIGV2ZW50Lm9mZnNldFggLyBjZWxsV2lkdGggKVxuXHRcdGxldCB5ID0gTWF0aC5mbG9vciggZXZlbnQub2Zmc2V0WSAvIGNlbGxXaWR0aCApXG5cblx0XHQvLyBwYXNzIGNvb3JkaW5hdGVzIHRvIEdhbWUgbWV0aG9kXG5cdFx0dGhpcy5nYW1lLmV2YWx1YXRlQ2xpY2soeCwgeSlcblx0fVxuXG5cdGRyYXdQaWVjZSh0eXBlLCB4LCB5KSB7XG5cdFx0bGV0IHsgY2VsbFdpZHRoLCBjdHggfSA9IHRoaXNcblx0XHRpZiAodHlwZSA9PT0gXCJPXCIpIHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKTtcblx0XHRcdGN0eC5hcmMoeCArIGNlbGxXaWR0aC8yLCB5ICsgY2VsbFdpZHRoLzIsIGNlbGxXaWR0aC8yIC0gMywwLE1hdGguUEkqMix0cnVlKTtcblx0XHRcdGN0eC5saW5lV2lkdGggPSAyXG5cdFx0XHRjdHguc3Ryb2tlKCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSBcIlhcIikge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpXG5cdFx0XHRjdHgubW92ZVRvKHggKyAxMCwgeSArIDEwKVxuXHRcdFx0Y3R4LmxpbmVUbyh4ICsgY2VsbFdpZHRoIC0gMTAsIHkgKyBjZWxsV2lkdGggLSAxMClcblx0XHRcdGN0eC5tb3ZlVG8oeCArIGNlbGxXaWR0aCAtIDEwLCB5ICsgMTApXG5cdFx0XHRjdHgubGluZVRvKHggKyAxMCwgeSArIGNlbGxXaWR0aCAtIDEwKVxuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDJcblx0XHRcdGN0eC5zdHJva2UoKVxuXHRcdH1cblx0fVxuXG5cdGRyYXdQaWVjZXMoZ2FtZVN0YXRlKSB7XG5cdFx0bGV0IHsgY2VsbFdpZHRoLCBjdHggfSA9IHRoaXNcblxuXHRcdGdhbWVTdGF0ZS5mb3JFYWNoKCggcm93LCB5ICkgPT4ge1xuXHRcdFx0cm93LmZvckVhY2goKCBzcXVhcmUsIHggKSA9PiB7XG5cdFx0XHRcdGlmIChzcXVhcmUpIHtcblx0XHRcdFx0XHR0aGlzLmRyYXdQaWVjZShzcXVhcmUsIHggKiBjZWxsV2lkdGgsIHkgKiBjZWxsV2lkdGgpXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSlcblx0fVxuXG5cdHBhc3NHYW1lKGdhbWUpIHtcblx0XHR0aGlzLmdhbWUgPSBnYW1lXG5cdH1cblxuXHRkcmF3Qm9hcmQoKSB7XG5cdFx0bGV0IHsgZ2FtZSB9ID0gdGhpc1xuXG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuYm9hcmRXaWR0aCwgdGhpcy5ib2FyZFdpZHRoKVxuXHRcdGxldCBnYW1lU3RhdGUgPSBnYW1lLmdldFN0YXRlKClcblxuXHRcdHRoaXMucmVuZGVyKClcblx0XHR0aGlzLmRyYXdQaWVjZXMoZ2FtZVN0YXRlKVxuXHR9XG5cblx0d3JpdGVUZXh0KHRleHQpIHtcblx0XHRsZXQgeyBjdHggfSA9IHRoaXNcblx0XHRjdHguZm9udCA9ICc3MnB4IEhlbHZldGljYSdcblx0XHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcblx0XHRjdHguZmlsbFRleHQodGV4dCwgMTAwLCAyNDApXG5cdFx0Y3R4LnN0cm9rZVRleHQodGV4dCwgMTAwLCAyNDApXG5cdFx0Y3R4LmZpbGwoKVxuXHRcdGN0eC5zdHJva2UoKVxuXHRcdHZhciB0ZXh0ID0gY3R4Lm1lYXN1cmVUZXh0KHRleHQpXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHsgY3R4LCBib2FyZFdpZHRoLCBjZWxsV2lkdGggfSA9IHRoaXNcblxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcblx0XHRmb3IgKGxldCBpID0gY2VsbFdpZHRoOyBpIDwgYm9hcmRXaWR0aDsgaSArPSBjZWxsV2lkdGgpXHQge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpXG5cdFx0XHRjdHgubW92ZVRvKGksIDApXG5cdFx0XHRjdHgubGluZVRvKGksIGJvYXJkV2lkdGgpXG5cdFx0XHRjdHgubW92ZVRvKDAsIGkpXG5cdFx0XHRjdHgubGluZVRvKGJvYXJkV2lkdGgsIGkpXG5cdFx0XHRjdHgubGluZVdpZHRoID0gMlxuXHRcdFx0Y3R4LnN0cm9rZSgpXG5cdFx0fVxuXHR9XG5cblx0ZGVsZXRlQm9hcmQoKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcylcblx0fVxufVxuIiwiaW1wb3J0IEJvYXJkIGZyb20gJy4vYm9hcmQnO1xuaW1wb3J0IFNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuXHRjb25zdHJ1Y3Rvcihzb2NrZXRJbnN0YW5jZSkge1xuXHRcdC8vIGVtcHR5IGJvYXJkXG5cdFx0dGhpcy5nYW1lU3RhdGUgPSBbXG5cdFx0XHRbIG51bGwsIG51bGwsIG51bGwgXSxcblx0XHRcdFsgbnVsbCwgbnVsbCwgbnVsbCBdLFxuXHRcdFx0WyBudWxsLCBudWxsLCBudWxsIF1cblx0XHRdXG5cblx0XHR0aGlzLnNvY2tldCA9IG5ldyBTb2NrZXQoc29ja2V0SW5zdGFuY2UsIHRoaXMpO1xuXG5cdFx0bGV0IGJvYXJkID0gbmV3IEJvYXJkKClcblx0XHRib2FyZC5wYXNzR2FtZSh0aGlzKVxuXHRcdGJvYXJkLmRyYXdCb2FyZCgpXG5cblx0XHR0aGlzLnBsYXllclBpZWNlID0gXCJYXCJcblx0XHR0aGlzLmNvbXB1dGVyUGllY2UgPSB0aGlzLnBsYXllclBpZWNlID09PSBcIlhcIiA/IFwiT1wiIDogXCJYXCJcblx0XHR0aGlzLmlzUGxheWVyVHVybiA9IHRydWVcblx0XHR0aGlzLmJvYXJkID0gYm9hcmRcblx0XHR0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cblx0XHR0aGlzLmhhbmRsZVdpbiA9IHRoaXMuaGFuZGxlV2luLmJpbmQodGhpcylcblx0fVxuXG5cdGdldFN0YXRlKCkge1xuXHRcdHJldHVybiB0aGlzLmdhbWVTdGF0ZVxuXHR9XG5cblx0ZXZhbHVhdGVDbGljayh4LCB5KSB7XG5cdFx0bGV0IHsgaXNQbGF5ZXJUdXJuLCBwbGF5ZXJQaWVjZSwgYm9hcmQsIGdhbWVPdmVyIH0gPSB0aGlzO1xuXHRcdC8vIGNoZWNrIGlmIGxlZ2FsIG1vdmVcblx0XHRpZiAoIXRoaXMuZ2FtZVN0YXRlW3ldW3hdICYmIGlzUGxheWVyVHVybiAmJiAhZ2FtZU92ZXIpIHtcblx0XHRcdHRoaXMubW92ZSh4LCB5LCBwbGF5ZXJQaWVjZSlcblx0XHR9IFxuXHR9XG5cblx0Ly8gZGVmYXVsdCBwYXJhbWV0ZXIgZm9yIHBpZWNlIHRvIG1ha2UgcGFzc2luZyBtb3ZlcyBiYWNrIGZyb20gc2VydmVyIGVhc2llclxuXHRtb3ZlKHgsIHksIHBpZWNlID0gdGhpcy5jb21wdXRlclBpZWNlKSB7XG5cdFx0bGV0IHsgYm9hcmQsIHNvY2tldCwgaGFuZGxlV2luLCBoYW5kbGVEcmF3LCBnYW1lU3RhdGUgfSA9IHRoaXMsIGJvYXJkV2lkdGggPSBnYW1lU3RhdGUubGVuZ3RoO1xuXHRcdHRoaXMuZ2FtZVN0YXRlW3ldW3hdID0gcGllY2Vcblx0XHRib2FyZC5kcmF3Qm9hcmQoKVxuXG5cdFx0Ly8gY2hlY2sgZm9yIHdpbiBhZnRlciBtb3ZlIG1hZGVcblx0XHQvLyByb3dzXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChnYW1lU3RhdGVbeV1baV0gIT0gcGllY2UpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHQgXHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gY29sdW1uc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZ2FtZVN0YXRlW2ldW3hdICE9IHBpZWNlKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGkgPT09IGJvYXJkV2lkdGgtMSkge1xuXHRcdFx0XHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdXBwZXItbGVmdCB0byBib3R0b20tcmlnaHQgZGlhZ29uYWxcblx0XHRpZiAoeCA9PT0geSkgeyBcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChnYW1lU3RhdGVbaV1baV0gIT0gcGllY2UpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpID09PSBib2FyZFdpZHRoLTEpIHtcblx0XHRcdFx0XHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB1cHBlci1yaWdodCB0byBib3R0b20tbGVmdCBkaWFnb25hbFxuXHRcdGlmICh4ICsgeSA9PT0gYm9hcmRXaWR0aC0xKSB7IFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdFx0aWYgKGdhbWVTdGF0ZVtpXVsoYm9hcmRXaWR0aC0xKSAtIGldICE9IHBpZWNlKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHRcdFx0aGFuZGxlV2luKHBpZWNlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGFyZUF2YWlsYWJsZU1vdmVzID0gZ2FtZVN0YXRlLnNvbWUocm93ID0+IHJvdy5zb21lKGNlbGwgPT4gIWNlbGwpKVxuXG5cdFx0aWYgKCFhcmVBdmFpbGFibGVNb3Zlcykge1xuXHRcdFx0aGFuZGxlRHJhdygpXG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmdhbWVPdmVyKSB7XG5cdFx0XHRpZiAodGhpcy5pc1BsYXllclR1cm4pIHtcblx0XHRcdFx0c29ja2V0LnNlbmRHYW1lU3RhdGUoZ2FtZVN0YXRlKVx0XHRcblx0XHRcdFx0dGhpcy5pc1BsYXllclR1cm4gPSBmYWxzZVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5pc1BsYXllclR1cm4gPSB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlV2luKHBpZWNlKSB7XG5cdFx0bGV0IHsgcGxheWVyUGllY2UsIGJvYXJkIH0gPSB0aGlzO1xuXHRcdHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG5cdFx0aWYgKHBpZWNlID09PSBwbGF5ZXJQaWVjZSkge1xuXHRcdFx0Ym9hcmQud3JpdGVUZXh0KFwiWW91IHdpbiFcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvYXJkLndyaXRlVGV4dChcIllvdSBsb3NlIVwiKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVEcmF3KCkge1xuXHRcdHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG5cdFx0dGhpcy5ib2FyZC53cml0ZVRleHQoXCJJdCdzIGEgZHJhdyFcIik7XG5cdH1cblxuXHQvLyB1c2VkIGluIGNhc2Ugb2YgcmVkdW5kYW50IGdhbWUgc3RhcnRpbmcgZnJvbSBzZXJ2ZXJcblx0Ly8gd2hpY2ggY2F1c2VzIHVuZGVzaXJhYmxlIGJvYXJkIGR1cGxpY2F0ZXNcblx0d2lwZSgpIHtcblx0XHR0aGlzLmJvYXJkLmRlbGV0ZUJvYXJkKClcblx0fVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0IHtcblx0Y29uc3RydWN0b3Ioc29ja2V0LCBnYW1lKSB7XG5cdFx0dGhpcy5zb2NrZXQgPSBzb2NrZXRcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xuXG5cdFx0c29ja2V0Lm9uKCdzZXJ2ZXJQYXNzTW92ZScsIG1vdmUgPT4ge1xuXHRcdFx0bGV0IHsgeCwgeSB9ID0gbW92ZVxuXHRcdFx0Ly8gc2V0VGltZW91dCgoKSA9PiB0aGlzLmdhbWUubW92ZSh4LCB5KSwgMTAwMClcblx0XHRcdHRoaXMuZ2FtZS5tb3ZlKHgsIHkpXG5cdFx0fSlcblx0fVxuXG5cdHNlbmRHYW1lU3RhdGUoZ2FtZVN0YXRlKSB7XG5cdFx0dGhpcy5zb2NrZXQuZW1pdCgnY2xpZW50UGFzc1N0YXRlJywgZ2FtZVN0YXRlKVxuXHR9XG59XG5cbiJdfQ==
