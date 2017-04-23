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

		var stretcher = document.getElementById("stretcher");
		stretcher.appendChild(canvas);
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
			var ctx = this.ctx,
			    boardWidth = this.boardWidth;

			var dim = boardWidth / 2;
			ctx.textAlign = 'center';
			ctx.font = '72px Helvetica';
			ctx.fillStyle = 'white';
			ctx.strokeStyle = 'black';
			ctx.fillText(text, dim, dim);
			ctx.strokeText(text, dim, dim);
			ctx.fill();
			ctx.stroke();
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
		this.handleDraw = this.handleDraw.bind(this);
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

			if (!this.gameOver) {
				if (!gameState.some(function (row) {
					return row.some(function (cell) {
						return !cell;
					});
				})) {
					handleDraw();
				} else if (this.isPlayerTurn) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyL2pzL2FwcC5qcyIsImJyb3dzZXIvanMvYm9hcmQuanMiLCJicm93c2VyL2pzL2dhbWUuanMiLCJicm93c2VyL2pzL3NvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLElBQUksU0FBUyxHQUFHLE9BQUgsQ0FBVyx1QkFBWCxDQUFiO0FBQ0EsSUFBSSxPQUFPLElBQVg7O0FBRUEsT0FBTyxFQUFQLENBQVUsV0FBVixFQUF1QixZQUFNO0FBQzVCLEtBQUksSUFBSixFQUFVO0FBQ1QsT0FBSyxJQUFMO0FBQ0E7O0FBRUQsUUFBTyxtQkFBUyxNQUFULENBQVA7QUFDQSxDQU5EOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLFVBQVosRUFBd0I7QUFBQTs7QUFBQTs7QUFDdkI7QUFDQSxNQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQTtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLEdBQUwsR0FBVyxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWDs7QUFFQTtBQUNBLE1BQUksYUFBYSxHQUFqQjtBQUNBLFNBQU8sS0FBUCxHQUFlLFVBQWY7QUFDQSxTQUFPLE1BQVAsR0FBZ0IsVUFBaEI7O0FBRUE7QUFDQSxPQUFLLFVBQUwsR0FBa0IsVUFBbEI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsYUFBVyxDQUE1Qjs7QUFFQTtBQUNBLFNBQU8sZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsYUFBSztBQUN6QyxPQUFJLFFBQVEsTUFBSyxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0EsR0FGRDs7QUFJQSxNQUFJLFlBQVksU0FBUyxjQUFULENBQXdCLFdBQXhCLENBQWhCO0FBQ0EsWUFBVSxXQUFWLENBQXNCLE1BQXRCO0FBQ0E7Ozs7MkJBRVEsSyxFQUFPO0FBQUEsT0FDVCxT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QWtCLENBQWxCO0FBQ0EsR0FKRDtBQUtBOzs7O2dDQUVhLFMsRUFBVztBQUN4QixRQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLGlCQUFqQixFQUFvQyxTQUFwQztBQUNBOzs7Ozs7a0JBZG1CLE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcblxubGV0IHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6NDA0MCcpXG5sZXQgZ2FtZSA9IG51bGw7XG5cbnNvY2tldC5vbignZ2FtZVN0YXJ0JywgKCkgPT4ge1xuXHRpZiAoZ2FtZSkge1xuXHRcdGdhbWUud2lwZSgpXG5cdH1cblxuXHRnYW1lID0gbmV3IEdhbWUoc29ja2V0KVxufSlcbiIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkIHtcblx0Y29uc3RydWN0b3IocHJvcGVydGllcykge1xuXHRcdC8vIGNyZWF0ZSBjYW52YXNcblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG5cdFx0Ly8gbWFpbnRhaW5pbmcgcmVmZXJlbmNlIHRvIEhUTUw1IGNhbnZhcyBmb3IgcmVuZGVyaW5nXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdFx0dGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0Ly8gc2V0dGluZyBkaW1lbnNpb25zXG5cdFx0bGV0IGJvYXJkV2lkdGggPSA0NTBcblx0XHRjYW52YXMud2lkdGggPSBib2FyZFdpZHRoXG5cdFx0Y2FudmFzLmhlaWdodCA9IGJvYXJkV2lkdGhcblxuXHRcdC8vIHNpemluZ1xuXHRcdHRoaXMuYm9hcmRXaWR0aCA9IGJvYXJkV2lkdGg7XG5cdFx0dGhpcy5jZWxsV2lkdGggPSBib2FyZFdpZHRoLzM7XG5cblx0XHQvL2V2ZW50IGxpc3RlbmVyIGZvciBjbGlja3MgdG8gYWxsb3cgcGllY2UgbW92ZW1lbnRcblx0XHRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG5cdFx0XHRsZXQgbW91c2UgPSB0aGlzLmdldE1vdXNlKGUpXG5cdFx0fSlcblxuXHRcdGxldCBzdHJldGNoZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0cmV0Y2hlclwiKVxuXHRcdHN0cmV0Y2hlci5hcHBlbmRDaGlsZChjYW52YXMpO1xuXHR9XG5cblx0Z2V0TW91c2UoZXZlbnQpIHtcblx0XHRsZXQgeyBjZWxsV2lkdGggfSA9IHRoaXM7XG5cblx0XHQvLyBjbGljayBjb29yZGluYXRlXG5cdFx0bGV0IHggPSBNYXRoLmZsb29yKCBldmVudC5vZmZzZXRYIC8gY2VsbFdpZHRoIClcblx0XHRsZXQgeSA9IE1hdGguZmxvb3IoIGV2ZW50Lm9mZnNldFkgLyBjZWxsV2lkdGggKVxuXG5cdFx0Ly8gcGFzcyBjb29yZGluYXRlcyB0byBHYW1lIG1ldGhvZFxuXHRcdHRoaXMuZ2FtZS5ldmFsdWF0ZUNsaWNrKHgsIHkpXG5cdH1cblxuXHRkcmF3UGllY2UodHlwZSwgeCwgeSkge1xuXHRcdGxldCB7IGNlbGxXaWR0aCwgY3R4IH0gPSB0aGlzXG5cdFx0aWYgKHR5cGUgPT09IFwiT1wiKSB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0XHRjdHguYXJjKHggKyBjZWxsV2lkdGgvMiwgeSArIGNlbGxXaWR0aC8yLCBjZWxsV2lkdGgvMiAtIDMsMCxNYXRoLlBJKjIsdHJ1ZSk7XG5cdFx0XHRjdHgubGluZVdpZHRoID0gMlxuXHRcdFx0Y3R4LnN0cm9rZSgpO1xuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gXCJYXCIpIHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKVxuXHRcdFx0Y3R4Lm1vdmVUbyh4ICsgMTAsIHkgKyAxMClcblx0XHRcdGN0eC5saW5lVG8oeCArIGNlbGxXaWR0aCAtIDEwLCB5ICsgY2VsbFdpZHRoIC0gMTApXG5cdFx0XHRjdHgubW92ZVRvKHggKyBjZWxsV2lkdGggLSAxMCwgeSArIDEwKVxuXHRcdFx0Y3R4LmxpbmVUbyh4ICsgMTAsIHkgKyBjZWxsV2lkdGggLSAxMClcblx0XHRcdGN0eC5saW5lV2lkdGggPSAyXG5cdFx0XHRjdHguc3Ryb2tlKClcblx0XHR9XG5cdH1cblxuXHRkcmF3UGllY2VzKGdhbWVTdGF0ZSkge1xuXHRcdGxldCB7IGNlbGxXaWR0aCwgY3R4IH0gPSB0aGlzXG5cblx0XHRnYW1lU3RhdGUuZm9yRWFjaCgoIHJvdywgeSApID0+IHtcblx0XHRcdHJvdy5mb3JFYWNoKCggc3F1YXJlLCB4ICkgPT4ge1xuXHRcdFx0XHRpZiAoc3F1YXJlKSB7XG5cdFx0XHRcdFx0dGhpcy5kcmF3UGllY2Uoc3F1YXJlLCB4ICogY2VsbFdpZHRoLCB5ICogY2VsbFdpZHRoKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0pXG5cdH1cblxuXHRwYXNzR2FtZShnYW1lKSB7XG5cdFx0dGhpcy5nYW1lID0gZ2FtZVxuXHR9XG5cblx0ZHJhd0JvYXJkKCkge1xuXHRcdGxldCB7IGdhbWUgfSA9IHRoaXNcblxuXHRcdHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmJvYXJkV2lkdGgsIHRoaXMuYm9hcmRXaWR0aClcblx0XHRsZXQgZ2FtZVN0YXRlID0gZ2FtZS5nZXRTdGF0ZSgpXG5cblx0XHR0aGlzLnJlbmRlcigpXG5cdFx0dGhpcy5kcmF3UGllY2VzKGdhbWVTdGF0ZSlcblx0fVxuXG5cdHdyaXRlVGV4dCh0ZXh0KSB7XG5cdFx0bGV0IHsgY3R4LCBib2FyZFdpZHRoIH0gPSB0aGlzXG5cdFx0bGV0IGRpbSA9IGJvYXJkV2lkdGgvMlxuXHRcdGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xuXHRcdGN0eC5mb250ID0gJzcycHggSGVsdmV0aWNhJ1xuXHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJ1xuXHRcdGN0eC5maWxsVGV4dCh0ZXh0LCBkaW0sIGRpbSlcblx0XHRjdHguc3Ryb2tlVGV4dCh0ZXh0LCBkaW0sIGRpbSlcblx0XHRjdHguZmlsbCgpXG5cdFx0Y3R4LnN0cm9rZSgpXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHsgY3R4LCBib2FyZFdpZHRoLCBjZWxsV2lkdGggfSA9IHRoaXNcblxuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcblx0XHRmb3IgKGxldCBpID0gY2VsbFdpZHRoOyBpIDwgYm9hcmRXaWR0aDsgaSArPSBjZWxsV2lkdGgpXHQge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpXG5cdFx0XHRjdHgubW92ZVRvKGksIDApXG5cdFx0XHRjdHgubGluZVRvKGksIGJvYXJkV2lkdGgpXG5cdFx0XHRjdHgubW92ZVRvKDAsIGkpXG5cdFx0XHRjdHgubGluZVRvKGJvYXJkV2lkdGgsIGkpXG5cdFx0XHRjdHgubGluZVdpZHRoID0gMlxuXHRcdFx0Y3R4LnN0cm9rZSgpXG5cdFx0fVxuXHR9XG5cblx0ZGVsZXRlQm9hcmQoKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcylcblx0fVxufVxuIiwiaW1wb3J0IEJvYXJkIGZyb20gJy4vYm9hcmQnO1xuaW1wb3J0IFNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuXHRjb25zdHJ1Y3Rvcihzb2NrZXRJbnN0YW5jZSkge1xuXHRcdC8vIGVtcHR5IGJvYXJkXG5cdFx0dGhpcy5nYW1lU3RhdGUgPSBbXG5cdFx0XHRbIG51bGwsIG51bGwsIG51bGwgXSxcblx0XHRcdFsgbnVsbCwgbnVsbCwgbnVsbCBdLFxuXHRcdFx0WyBudWxsLCBudWxsLCBudWxsIF1cblx0XHRdXG5cblx0XHR0aGlzLnNvY2tldCA9IG5ldyBTb2NrZXQoc29ja2V0SW5zdGFuY2UsIHRoaXMpO1xuXG5cdFx0bGV0IGJvYXJkID0gbmV3IEJvYXJkKClcblx0XHRib2FyZC5wYXNzR2FtZSh0aGlzKVxuXHRcdGJvYXJkLmRyYXdCb2FyZCgpXG5cblx0XHR0aGlzLnBsYXllclBpZWNlID0gXCJYXCJcblx0XHR0aGlzLmNvbXB1dGVyUGllY2UgPSB0aGlzLnBsYXllclBpZWNlID09PSBcIlhcIiA/IFwiT1wiIDogXCJYXCJcblx0XHR0aGlzLmlzUGxheWVyVHVybiA9IHRydWVcblx0XHR0aGlzLmJvYXJkID0gYm9hcmRcblx0XHR0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG5cblx0XHR0aGlzLmhhbmRsZVdpbiA9IHRoaXMuaGFuZGxlV2luLmJpbmQodGhpcylcblx0XHR0aGlzLmhhbmRsZURyYXcgPSB0aGlzLmhhbmRsZURyYXcuYmluZCh0aGlzKVxuXHR9XG5cblx0Z2V0U3RhdGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2FtZVN0YXRlXG5cdH1cblxuXHRldmFsdWF0ZUNsaWNrKHgsIHkpIHtcblx0XHRsZXQgeyBpc1BsYXllclR1cm4sIHBsYXllclBpZWNlLCBib2FyZCwgZ2FtZU92ZXIgfSA9IHRoaXM7XG5cdFx0Ly8gY2hlY2sgaWYgbGVnYWwgbW92ZVxuXHRcdGlmICghdGhpcy5nYW1lU3RhdGVbeV1beF0gJiYgaXNQbGF5ZXJUdXJuICYmICFnYW1lT3Zlcikge1xuXHRcdFx0dGhpcy5tb3ZlKHgsIHksIHBsYXllclBpZWNlKVxuXHRcdH0gXG5cdH1cblxuXHQvLyBkZWZhdWx0IHBhcmFtZXRlciBmb3IgcGllY2UgdG8gbWFrZSBwYXNzaW5nIG1vdmVzIGJhY2sgZnJvbSBzZXJ2ZXIgZWFzaWVyXG5cdG1vdmUoeCwgeSwgcGllY2UgPSB0aGlzLmNvbXB1dGVyUGllY2UpIHtcblx0XHRsZXQgeyBib2FyZCwgc29ja2V0LCBoYW5kbGVXaW4sIGhhbmRsZURyYXcsIGdhbWVTdGF0ZSB9ID0gdGhpcywgYm9hcmRXaWR0aCA9IGdhbWVTdGF0ZS5sZW5ndGg7XG5cdFx0dGhpcy5nYW1lU3RhdGVbeV1beF0gPSBwaWVjZVxuXHRcdGJvYXJkLmRyYXdCb2FyZCgpXG5cblx0XHQvLyBjaGVjayBmb3Igd2luIGFmdGVyIG1vdmUgbWFkZVxuXHRcdC8vIHJvd3Ncblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGdhbWVTdGF0ZVt5XVtpXSAhPSBwaWVjZSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmIChpID09PSBib2FyZFdpZHRoLTEpIHtcblx0XHRcdCBcdGhhbmRsZVdpbihwaWVjZSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBjb2x1bW5zXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChnYW1lU3RhdGVbaV1beF0gIT0gcGllY2UpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHRcdGhhbmRsZVdpbihwaWVjZSlcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB1cHBlci1sZWZ0IHRvIGJvdHRvbS1yaWdodCBkaWFnb25hbFxuXHRcdGlmICh4ID09PSB5KSB7IFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdFx0aWYgKGdhbWVTdGF0ZVtpXVtpXSAhPSBwaWVjZSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGkgPT09IGJvYXJkV2lkdGgtMSkge1xuXHRcdFx0XHRcdGhhbmRsZVdpbihwaWVjZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHVwcGVyLXJpZ2h0IHRvIGJvdHRvbS1sZWZ0IGRpYWdvbmFsXG5cdFx0aWYgKHggKyB5ID09PSBib2FyZFdpZHRoLTEpIHsgXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkV2lkdGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZ2FtZVN0YXRlW2ldWyhib2FyZFdpZHRoLTEpIC0gaV0gIT0gcGllY2UpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpID09PSBib2FyZFdpZHRoLTEpIHtcblx0XHRcdFx0XHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIXRoaXMuZ2FtZU92ZXIpIHtcblx0XHRcdGlmICghZ2FtZVN0YXRlLnNvbWUocm93ID0+IHJvdy5zb21lKGNlbGwgPT4gIWNlbGwpKSkge1xuXHRcdFx0XHRoYW5kbGVEcmF3KClcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5pc1BsYXllclR1cm4pIHtcblx0XHRcdFx0c29ja2V0LnNlbmRHYW1lU3RhdGUoZ2FtZVN0YXRlKVx0XHRcblx0XHRcdFx0dGhpcy5pc1BsYXllclR1cm4gPSBmYWxzZVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5pc1BsYXllclR1cm4gPSB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlV2luKHBpZWNlKSB7XG5cdFx0bGV0IHsgcGxheWVyUGllY2UsIGJvYXJkIH0gPSB0aGlzO1xuXHRcdHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG5cdFx0aWYgKHBpZWNlID09PSBwbGF5ZXJQaWVjZSkge1xuXHRcdFx0Ym9hcmQud3JpdGVUZXh0KFwiWW91IHdpbiFcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJvYXJkLndyaXRlVGV4dChcIllvdSBsb3NlIVwiKTtcblx0XHR9XG5cdH1cblxuXHRoYW5kbGVEcmF3KCkge1xuXHRcdHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuXG5cdFx0dGhpcy5ib2FyZC53cml0ZVRleHQoXCJJdCdzIGEgZHJhdyFcIik7XG5cdH1cblxuXHQvLyB1c2VkIGluIGNhc2Ugb2YgcmVkdW5kYW50IGdhbWUgc3RhcnRpbmcgZnJvbSBzZXJ2ZXJcblx0Ly8gd2hpY2ggY2F1c2VzIHVuZGVzaXJhYmxlIGJvYXJkIGR1cGxpY2F0ZXNcblx0d2lwZSgpIHtcblx0XHR0aGlzLmJvYXJkLmRlbGV0ZUJvYXJkKClcblx0fVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0IHtcblx0Y29uc3RydWN0b3Ioc29ja2V0LCBnYW1lKSB7XG5cdFx0dGhpcy5zb2NrZXQgPSBzb2NrZXRcblx0XHR0aGlzLmdhbWUgPSBnYW1lO1xuXG5cdFx0c29ja2V0Lm9uKCdzZXJ2ZXJQYXNzTW92ZScsIG1vdmUgPT4ge1xuXHRcdFx0bGV0IHsgeCwgeSB9ID0gbW92ZVxuXHRcdFx0Ly8gc2V0VGltZW91dCgoKSA9PiB0aGlzLmdhbWUubW92ZSh4LCB5KSwgMTAwMClcblx0XHRcdHRoaXMuZ2FtZS5tb3ZlKHgsIHkpXG5cdFx0fSlcblx0fVxuXG5cdHNlbmRHYW1lU3RhdGUoZ2FtZVN0YXRlKSB7XG5cdFx0dGhpcy5zb2NrZXQuZW1pdCgnY2xpZW50UGFzc1N0YXRlJywgZ2FtZVN0YXRlKVxuXHR9XG59XG5cbiJdfQ==
