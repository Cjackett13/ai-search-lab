//all the ways you can win
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function currentTimeMs() {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
}

export function emptyBoard() {
  return ['', '', '', '', '', '', '', '', ''];
}

export function opponentOf(player) {
  return player === 'X' ? 'O' : 'X';
}

//puts a player on a cell and hands back a fresh copy
export function makeMove(board, index, player) {
  const next = board.slice();
  next[index] = player;
  return next;
}

//all the open spots left
export function emptyCells(board) {
  const cells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') cells.push(i);
  }
  return cells;
}

//the winning line this player has, or null if they dont have one
export function winningLine(board, player) {
  for (const line of WINNING_LINES) {
    const first = line[0];
    const second = line[1];
    const third = line[2];
    if (board[first] === player && board[second] === player && board[third] === player) {
      return line;
    }
  }
  return null;
}

//check if this player got three in a row
export function isWinner(board, player) {
  return winningLine(board, player) !== null;
}

// board is full and nobody won
export function isDraw(board) {
  const boardIsFull = emptyCells(board).length === 0;
  const someoneWon = isWinner(board, 'X') || isWinner(board, 'O');
  return boardIsFull && !someoneWon;
}

//the game is over if someone won or there are no moves left
export function isTerminal(board, aiPlayer, humanPlayer) {
  if (isWinner(board, aiPlayer)) return true;
  if (isWinner(board, humanPlayer)) return true;
  if (emptyCells(board).length === 0) return true;
  return false;
}

//high number good for our ai, low number bad
function score(board, depth, aiPlayer, humanPlayer) {
  if (isWinner(board, aiPlayer)) return 10 - depth;
  if (isWinner(board, humanPlayer)) return depth - 10;
  return 0;
}

//looks at every possible game and returns the best score it can reach
export function minimax(board, depth, isMaximizing, aiPlayer, humanPlayer, counter) {
  counter.nodes++;
  if (isTerminal(board, aiPlayer, humanPlayer)) {
    return score(board, depth, aiPlayer, humanPlayer);
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const cell of emptyCells(board)) {
      const nextBoard = makeMove(board, cell, aiPlayer);
      const value = minimax(nextBoard, depth + 1, false, aiPlayer, humanPlayer, counter);
      if (value > bestScore) {
        bestScore = value;
      }
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const cell of emptyCells(board)) {
    const nextBoard = makeMove(board, cell, humanPlayer);
    const value = minimax(nextBoard, depth + 1, true, aiPlayer, humanPlayer, counter);
    if (value < bestScore) {
      bestScore = value;
    }
  }
  return bestScore;
}

// same as minimax but skips branches it doesnt even need to check
export function alphaBeta(board, depth, alpha, beta, isMaximizing, aiPlayer, humanPlayer, counter) {
  counter.nodes++;
  if (isTerminal(board, aiPlayer, humanPlayer)) {
    return score(board, depth, aiPlayer, humanPlayer);
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const cell of emptyCells(board)) {
      const nextBoard = makeMove(board, cell, aiPlayer);
      const value = alphaBeta(nextBoard, depth + 1, alpha, beta, false, aiPlayer, humanPlayer, counter);
      if (value > bestScore) {
        bestScore = value;
      }
      if (bestScore > alpha) {
        alpha = bestScore;
      }
      if (beta <= alpha) {
        break;
      }
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (const cell of emptyCells(board)) {
    const nextBoard = makeMove(board, cell, humanPlayer);
    const value = alphaBeta(nextBoard, depth + 1, alpha, beta, true, aiPlayer, humanPlayer, counter);
    if (value < bestScore) {
      bestScore = value;
    }
    if (bestScore < beta) {
      beta = bestScore;
    }
    if (beta <= alpha) {
      break;
    }
  }
  return bestScore;
}

// tries each possible move from this board and keeps the best one
function runSearch(board, algorithm, aiPlayer, humanPlayer) {
  const counter = { nodes: 0 };
  let bestMove = null;
  let bestScore = -Infinity;

  for (const cell of emptyCells(board)) {
    const nextBoard = makeMove(board, cell, aiPlayer);

    let value;
    if (algorithm === 'alphabeta') {
      value = alphaBeta(nextBoard, 1, -Infinity, Infinity, false, aiPlayer, humanPlayer, counter);
    } else {
      value = minimax(nextBoard, 1, false, aiPlayer, humanPlayer, counter);
    }

    if (value > bestScore) {
      bestScore = value;
      bestMove = cell;
    }
  }

  return { bestMove, bestScore, nodes: counter.nodes };
}

//runs the search and gives back the move plus all the stats for the dashboard
export function findBestMove(board, algorithm, aiPlayer = 'X') {
  const humanPlayer = opponentOf(aiPlayer);

  const startTime = currentTimeMs();
  const result = runSearch(board, algorithm, aiPlayer, humanPlayer);
  const decisionTimeMs = currentTimeMs() - startTime;

  // alpha beta only knows how much it saved by comparing against a plain minimax run
  let pruningEfficiency = 'N/A';
  if (algorithm === 'alphabeta') {
    const minimaxNodes = runSearch(board, 'minimax', aiPlayer, humanPlayer).nodes;
    let percent = 0;
    if (minimaxNodes > 0) {
      const nodesSaved = minimaxNodes - result.nodes;
      percent = (nodesSaved / minimaxNodes) * 100;
    }
    pruningEfficiency = percent.toFixed(1) + '%';
  }

  return {
    bestMove: result.bestMove,
    score: result.bestScore,
    nodesExplored: result.nodes,
    pruningEfficiency,
    decisionTimeMs,
  };
}

// runs both so we can see how many nodes alpha beta saved
export function compareAlgorithms(board, aiPlayer = 'X') {
  const minimaxResult = findBestMove(board, 'minimax', aiPlayer);
  const alphaBetaResult = findBestMove(board, 'alphabeta', aiPlayer);

  let percentPruned = 0;
  if (minimaxResult.nodesExplored > 0) {
    const nodesSaved = minimaxResult.nodesExplored - alphaBetaResult.nodesExplored;
    percentPruned = (nodesSaved / minimaxResult.nodesExplored) * 100;
  }

  return {
    minimax: minimaxResult,
    alphabeta: alphaBetaResult,
    agree: minimaxResult.bestMove === alphaBetaResult.bestMove,
    percentPruned,
  };
}
