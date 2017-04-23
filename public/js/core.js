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
		this.gameState = [[null, null, null], [null, null, null], [null, 'X', null]];

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
				}
				this.isPlayerTurn = !this.isPlayerTurn;
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

			setTimeout(function () {
				return _this.game.move(x, y);
			}, 1000);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyL2pzL2FwcC5qcyIsImJyb3dzZXIvanMvYm9hcmQuanMiLCJicm93c2VyL2pzL2dhbWUuanMiLCJicm93c2VyL2pzL3NvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBLElBQUksU0FBUyxHQUFHLE9BQUgsQ0FBVyx1QkFBWCxDQUFiO0FBQ0EsSUFBSSxPQUFPLElBQVg7O0FBRUEsT0FBTyxFQUFQLENBQVUsV0FBVixFQUF1QixZQUFNO0FBQzVCLEtBQUksSUFBSixFQUFVO0FBQ1QsT0FBSyxJQUFMO0FBQ0E7O0FBRUQsUUFBTyxtQkFBUyxNQUFULENBQVA7QUFDQSxDQU5EOzs7Ozs7Ozs7OztBQ0xBOzs7Ozs7OztJQUVxQixLO0FBQ3BCLGdCQUFZLFVBQVosRUFBd0I7QUFBQTs7QUFBQTs7QUFDdkI7QUFDQSxNQUFNLFNBQVMsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7QUFDQTtBQUNBLE9BQUssTUFBTCxHQUFjLE1BQWQ7QUFDQSxPQUFLLEdBQUwsR0FBVyxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBWDs7QUFFQTtBQUNBLE1BQUksYUFBYSxHQUFqQjtBQUNBLFNBQU8sS0FBUCxHQUFlLFVBQWY7QUFDQSxTQUFPLE1BQVAsR0FBZ0IsVUFBaEI7O0FBRUE7QUFDQSxPQUFLLFVBQUwsR0FBa0IsVUFBbEI7QUFDQSxPQUFLLFNBQUwsR0FBaUIsYUFBVyxDQUE1Qjs7QUFFQTtBQUNBLFNBQU8sZ0JBQVAsQ0FBd0IsV0FBeEIsRUFBcUMsYUFBSztBQUN6QyxPQUFJLFFBQVEsTUFBSyxRQUFMLENBQWMsQ0FBZCxDQUFaO0FBQ0EsR0FGRDs7QUFJQSxXQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0E7Ozs7MkJBRVEsSyxFQUFPO0FBQUEsT0FDVCxTQURTLEdBQ0ssSUFETCxDQUNULFNBRFM7O0FBR2Y7O0FB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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEdhbWUgZnJvbSAnLi9nYW1lJztcblxubGV0IHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6NDA0MCcpXG5sZXQgZ2FtZSA9IG51bGw7XG5cbnNvY2tldC5vbignZ2FtZVN0YXJ0JywgKCkgPT4ge1xuXHRpZiAoZ2FtZSkge1xuXHRcdGdhbWUud2lwZSgpXG5cdH1cblxuXHRnYW1lID0gbmV3IEdhbWUoc29ja2V0KVxufSlcbiIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkIHtcblx0Y29uc3RydWN0b3IocHJvcGVydGllcykge1xuXHRcdC8vIGNyZWF0ZSBjYW52YXNcblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG5cdFx0Ly8gbWFpbnRhaW5pbmcgcmVmZXJlbmNlIHRvIEhUTUw1IGNhbnZhcyBmb3IgcmVuZGVyaW5nXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdFx0dGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0Ly8gc2V0dGluZyBkaW1lbnNpb25zXG5cdFx0bGV0IGJvYXJkV2lkdGggPSA0NTBcblx0XHRjYW52YXMud2lkdGggPSBib2FyZFdpZHRoXG5cdFx0Y2FudmFzLmhlaWdodCA9IGJvYXJkV2lkdGhcblxuXHRcdC8vIHNpemluZ1xuXHRcdHRoaXMuYm9hcmRXaWR0aCA9IGJvYXJkV2lkdGg7XG5cdFx0dGhpcy5jZWxsV2lkdGggPSBib2FyZFdpZHRoLzM7XG5cblx0XHQvL2V2ZW50IGxpc3RlbmVyIGZvciBjbGlja3MgdG8gYWxsb3cgcGllY2UgbW92ZW1lbnRcblx0XHRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG5cdFx0XHRsZXQgbW91c2UgPSB0aGlzLmdldE1vdXNlKGUpXG5cdFx0fSlcblxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcblx0fVxuXG5cdGdldE1vdXNlKGV2ZW50KSB7XG5cdFx0bGV0IHsgY2VsbFdpZHRoIH0gPSB0aGlzO1xuXG5cdFx0Ly8gY2xpY2sgY29vcmRpbmF0ZVxuXHRcdGxldCB4ID0gTWF0aC5mbG9vciggZXZlbnQub2Zmc2V0WCAvIGNlbGxXaWR0aCApXG5cdFx0bGV0IHkgPSBNYXRoLmZsb29yKCBldmVudC5vZmZzZXRZIC8gY2VsbFdpZHRoIClcblxuXHRcdC8vIHBhc3MgY29vcmRpbmF0ZXMgdG8gR2FtZSBtZXRob2Rcblx0XHR0aGlzLmdhbWUuZXZhbHVhdGVDbGljayh4LCB5KVxuXHR9XG5cblx0ZHJhd1BpZWNlKHR5cGUsIHgsIHkpIHtcblx0XHRsZXQgeyBjZWxsV2lkdGgsIGN0eCB9ID0gdGhpc1xuXHRcdGlmICh0eXBlID09PSBcIk9cIikge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4LmFyYyh4ICsgY2VsbFdpZHRoLzIsIHkgKyBjZWxsV2lkdGgvMiwgY2VsbFdpZHRoLzIgLSAzLDAsTWF0aC5QSSoyLHRydWUpO1xuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDJcblx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFwiWFwiKSB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKClcblx0XHRcdGN0eC5tb3ZlVG8oeCArIDEwLCB5ICsgMTApXG5cdFx0XHRjdHgubGluZVRvKHggKyBjZWxsV2lkdGggLSAxMCwgeSArIGNlbGxXaWR0aCAtIDEwKVxuXHRcdFx0Y3R4Lm1vdmVUbyh4ICsgY2VsbFdpZHRoIC0gMTAsIHkgKyAxMClcblx0XHRcdGN0eC5saW5lVG8oeCArIDEwLCB5ICsgY2VsbFdpZHRoIC0gMTApXG5cdFx0XHRjdHgubGluZVdpZHRoID0gMlxuXHRcdFx0Y3R4LnN0cm9rZSgpXG5cdFx0fVxuXHR9XG5cblx0ZHJhd1BpZWNlcyhnYW1lU3RhdGUpIHtcblx0XHRsZXQgeyBjZWxsV2lkdGgsIGN0eCB9ID0gdGhpc1xuXG5cdFx0Z2FtZVN0YXRlLmZvckVhY2goKCByb3csIHkgKSA9PiB7XG5cdFx0XHRyb3cuZm9yRWFjaCgoIHNxdWFyZSwgeCApID0+IHtcblx0XHRcdFx0aWYgKHNxdWFyZSkge1xuXHRcdFx0XHRcdHRoaXMuZHJhd1BpZWNlKHNxdWFyZSwgeCAqIGNlbGxXaWR0aCwgeSAqIGNlbGxXaWR0aClcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG5cblx0cGFzc0dhbWUoZ2FtZSkge1xuXHRcdHRoaXMuZ2FtZSA9IGdhbWVcblx0fVxuXG5cdGRyYXdCb2FyZCgpIHtcblx0XHRsZXQgeyBnYW1lIH0gPSB0aGlzXG5cblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5ib2FyZFdpZHRoLCB0aGlzLmJvYXJkV2lkdGgpXG5cdFx0bGV0IGdhbWVTdGF0ZSA9IGdhbWUuZ2V0U3RhdGUoKVxuXG5cdFx0dGhpcy5yZW5kZXIoKVxuXHRcdHRoaXMuZHJhd1BpZWNlcyhnYW1lU3RhdGUpXG5cdH1cblxuXHR3cml0ZVRleHQodGV4dCkge1xuXHRcdGxldCB7IGN0eCB9ID0gdGhpc1xuXHRcdGN0eC5mb250ID0gJzcycHggSGVsdmV0aWNhJ1xuXHRcdGN0eC5maWxsU3R5bGUgPSAnd2hpdGUnXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJ1xuXHRcdGN0eC5maWxsVGV4dCh0ZXh0LCAxMDAsIDI0MClcblx0XHRjdHguc3Ryb2tlVGV4dCh0ZXh0LCAxMDAsIDI0MClcblx0XHRjdHguZmlsbCgpXG5cdFx0Y3R4LnN0cm9rZSgpXG5cdFx0dmFyIHRleHQgPSBjdHgubWVhc3VyZVRleHQodGV4dClcblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRsZXQgeyBjdHgsIGJvYXJkV2lkdGgsIGNlbGxXaWR0aCB9ID0gdGhpc1xuXG5cdFx0Y3R4LnN0cm9rZVN0eWxlID0gJ2JsYWNrJ1xuXHRcdGZvciAobGV0IGkgPSBjZWxsV2lkdGg7IGkgPCBib2FyZFdpZHRoOyBpICs9IGNlbGxXaWR0aClcdCB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKClcblx0XHRcdGN0eC5tb3ZlVG8oaSwgMClcblx0XHRcdGN0eC5saW5lVG8oaSwgYm9hcmRXaWR0aClcblx0XHRcdGN0eC5tb3ZlVG8oMCwgaSlcblx0XHRcdGN0eC5saW5lVG8oYm9hcmRXaWR0aCwgaSlcblx0XHRcdGN0eC5saW5lV2lkdGggPSAyXG5cdFx0XHRjdHguc3Ryb2tlKClcblx0XHR9XG5cdH1cblxuXHRkZWxldGVCb2FyZCgpIHtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuY2FudmFzKVxuXHR9XG59XG4iLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9ib2FyZCc7XG5pbXBvcnQgU29ja2V0IGZyb20gJy4vc29ja2V0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZSB7XG5cdGNvbnN0cnVjdG9yKHNvY2tldEluc3RhbmNlKSB7XG5cdFx0Ly8gZW1wdHkgYm9hcmRcblx0XHR0aGlzLmdhbWVTdGF0ZSA9IFtcblx0XHRcdFsgbnVsbCwgbnVsbCwgbnVsbCBdLFxuXHRcdFx0WyBudWxsLCBudWxsLCBudWxsIF0sXG5cdFx0XHRbIG51bGwsICdYJywgbnVsbCBdXG5cdFx0XVxuXG5cdFx0dGhpcy5zb2NrZXQgPSBuZXcgU29ja2V0KHNvY2tldEluc3RhbmNlLCB0aGlzKTtcblxuXHRcdGxldCBib2FyZCA9IG5ldyBCb2FyZCgpXG5cdFx0Ym9hcmQucGFzc0dhbWUodGhpcylcblx0XHRib2FyZC5kcmF3Qm9hcmQoKVxuXG5cdFx0dGhpcy5wbGF5ZXJQaWVjZSA9IFwiWFwiXG5cdFx0dGhpcy5jb21wdXRlclBpZWNlID0gdGhpcy5wbGF5ZXJQaWVjZSA9PT0gXCJYXCIgPyBcIk9cIiA6IFwiWFwiXG5cdFx0dGhpcy5pc1BsYXllclR1cm4gPSB0cnVlXG5cdFx0dGhpcy5ib2FyZCA9IGJvYXJkXG5cdFx0dGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXG5cdFx0dGhpcy5oYW5kbGVXaW4gPSB0aGlzLmhhbmRsZVdpbi5iaW5kKHRoaXMpXG5cdH1cblxuXHRnZXRTdGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5nYW1lU3RhdGVcblx0fVxuXG5cdGV2YWx1YXRlQ2xpY2soeCwgeSkge1xuXHRcdGxldCB7IGlzUGxheWVyVHVybiwgcGxheWVyUGllY2UsIGJvYXJkLCBnYW1lT3ZlciB9ID0gdGhpcztcblx0XHQvLyBjaGVjayBpZiBsZWdhbCBtb3ZlXG5cdFx0aWYgKCF0aGlzLmdhbWVTdGF0ZVt5XVt4XSAmJiBpc1BsYXllclR1cm4gJiYgIWdhbWVPdmVyKSB7XG5cdFx0XHR0aGlzLm1vdmUoeCwgeSwgcGxheWVyUGllY2UpXG5cdFx0fSBcblx0fVxuXG5cdC8vIGRlZmF1bHQgcGFyYW1ldGVyIGZvciBwaWVjZSB0byBtYWtlIHBhc3NpbmcgbW92ZXMgYmFjayBmcm9tIHNlcnZlciBlYXNpZXJcblx0bW92ZSh4LCB5LCBwaWVjZSA9IHRoaXMuY29tcHV0ZXJQaWVjZSkge1xuXHRcdGxldCB7IGJvYXJkLCBzb2NrZXQsIGhhbmRsZVdpbiwgaGFuZGxlRHJhdywgZ2FtZVN0YXRlIH0gPSB0aGlzLCBib2FyZFdpZHRoID0gZ2FtZVN0YXRlLmxlbmd0aDtcblx0XHR0aGlzLmdhbWVTdGF0ZVt5XVt4XSA9IHBpZWNlXG5cdFx0Ym9hcmQuZHJhd0JvYXJkKClcblxuXHRcdC8vIGNoZWNrIGZvciB3aW4gYWZ0ZXIgbW92ZSBtYWRlXG5cdFx0Ly8gcm93c1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZ2FtZVN0YXRlW3ldW2ldICE9IHBpZWNlKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGkgPT09IGJvYXJkV2lkdGgtMSkge1xuXHRcdFx0IFx0aGFuZGxlV2luKHBpZWNlKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIGNvbHVtbnNcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkV2lkdGg7IGkrKykge1xuXHRcdFx0aWYgKGdhbWVTdGF0ZVtpXVt4XSAhPSBwaWVjZSkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmIChpID09PSBib2FyZFdpZHRoLTEpIHtcblx0XHRcdFx0aGFuZGxlV2luKHBpZWNlKVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHVwcGVyLWxlZnQgdG8gYm90dG9tLXJpZ2h0IGRpYWdvbmFsXG5cdFx0aWYgKHggPT09IHkpIHsgXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkV2lkdGg7IGkrKykge1xuXHRcdFx0XHRpZiAoZ2FtZVN0YXRlW2ldW2ldICE9IHBpZWNlKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHRcdFx0aGFuZGxlV2luKHBpZWNlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdXBwZXItcmlnaHQgdG8gYm90dG9tLWxlZnQgZGlhZ29uYWxcblx0XHRpZiAoeCArIHkgPT09IGJvYXJkV2lkdGgtMSkgeyBcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChnYW1lU3RhdGVbaV1bKGJvYXJkV2lkdGgtMSkgLSBpXSAhPSBwaWVjZSkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGkgPT09IGJvYXJkV2lkdGgtMSkge1xuXHRcdFx0XHRcdGhhbmRsZVdpbihwaWVjZSlcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBhcmVBdmFpbGFibGVNb3ZlcyA9IGdhbWVTdGF0ZS5zb21lKHJvdyA9PiByb3cuc29tZShjZWxsID0+ICFjZWxsKSlcblxuXHRcdGlmICghYXJlQXZhaWxhYmxlTW92ZXMpIHtcblx0XHRcdGhhbmRsZURyYXcoKVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5nYW1lT3Zlcikge1xuXHRcdFx0aWYgKHRoaXMuaXNQbGF5ZXJUdXJuKSB7XG5cdFx0XHRcdHNvY2tldC5zZW5kR2FtZVN0YXRlKGdhbWVTdGF0ZSlcdFx0XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlzUGxheWVyVHVybiA9ICF0aGlzLmlzUGxheWVyVHVyblxuXHRcdH1cblx0fVxuXG5cdGhhbmRsZVdpbihwaWVjZSkge1xuXHRcdGxldCB7IHBsYXllclBpZWNlLCBib2FyZCB9ID0gdGhpcztcblx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblxuXHRcdGlmIChwaWVjZSA9PT0gcGxheWVyUGllY2UpIHtcblx0XHRcdGJvYXJkLndyaXRlVGV4dChcIllvdSB3aW4hXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRib2FyZC53cml0ZVRleHQoXCJZb3UgbG9zZSFcIik7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRHJhdygpIHtcblx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblxuXHRcdHRoaXMuYm9hcmQud3JpdGVUZXh0KFwiSXQncyBhIGRyYXchXCIpO1xuXHR9XG5cblx0Ly8gdXNlZCBpbiBjYXNlIG9mIHJlZHVuZGFudCBnYW1lIHN0YXJ0aW5nIGZyb20gc2VydmVyXG5cdC8vIHdoaWNoIGNhdXNlcyB1bmRlc2lyYWJsZSBib2FyZCBkdXBsaWNhdGVzXG5cdHdpcGUoKSB7XG5cdFx0dGhpcy5ib2FyZC5kZWxldGVCb2FyZCgpXG5cdH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldCB7XG5cdGNvbnN0cnVjdG9yKHNvY2tldCwgZ2FtZSkge1xuXHRcdHRoaXMuc29ja2V0ID0gc29ja2V0XG5cdFx0dGhpcy5nYW1lID0gZ2FtZTtcblxuXHRcdHNvY2tldC5vbignc2VydmVyUGFzc01vdmUnLCBtb3ZlID0+IHtcblx0XHRcdGxldCB7IHgsIHkgfSA9IG1vdmVcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy5nYW1lLm1vdmUoeCwgeSksIDEwMDApXG5cdFx0fSlcblx0fVxuXG5cdHNlbmRHYW1lU3RhdGUoZ2FtZVN0YXRlKSB7XG5cdFx0dGhpcy5zb2NrZXQuZW1pdCgnY2xpZW50UGFzc1N0YXRlJywgZ2FtZVN0YXRlKVxuXHR9XG59XG5cbiJdfQ==
