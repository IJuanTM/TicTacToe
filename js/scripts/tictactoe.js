// Defining constants
const field = document.querySelector('section.field');
const cells = field.querySelectorAll('div.row > div.col');
const reset = document.querySelector('div.reset');
const restart = document.querySelector('div.restart');
const oScore = document.querySelector('#o-score');
const xScore = document.querySelector('#x-score');
const message = document.querySelector('span.message');
const cards = document.querySelectorAll('section.card');
const hLine = document.querySelector('div.h-line');
const vLine = document.querySelector('div.v-line');
const dLineL = document.querySelector('div.d-line-l');
const dLineR = document.querySelector('div.d-line-r');

// Define winning combinations
const winStates = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top left to bottom right
  [2, 4, 6] // Diagonal top right to bottom left
];

// Define variables
let game = [], turn = 'o', oWins = 0, xWins = 0, start = 'o';

// Add event listeners to every game cell
cells.forEach(cell => cell.addEventListener('click', async () => {
  if (cell.innerHTML === '') {
    await makeMove(cell);
    await checkWin();
  }
}));

// Make move for current player
const makeMove = async (cell) => {
  if (turn === 'o') Omove(cell);
  else Xmove(cell);
};

// Make move for circle
const Omove = (cell) => {
  cell.innerHTML = '<div class="o"></div>';
  game[cell.id] = 'o';
  field.classList.remove('o-turn');
  turn = 'x';
  field.classList.add('x-turn');
  message.innerHTML = 'Crosses turn';
}

// Make move for cross
const Xmove = (cell) => {
  cell.innerHTML = '<div class="x"></div>';
  game[cell.id] = 'x';
  field.classList.remove('x-turn');
  turn = 'o';
  field.classList.add('o-turn');
  message.innerHTML = 'Circles\' turn';
}

// Check if there is a winner or if the game is a draw
const checkWin = async () => {
  winStates.every(state => {
    if (game[state[0]] && game[state[0]] === game[state[1]] && game[state[0]] === game[state[2]]) {
      field.style.pointerEvents = 'none';
      if (game[state[0]] === 'o') Owins(state);
      else Xwins(state);
      updateScores();
      return false;
    } else if (field.querySelectorAll('div.col > div').length === 9) message.innerHTML = 'It\'s a draw!';
    return true;
  });
}

// If circle wins
const Owins = (state) => {
  oWins++;
  start = 'x';
  message.innerHTML = 'Circle wins!';
  if (state[0] === 0 && state[1] === 1 && state[2] === 2) setLine('h', 11, '#00f');
  else if (state[0] === 3 && state[1] === 4 && state[2] === 5) setLine('h', 35.2, '#00f');
  else if (state[0] === 6 && state[1] === 7 && state[2] === 8) setLine('h', 59.4, '#00f');
  else if (state[0] === 0 && state[1] === 3 && state[2] === 6) setLine('v', 11, '#00f');
  else if (state[0] === 1 && state[1] === 4 && state[2] === 7) setLine('v', 35.2, '#00f');
  else if (state[0] === 2 && state[1] === 5 && state[2] === 8) setLine('v', 59.4, '#00f');
  else if (state[0] === 0 && state[1] === 4 && state[2] === 8) setLine('dl', null, '#00f');
  else if (state[0] === 2 && state[1] === 4 && state[2] === 6) setLine('dr', null, '#00f');
}

// If cross wins
const Xwins = (state) => {
  xWins++;
  start = 'o';
  message.innerHTML = 'Cross wins!';
  if (state[0] === 0 && state[1] === 1 && state[2] === 2) setLine('h', 11, '#f00');
  else if (state[0] === 3 && state[1] === 4 && state[2] === 5) setLine('h', 35.2, '#f00');
  else if (state[0] === 6 && state[1] === 7 && state[2] === 8) setLine('h', 59.4, '#f00');
  else if (state[0] === 0 && state[1] === 3 && state[2] === 6) setLine('v', 11, '#f00');
  else if (state[0] === 1 && state[1] === 4 && state[2] === 7) setLine('v', 35.2, '#f00');
  else if (state[0] === 2 && state[1] === 5 && state[2] === 8) setLine('v', 59.4, '#f00');
  else if (state[0] === 0 && state[1] === 4 && state[2] === 8) setLine('dl', null, '#f00');
  else if (state[0] === 2 && state[1] === 4 && state[2] === 6) setLine('dr', null, '#f00');
}

const setLine = (line, pos, color) => {
  if (line === 'h') {
    hLine.style.top = pos + 'vmin';
    hLine.style.backgroundColor = color;
  } else if (line === 'v') {
    vLine.style.left = pos + 'vmin';
    vLine.style.backgroundColor = color;
  } else if (line === 'dl') dLineL.style.backgroundColor = color;
  else if (line === 'dr') dLineR.style.backgroundColor = color;
}

const clearLines = () => {
  hLine.style.backgroundColor = 'transparent';
  vLine.style.backgroundColor = 'transparent';
  dLineL.style.backgroundColor = 'transparent';
  dLineR.style.backgroundColor = 'transparent';
}

// Update scores
const updateScores = () => {
  oScore.innerHTML = oWins.toString();
  xScore.innerHTML = xWins.toString();
}

// Clear the scoreboard
const clearScores = () => {
  oWins = 0;
  xWins = 0;
  updateScores();
}

// Start a new game
const startGame = () => {
  updateScores();
  restartGame();
};

// When circle starts
const Ostarts = () => {
  turn = 'o';
  field.classList.remove('x-turn');
  field.classList.add('o-turn');
  message.innerHTML = 'Circle starts!';
}

// When cross starts
const Xstarts = () => {
  turn = 'x';
  field.classList.remove('o-turn');
  field.classList.add('x-turn');
  message.innerHTML = 'Cross starts!';
}

// Restart the game
const restartGame = () => {
  game = [];
  clearLines();
  cells.forEach(cell => cell.innerHTML = '');
  if (start === 'o') Ostarts();
  else Xstarts();
  field.style.pointerEvents = 'auto';
};

// Event listener for score reset
reset.addEventListener('click', clearScores);

// Event listener for restart
restart.addEventListener('click', restartGame);

// Event listener for starting on page load
window.addEventListener('load', startGame);
