/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(player1, player2, width, height) {
		for (let dim of [ width, height ]) {
			if (!Number.isFinite(dim) || dim <= 0) {
				throw new Error('Width and height must be a positive number');
			}
		}
		this.WIDTH = width;
		this.HEIGHT = height;
    this.player1 = player1;
    this.player2 = player2;
		this.currPlayer = player1; // active player: player1 or player2
		this.board = []; // array of rows, each row is array of cells  (board[y][x])

    this.makeBoard();
    this.makeHtmlBoard();
	}
  /** makeBoard: create in-JS board structure:
  *   board = array of rows, each row is array of cells  (board[y][x])
  */
  makeBoard() {
    this.board = [];
    const {WIDTH, HEIGHT} = this;
    for (let y = 0; y < HEIGHT; y++) {
      this.board.push(Array.from({ length: WIDTH }));
    }
  }
  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    let {WIDTH, HEIGHT, handleClick} = this;
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', handleClick.bind(this));

    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    boardEl.append(top);

    // make main part of board
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      boardEl.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    const {HEIGHT} = this;
    let {board} = this;
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    let {currPlayer} = this;
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = currPlayer.color;
    //piece.classList.add(`p${currPlayer}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */
  endGame = (msg) => {
    alert(msg);
  }
  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    let {currPlayer, board} = this;

    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.clearGame();
      return this.endGame(`${currPlayer.color.toUpperCase()} PLAYER WINS!!!`);
    }
    
    // check for tie
    if (board.every(row => row.every(cell => cell))) {
      this.clearGame();
      return this.endGame('TIE!');
    }
      
    // switch players
    //this.currPlayer = currPlayer === 1 ? 2 : 1;
    this.currPlayer = currPlayer === this.player1 ? this.player2 : this.player1;
  }
  /** clearGame: resets/clears html game fields for new game */
  clearGame() {
    let {handleClick} = this;
    const top = document.getElementById('column-top');
    const player1Color = document.getElementById('player1');
    const player2Color = document.getElementById('player2');
    //!!!!fix removeEventListener / bind(this)!!!!
    top.removeEventListener('click', handleClick.bind(this));
    top.innerHTML = '';
    player1Color.value = '';
    player2Color.value = '';
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    const {WIDTH, HEIGHT} = this;
    let {currPlayer, board} = this;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }
  
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

const startBtn = document.getElementById('start-game');
const player1Color = document.getElementById('player1');
const player2Color = document.getElementById('player2');

isColor = (color) => {
  let style = new Option().style;
  style.color = color;
  return style.color == color;
}

startBtn.addEventListener('click', () => {
  if( player1Color.value && isColor(player1Color.value) && 
      player2Color.value && isColor(player2Color.value) ){
    const player1 = new Player(player1Color.value);
    const player2 = new Player(player2Color.value);
    new Game(player1, player2, 7, 6);
  }else{
    alert('Please enter valid color values for Player colors');
  }
});

