(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.panelToggle = panelToggle;

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = io.connect('http://localhost:4040');
var resetButton = document.getElementById('reset');
var panel = document.getElementById('feedback');
var game = null;

socket.on('gameStart', function () {
	if (game) {
		game.wipe();
	}

	game = new _game2.default(socket);
	panelToggle();
});

resetButton.onclick = function (e) {
	if (game) {
		game.wipe();
	}
	socket.disconnect();
	socket = io.connect('http://localhost:4040');

	game = new _game2.default(socket);
};

function panelToggle() {
	var currentClass = panel.classList.contains('loading') ? 'loading' : 'ready';
	var nextClass = currentClass === 'loading' ? 'ready' : 'loading';
	var newText = currentClass === 'loading' ? 'It\'s your turn!' : 'It\'s the AI\'s turn.';

	panel.classList.add(nextClass);
	panel.classList.remove(currentClass);
	panel.textContent = newText;
}

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
		this.stretcher = stretcher;
		stretcher.prepend(canvas);
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
			stretcher.removeChild(this.canvas);
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

		this.socket = new _socket2.default(socketInstance, this);
		this.handleWin = this.handleWin.bind(this);
		this.handleDraw = this.handleDraw.bind(this);

		this._init();

		var board = new _board2.default();
		board.passGame(this);
		board.drawBoard();
		this.board = board;
	}

	_createClass(Game, [{
		key: '_init',
		value: function _init() {
			// empty board
			this.gameState = [[null, null, null], [null, null, null], [null, null, null]];

			this.playerPiece = "X";
			this.computerPiece = this.playerPiece === "X" ? "O" : "X";
			this.isPlayerTurn = true;
			this.gameOver = false;
		}
	}, {
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

var _app = require('./app');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

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
			(0, _app.panelToggle)();
		});
	}

	_createClass(Socket, [{
		key: 'sendGameState',
		value: function sendGameState(gameState) {
			this.socket.emit('clientPassState', gameState);
			(0, _app.panelToggle)();
		}
	}]);

	return Socket;
}();

