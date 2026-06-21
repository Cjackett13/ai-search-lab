//all the ways you can win
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const now = typeof performance !== 'undefined' && performance.now
  ? () => performance.now()
  : () => Date.now();

function emptyBoard() {
  return ['', '', '', '', '', '', '', '', ''];
}

function opponentOf(player) {
  return player === 'X' ? 'O' : 'X';
}

//puts a player on a cell and hands back a fresh copy
function makeMove(board, index, player) {
  const next = board.slice();
  next[index] = player;
  return next;
}

//all the open spots left
function emptyCells(board) {
  const cells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') cells.push(i);
  }
  return cells;
}

//check if this player get three in a row
function isWinner(board, player) {
  return WINNING_LINES.some(line => line.every(i => board[i] === player));
}

function winningLine(board, player) {
  return WINNING_LINES.find(line => line.every(i => board[i] === player)) || null;
}

// board is full + nobody won
function isDraw(board) {
  return emptyCells(board).length === 0 && !isWinner(board, 'X') && !isWinner(board, 'O');
}

function isTerminal(board, aiPlayer, humanPlayer) {
  return isWinner(board, aiPlayer) || isWinner(board, humanPlayer) || emptyCells(board).length === 0;
}

//high number good,low number bad
function score(board, depth, aiPlayer, humanPlayer) {
  if (isWinner(board, aiPlayer)) return 10 - depth;
  if (isWinner(board, humanPlayer)) return depth - 10;
  return 0;
}

//looks at every possible game, picks the best move
function minimax(board, depth, isMaximizing, aiPlayer, humanPlayer, counter) {
  counter.nodes++;
  if (isTerminal(board, aiPlayer, humanPlayer)) {
    return score(board, depth, aiPlayer, humanPlayer);
  }
  if (isMaximizing) {
    let best = -Infinity;
    for (const cell of emptyCells(board)) {
      const value = minimax(makeMove(board, cell, aiPlayer), depth + 1, false, aiPlayer, humanPlayer, counter);
      best = Math.max(best, value);
    }
    return best;
  }
  let best = Infinity;
  for (const cell of emptyCells(board)) {
    const value = minimax(makeMove(board, cell, humanPlayer), depth + 1, true, aiPlayer, humanPlayer, counter);
    best = Math.min(best, value);
  }
  return best;
}

// same as minimax but skips branches it doesnt even need to check
function alphaBeta(board, depth, alpha, beta, isMaximizing, aiPlayer, humanPlayer, counter) {
  counter.nodes++;
  if (isTerminal(board, aiPlayer, humanPlayer)) {
    return score(board, depth, aiPlayer, humanPlayer);
  }
  if (isMaximizing) {
    let best = -Infinity;
    for (const cell of emptyCells(board)) {
      const value = alphaBeta(makeMove(board, cell, aiPlayer), depth + 1, alpha, beta, false, aiPlayer, humanPlayer, counter);
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const cell of emptyCells(board)) {
    const value = alphaBeta(makeMove(board, cell, humanPlayer), depth + 1, alpha, beta, true, aiPlayer, humanPlayer, counter);
    best = Math.min(best, value);
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

//runs the search and gives back the move plus all the stats
function findBestMove(board, algorithm, aiPlayer = 'X') {
  const humanPlayer = opponentOf(aiPlayer);
  const counter = { nodes: 0 };
  const start = now();

  let bestScore = -Infinity;
  let bestMove = null;

  for (const cell of emptyCells(board)) {
    const next = makeMove(board, cell, aiPlayer);
    const value = algorithm === 'alphabeta'
      ? alphaBeta(next, 1, -Infinity, Infinity, false, aiPlayer, humanPlayer, counter)
      : minimax(next, 1, false, aiPlayer, humanPlayer, counter);
    if (value > bestScore) {
      bestScore = value;
      bestMove = cell;
    }
  }

  return {
    move: bestMove,
    score: bestScore,
    nodes: counter.nodes,
    timeMs: now() - start,
    algorithm,
  };
}

// runs both so we can see how many nodes alpha beta saved
function pruningEfficiency(board, aiPlayer = 'X') {
  const mini = findBestMove(board, 'minimax', aiPlayer);
  const ab = findBestMove(board, 'alphabeta', aiPlayer);
  const percent = mini.nodes === 0 ? 0 : ((mini.nodes - ab.nodes) / mini.nodes) * 100;
  return {
    minimax: mini,
    alphabeta: ab,
    agree: mini.move === ab.move,
    percentPruned: percent,
  };
}

const ModuleB = {
  emptyBoard,
  opponentOf,
  makeMove,
  emptyCells,
  isWinner,
  winningLine,
  isDraw,
  isTerminal,
  minimax,
  alphaBeta,
  findBestMove,
  pruningEfficiency,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleB;
}

if (typeof window !== 'undefined') {
  window.ModuleB = ModuleB;
}
