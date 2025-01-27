const board = document.getElementById('board');
const historyList = document.getElementById('history');
const clearHistoryButton = document.getElementById('clear-history');

let currentPlayer = 'X';
let moves = [];
let boardState = Array(9).fill(null);
let history = JSON.parse(localStorage.getItem('ticTacToeHistory')) || [];

// Render the board
function createBoard() {
  board.innerHTML = '';
  boardState.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    if (cell) cellDiv.classList.add('taken');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleMove(index));
    board.appendChild(cellDiv);
  });
}

// Handle player move
function handleMove(index) {
  if (boardState[index]) return;

  boardState[index] = currentPlayer;
  moves.push(`Player ${currentPlayer} placed at position ${index + 1}`);

  if (checkWinner()) {
    const winningCombo = checkWinner();
    highlightWinningCells(winningCombo);
    saveGame(`${currentPlayer} Wins!`);
    alert(`Player ${currentPlayer} wins!`);
    resetGame();
    return;
  }

  if (boardState.every(cell => cell)) {
    saveGame('Draw');
    alert('It\'s a draw!');
    resetGame();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  createBoard();
}

// Highlight winning cells
function highlightWinningCells(combo) {
  combo.forEach(index => {
    const cell = board.children[index];
    cell.classList.add('win');
  });
}

// Check for a winner
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return combo;
    }
  }

  return null;
}

// Update history list
function updateHistory() {
  historyList.innerHTML = '';
  history.forEach(record => {
    const li = document.createElement('li');
    li.textContent = record;
    historyList.appendChild(li);
  });
}

// Save game result
function saveGame(result) {
  history.push(result);
  localStorage.setItem('ticTacToeHistory', JSON.stringify(history));
  updateHistory();
}

// Reset the game
function resetGame() {
  boardState = Array(9).fill(null);
  moves = [];
  currentPlayer = 'X';
  createBoard();
}

// Clear history
clearHistoryButton.addEventListener('click', () => {
  history = [];
  localStorage.removeItem('ticTacToeHistory');
  updateHistory();
});

// Initialize the game
createBoard();
updateHistory();