exports.default = Socket;

},{"./app":1}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJicm93c2VyL2pzL2FwcC5qcyIsImJyb3dzZXIvanMvYm9hcmQuanMiLCJicm93c2VyL2pzL2dhbWUuanMiLCJicm93c2VyL2pzL3NvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O1FDMkJnQixXLEdBQUEsVzs7QUEzQmhCOzs7Ozs7QUFFQSxJQUFJLFNBQVMsR0FBRyxPQUFILENBQVcsdUJBQVgsQ0FBYjtBQUNBLElBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBbEI7QUFDQSxJQUFJLFFBQVEsU0FBUyxjQUFULENBQXdCLFVBQXhCLENBQVo7QUFDQSxJQUFJLE9BQU8sSUFBWDs7QUFFQSxPQUFPLEVBQVAsQ0FBVSxXQUFWLEVBQXVCLFlBQU07QUFDNUIsS0FBSSxJQUFKLEVBQVU7QUFDVCxPQUFLLElBQUw7QUFDQTs7QUFFRCxRQUFPLG1CQUFTLE1BQVQsQ0FBUDtBQUNBO0FBQ0EsQ0FQRDs7QUFVQSxZQUFZLE9BQVosR0FBc0IsVUFBUyxDQUFULEVBQVk7QUFDakMsS0FBSSxJQUFKLEVBQVU7QUFDVCxPQUFLLElBQUw7QUFDQTtBQUNELFFBQU8sVUFBUDtBQUNBLFVBQVMsR0FBRyxPQUFILENBQVcsdUJBQVgsQ0FBVDs7QUFFQSxRQUFPLG1CQUFTLE1BQVQsQ0FBUDtBQUNBLENBUkQ7O0FBVU8sU0FBUyxXQUFULEdBQXVCO0FBQzdCLEtBQUksZUFBZSxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsQ0FBeUIsU0FBekIsSUFBc0MsU0FBdEMsR0FBa0QsT0FBckU7QUFDQSxLQUFJLFlBQVksaUJBQWlCLFNBQWpCLEdBQTZCLE9BQTdCLEdBQXVDLFNBQXZEO0FBQ0EsS0FBSSxVQUFVLGlCQUFpQixTQUFqQixHQUE2QixrQkFBN0IsR0FBa0QsdUJBQWhFOztBQUVBLE9BQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixTQUFwQjtBQUNBLE9BQU0sU0FB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RUFBTztBQUFBLE9BQ1YsV0FEVSxHQUNhLElBRGIsQ0FDVixXQURVO0FBQUEsT0FDRyxLQURILEdBQ2EsSUFEYixDQUNHLEtBREg7O0FBRWhCLFFBQUssUUFBTCxHQUFnQixJQUFoQjs7QUFFQSxPQUFJLFVBQVUsV0FBZCxFQUEyQjtBQUMxQixVQUFNLFNBQU4sQ0FBZ0IsVUFBaEI7QUFDQSxJQUZELE1BRU87QUFDTixVQUFNLFNBQU4sQ0FBZ0IsV0FBaEI7QUFDQTtBQUNEOzs7K0JBRVk7QUFDWixRQUFLLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUEsUUFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixjQUFyQjtBQUNBOztBQUVEO0FBQ0E7Ozs7eUJBQ087QUFDTixRQUFLLEtBQUwsQ0FBVyxXQUFYO0FBQ0E7Ozs7OztrQkE5SG1CLEk7Ozs7Ozs7Ozs7O0FDRHJCOzs7O0FBRkE7O0lBSXFCLE07QUFDcEIsaUJBQVksTUFBWixFQUFvQixJQUFwQixFQUEwQjtBQUFBOztBQUFBOztBQUN6QixPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsT0FBSyxJQUFMLEdBQVksSUFBWjs7QUFFQSxTQUFPLEVBQVAsQ0FBVSxnQkFBVixFQUE0QixnQkFBUTtBQUFBLE9BQzdCLENBRDZCLEdBQ3BCLElBRG9CLENBQzdCLENBRDZCO0FBQUEsT0FDMUIsQ0FEMEIsR0FDcEIsSUFEb0IsQ0FDMUIsQ0FEMEI7QUFFbkM7O0FBQ0EsU0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLENBQWYsRUFBa0IsQ0FBbEI7QUFDQTtBQUNBLEdBTEQ7QUFNQTs7OztnQ0FFYSxTLEVBQVc7QUFDeEIsUUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixpQkFBakIsRUFBb0MsU0FBcEM7QUFDQTtBQUNBOzs7Ozs7a0JBaEJtQixNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmxldCBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjQwNDAnKVxubGV0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc2V0JylcbmxldCBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmZWVkYmFjaycpXG52YXIgZ2FtZSA9IG51bGw7XG5cbnNvY2tldC5vbignZ2FtZVN0YXJ0JywgKCkgPT4ge1xuXHRpZiAoZ2FtZSkge1xuXHRcdGdhbWUud2lwZSgpXG5cdH1cblxuXHRnYW1lID0gbmV3IEdhbWUoc29ja2V0KVxuXHRwYW5lbFRvZ2dsZSgpXG59KVxuXG5cbnJlc2V0QnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbihlKSB7XG5cdGlmIChnYW1lKSB7XG5cdFx0Z2FtZS53aXBlKClcblx0fVxuXHRzb2NrZXQuZGlzY29ubmVjdCgpXG5cdHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6NDA0MCcpXG5cblx0Z2FtZSA9IG5ldyBHYW1lKHNvY2tldClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhbmVsVG9nZ2xlKCkge1xuXHRsZXQgY3VycmVudENsYXNzID0gcGFuZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb2FkaW5nJykgPyAnbG9hZGluZycgOiAncmVhZHknXG5cdGxldCBuZXh0Q2xhc3MgPSBjdXJyZW50Q2xhc3MgPT09ICdsb2FkaW5nJyA/ICdyZWFkeScgOiAnbG9hZGluZydcblx0bGV0IG5ld1RleHQgPSBjdXJyZW50Q2xhc3MgPT09ICdsb2FkaW5nJyA/ICdJdFxcJ3MgeW91ciB0dXJuIScgOiAnSXRcXCdzIHRoZSBBSVxcJ3MgdHVybi4nXG5cblx0cGFuZWwuY2xhc3NMaXN0LmFkZChuZXh0Q2xhc3MpXG5cdHBhbmVsLmNsYXNzTGlzdC5yZW1vdmUoY3VycmVudENsYXNzKVxuXHRwYW5lbC50ZXh0Q29udGVudCA9IG5ld1RleHRcbn1cbiIsImltcG9ydCBHYW1lIGZyb20gJy4vZ2FtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvYXJkIHtcblx0Y29uc3RydWN0b3IocHJvcGVydGllcykge1xuXHRcdC8vIGNyZWF0ZSBjYW52YXNcblx0XHRjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG5cdFx0Ly8gbWFpbnRhaW5pbmcgcmVmZXJlbmNlIHRvIEhUTUw1IGNhbnZhcyBmb3IgcmVuZGVyaW5nXG5cdFx0dGhpcy5jYW52YXMgPSBjYW52YXM7XG5cdFx0dGhpcy5jdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG5cdFx0Ly8gc2V0dGluZyBkaW1lbnNpb25zXG5cdFx0bGV0IGJvYXJkV2lkdGggPSA0NTBcblx0XHRjYW52YXMud2lkdGggPSBib2FyZFdpZHRoXG5cdFx0Y2FudmFzLmhlaWdodCA9IGJvYXJkV2lkdGhcblxuXHRcdC8vIHNpemluZ1xuXHRcdHRoaXMuYm9hcmRXaWR0aCA9IGJvYXJkV2lkdGg7XG5cdFx0dGhpcy5jZWxsV2lkdGggPSBib2FyZFdpZHRoLzM7XG5cblx0XHQvL2V2ZW50IGxpc3RlbmVyIGZvciBjbGlja3MgdG8gYWxsb3cgcGllY2UgbW92ZW1lbnRcblx0XHRjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG5cdFx0XHRsZXQgbW91c2UgPSB0aGlzLmdldE1vdXNlKGUpXG5cdFx0fSlcblxuXHRcdGxldCBzdHJldGNoZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0cmV0Y2hlclwiKVxuXHRcdHRoaXMuc3RyZXRjaGVyID0gc3RyZXRjaGVyXG5cdFx0c3RyZXRjaGVyLnByZXBlbmQoY2FudmFzKTtcblx0fVxuXG5cdGdldE1vdXNlKGV2ZW50KSB7XG5cdFx0bGV0IHsgY2VsbFdpZHRoIH0gPSB0aGlzO1xuXG5cdFx0Ly8gY2xpY2sgY29vcmRpbmF0ZVxuXHRcdGxldCB4ID0gTWF0aC5mbG9vciggZXZlbnQub2Zmc2V0WCAvIGNlbGxXaWR0aCApXG5cdFx0bGV0IHkgPSBNYXRoLmZsb29yKCBldmVudC5vZmZzZXRZIC8gY2VsbFdpZHRoIClcblxuXHRcdC8vIHBhc3MgY29vcmRpbmF0ZXMgdG8gR2FtZSBtZXRob2Rcblx0XHR0aGlzLmdhbWUuZXZhbHVhdGVDbGljayh4LCB5KVxuXHR9XG5cblx0ZHJhd1BpZWNlKHR5cGUsIHgsIHkpIHtcblx0XHRsZXQgeyBjZWxsV2lkdGgsIGN0eCB9ID0gdGhpc1xuXHRcdGlmICh0eXBlID09PSBcIk9cIikge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4LmFyYyh4ICsgY2VsbFdpZHRoLzIsIHkgKyBjZWxsV2lkdGgvMiwgY2VsbFdpZHRoLzIgLSAzLDAsTWF0aC5QSSoyLHRydWUpO1xuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDJcblx0XHRcdGN0eC5zdHJva2UoKTtcblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IFwiWFwiKSB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKClcblx0XHRcdGN0eC5tb3ZlVG8oeCArIDEwLCB5ICsgMTApXG5cdFx0XHRjdHgubGluZVRvKHggKyBjZWxsV2lkdGggLSAxMCwgeSArIGNlbGxXaWR0aCAtIDEwKVxuXHRcdFx0Y3R4Lm1vdmVUbyh4ICsgY2VsbFdpZHRoIC0gMTAsIHkgKyAxMClcblx0XHRcdGN0eC5saW5lVG8oeCArIDEwLCB5ICsgY2VsbFdpZHRoIC0gMTApXG5cdFx0XHRjdHgubGluZVdpZHRoID0gMlxuXHRcdFx0Y3R4LnN0cm9rZSgpXG5cdFx0fVxuXHR9XG5cblx0ZHJhd1BpZWNlcyhnYW1lU3RhdGUpIHtcblx0XHRsZXQgeyBjZWxsV2lkdGgsIGN0eCB9ID0gdGhpc1xuXG5cdFx0Z2FtZVN0YXRlLmZvckVhY2goKCByb3csIHkgKSA9PiB7XG5cdFx0XHRyb3cuZm9yRWFjaCgoIHNxdWFyZSwgeCApID0+IHtcblx0XHRcdFx0aWYgKHNxdWFyZSkge1xuXHRcdFx0XHRcdHRoaXMuZHJhd1BpZWNlKHNxdWFyZSwgeCAqIGNlbGxXaWR0aCwgeSAqIGNlbGxXaWR0aClcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG5cblx0cGFzc0dhbWUoZ2FtZSkge1xuXHRcdHRoaXMuZ2FtZSA9IGdhbWVcblx0fVxuXG5cdGRyYXdCb2FyZCgpIHtcblx0XHRsZXQgeyBnYW1lIH0gPSB0aGlzXG5cblx0XHR0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5ib2FyZFdpZHRoLCB0aGlzLmJvYXJkV2lkdGgpXG5cdFx0bGV0IGdhbWVTdGF0ZSA9IGdhbWUuZ2V0U3RhdGUoKVxuXG5cdFx0dGhpcy5yZW5kZXIoKVxuXHRcdHRoaXMuZHJhd1BpZWNlcyhnYW1lU3RhdGUpXG5cdH1cblxuXHR3cml0ZVRleHQodGV4dCkge1xuXHRcdGxldCB7IGN0eCwgYm9hcmRXaWR0aCB9ID0gdGhpc1xuXHRcdGxldCBkaW0gPSBib2FyZFdpZHRoLzJcblx0XHRjdHgudGV4dEFsaWduID0gJ2NlbnRlcidcblx0XHRjdHguZm9udCA9ICc3MnB4IEhlbHZldGljYSdcblx0XHRjdHguZmlsbFN0eWxlID0gJ3doaXRlJ1xuXHRcdGN0eC5zdHJva2VTdHlsZSA9ICdibGFjaydcblx0XHRjdHguZmlsbFRleHQodGV4dCwgZGltLCBkaW0pXG5cdFx0Y3R4LnN0cm9rZVRleHQodGV4dCwgZGltLCBkaW0pXG5cdFx0Y3R4LmZpbGwoKVxuXHRcdGN0eC5zdHJva2UoKVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGxldCB7IGN0eCwgYm9hcmRXaWR0aCwgY2VsbFdpZHRoIH0gPSB0aGlzXG5cblx0XHRjdHguc3Ryb2tlU3R5bGUgPSAnYmxhY2snXG5cdFx0Zm9yIChsZXQgaSA9IGNlbGxXaWR0aDsgaSA8IGJvYXJkV2lkdGg7IGkgKz0gY2VsbFdpZHRoKVx0IHtcblx0XHRcdGN0eC5iZWdpblBhdGgoKVxuXHRcdFx0Y3R4Lm1vdmVUbyhpLCAwKVxuXHRcdFx0Y3R4LmxpbmVUbyhpLCBib2FyZFdpZHRoKVxuXHRcdFx0Y3R4Lm1vdmVUbygwLCBpKVxuXHRcdFx0Y3R4LmxpbmVUbyhib2FyZFdpZHRoLCBpKVxuXHRcdFx0Y3R4LmxpbmVXaWR0aCA9IDJcblx0XHRcdGN0eC5zdHJva2UoKVxuXHRcdH1cblx0fVxuXG5cdGRlbGV0ZUJvYXJkKCkge1xuXHRcdHN0cmV0Y2hlci5yZW1vdmVDaGlsZCh0aGlzLmNhbnZhcylcblx0fVxufVxuIiwiaW1wb3J0IEJvYXJkIGZyb20gJy4vYm9hcmQnO1xuaW1wb3J0IFNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWUge1xuXHRjb25zdHJ1Y3Rvcihzb2NrZXRJbnN0YW5jZSkge1xuXHRcdHRoaXMuc29ja2V0ID0gbmV3IFNvY2tldChzb2NrZXRJbnN0YW5jZSwgdGhpcyk7XG5cdFx0dGhpcy5oYW5kbGVXaW4gPSB0aGlzLmhhbmRsZVdpbi5iaW5kKHRoaXMpXG5cdFx0dGhpcy5oYW5kbGVEcmF3ID0gdGhpcy5oYW5kbGVEcmF3LmJpbmQodGhpcylcblxuXHRcdHRoaXMuX2luaXQoKVxuXG5cdFx0bGV0IGJvYXJkID0gbmV3IEJvYXJkKClcblx0XHRib2FyZC5wYXNzR2FtZSh0aGlzKVxuXHRcdGJvYXJkLmRyYXdCb2FyZCgpXG5cdFx0dGhpcy5ib2FyZCA9IGJvYXJkXG5cdH1cblxuXHRfaW5pdCgpIHtcblx0XHQvLyBlbXB0eSBib2FyZFxuXHRcdHRoaXMuZ2FtZVN0YXRlID0gW1xuXHRcdFx0WyBudWxsLCBudWxsLCBudWxsIF0sXG5cdFx0XHRbIG51bGwsIG51bGwsIG51bGwgXSxcblx0XHRcdFsgbnVsbCwgbnVsbCwgbnVsbCBdXG5cdFx0XVxuXG5cdFx0dGhpcy5wbGF5ZXJQaWVjZSA9IFwiWFwiXG5cdFx0dGhpcy5jb21wdXRlclBpZWNlID0gdGhpcy5wbGF5ZXJQaWVjZSA9PT0gXCJYXCIgPyBcIk9cIiA6IFwiWFwiXG5cdFx0dGhpcy5pc1BsYXllclR1cm4gPSB0cnVlXG5cdFx0dGhpcy5nYW1lT3ZlciA9IGZhbHNlO1xuXHQgfVxuXG5cdGdldFN0YXRlKCkge1xuXHRcdHJldHVybiB0aGlzLmdhbWVTdGF0ZVxuXHR9XG5cblx0ZXZhbHVhdGVDbGljayh4LCB5KSB7XG5cdFx0bGV0IHsgaXNQbGF5ZXJUdXJuLCBwbGF5ZXJQaWVjZSwgYm9hcmQsIGdhbWVPdmVyIH0gPSB0aGlzO1xuXHRcdC8vIGNoZWNrIGlmIGxlZ2FsIG1vdmVcblx0XHRpZiAoIXRoaXMuZ2FtZVN0YXRlW3ldW3hdICYmIGlzUGxheWVyVHVybiAmJiAhZ2FtZU92ZXIpIHtcblx0XHRcdHRoaXMubW92ZSh4LCB5LCBwbGF5ZXJQaWVjZSlcblx0XHR9IFxuXHR9XG5cblx0Ly8gZGVmYXVsdCBwYXJhbWV0ZXIgZm9yIHBpZWNlIHRvIG1ha2UgcGFzc2luZyBtb3ZlcyBiYWNrIGZyb20gc2VydmVyIGVhc2llclxuXHRtb3ZlKHgsIHksIHBpZWNlID0gdGhpcy5jb21wdXRlclBpZWNlKSB7XG5cdFx0bGV0IHsgYm9hcmQsIHNvY2tldCwgaGFuZGxlV2luLCBoYW5kbGVEcmF3LCBnYW1lU3RhdGUgfSA9IHRoaXMsIGJvYXJkV2lkdGggPSBnYW1lU3RhdGUubGVuZ3RoO1xuXHRcdHRoaXMuZ2FtZVN0YXRlW3ldW3hdID0gcGllY2Vcblx0XHRib2FyZC5kcmF3Qm9hcmQoKVxuXG5cdFx0Ly8gY2hlY2sgZm9yIHdpbiBhZnRlciBtb3ZlIG1hZGVcblx0XHQvLyByb3dzXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChnYW1lU3RhdGVbeV1baV0gIT0gcGllY2UpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHQgXHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gY29sdW1uc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZ2FtZVN0YXRlW2ldW3hdICE9IHBpZWNlKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGkgPT09IGJvYXJkV2lkdGgtMSkge1xuXHRcdFx0XHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gdXBwZXItbGVmdCB0byBib3R0b20tcmlnaHQgZGlhZ29uYWxcblx0XHRpZiAoeCA9PT0geSkgeyBcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYm9hcmRXaWR0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChnYW1lU3RhdGVbaV1baV0gIT0gcGllY2UpIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChpID09PSBib2FyZFdpZHRoLTEpIHtcblx0XHRcdFx0XHRoYW5kbGVXaW4ocGllY2UpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB1cHBlci1yaWdodCB0byBib3R0b20tbGVmdCBkaWFnb25hbFxuXHRcdGlmICh4ICsgeSA9PT0gYm9hcmRXaWR0aC0xKSB7IFxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBib2FyZFdpZHRoOyBpKyspIHtcblx0XHRcdFx0aWYgKGdhbWVTdGF0ZVtpXVsoYm9hcmRXaWR0aC0xKSAtIGldICE9IHBpZWNlKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaSA9PT0gYm9hcmRXaWR0aC0xKSB7XG5cdFx0XHRcdFx0aGFuZGxlV2luKHBpZWNlKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLmdhbWVPdmVyKSB7XG5cdFx0XHRpZiAoIWdhbWVTdGF0ZS5zb21lKHJvdyA9PiByb3cuc29tZShjZWxsID0+ICFjZWxsKSkpIHtcblx0XHRcdFx0aGFuZGxlRHJhdygpXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuaXNQbGF5ZXJUdXJuKSB7XG5cdFx0XHRcdHNvY2tldC5zZW5kR2FtZVN0YXRlKGdhbWVTdGF0ZSlcdFx0XG5cdFx0XHRcdHRoaXMuaXNQbGF5ZXJUdXJuID0gZmFsc2Vcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuaXNQbGF5ZXJUdXJuID0gdHJ1ZVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGhhbmRsZVdpbihwaWVjZSkge1xuXHRcdGxldCB7IHBsYXllclBpZWNlLCBib2FyZCB9ID0gdGhpcztcblx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblxuXHRcdGlmIChwaWVjZSA9PT0gcGxheWVyUGllY2UpIHtcblx0XHRcdGJvYXJkLndyaXRlVGV4dChcIllvdSB3aW4hXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRib2FyZC53cml0ZVRleHQoXCJZb3UgbG9zZSFcIik7XG5cdFx0fVxuXHR9XG5cblx0aGFuZGxlRHJhdygpIHtcblx0XHR0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcblxuXHRcdHRoaXMuYm9hcmQud3JpdGVUZXh0KFwiSXQncyBhIGRyYXchXCIpO1xuXHR9XG5cblx0Ly8gdXNlZCBpbiBjYXNlIG9mIHJlZHVuZGFudCBnYW1lIHN0YXJ0aW5nIGZyb20gc2VydmVyXG5cdC8vIHdoaWNoIGNhdXNlcyB1bmRlc2lyYWJsZSBib2FyZCBkdXBsaWNhdGVzXG5cdHdpcGUoKSB7XG5cdFx0dGhpcy5ib2FyZC5kZWxldGVCb2FyZCgpXG5cdH1cbn1cbiIsImB1c2Ugc3RyaWN0YFxuXG5pbXBvcnQgeyBwYW5lbFRvZ2dsZSB9IGZyb20gJy4vYXBwJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTb2NrZXQge1xuXHRjb25zdHJ1Y3Rvcihzb2NrZXQsIGdhbWUpIHtcblx0XHR0aGlzLnNvY2tldCA9IHNvY2tldFxuXHRcdHRoaXMuZ2FtZSA9IGdhbWU7XG5cblx0XHRzb2NrZXQub24oJ3NlcnZlclBhc3NNb3ZlJywgbW92ZSA9PiB7XG5cdFx0XHRsZXQgeyB4LCB5IH0gPSBtb3ZlXG5cdFx0XHQvLyBzZXRUaW1lb3V0KCgpID0+IHRoaXMuZ2FtZS5tb3ZlKHgsIHkpLCAxMDAwKVxuXHRcdFx0dGhpcy5nYW1lLm1vdmUoeCwgeSlcblx0XHRcdHBhbmVsVG9nZ2xlKClcblx0XHR9KVxuXHR9XG5cblx0c2VuZEdhbWVTdGF0ZShnYW1lU3RhdGUpIHtcblx0XHR0aGlzLnNvY2tldC5lbWl0KCdjbGllbnRQYXNzU3RhdGUnLCBnYW1lU3RhdGUpXG5cdFx0cGFuZWxUb2dnbGUoKVxuXHR9XG59XG5cbiJdfQ==
