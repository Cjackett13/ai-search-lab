import {
  emptyBoard,
  makeMove,
  emptyCells,
  isWinner,
  winningLine,
  isDraw,
  findBestMove,
  compareAlgorithms,
} from '../game-logic.js';

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(name);
    console.log('  FAIL: ' + name);
  }
}

function section(title) {
  console.log('\n' + title);
}

const X = 'X';
const O = 'O';
const _ = '';

// ---- Board helpers ----
section('Board helpers');
(() => {
  const board = emptyBoard();
  const next = makeMove(board, 4, X);
  check('makeMove does not mutate the original board', board[4] === '');
  check('makeMove places the player on the copy', next[4] === X);
  check('emptyCells lists every empty index', emptyCells(next).join(',') === '0,1,2,3,5,6,7,8');
  check('emptyCells is empty on a full board',
    emptyCells([X, O, X, X, O, O, O, X, X]).length === 0);
})();

// ---- Win / draw detection ----
section('Win / draw detection');
(() => {
  check('row win detected', isWinner([X, X, X, _, _, _, _, _, _], X));
  check('column win detected', isWinner([X, _, _, X, _, _, X, _, _], X));
  check('main diagonal win detected', isWinner([X, _, _, _, X, _, _, _, X], X));
  check('anti-diagonal win detected', isWinner([_, _, X, _, X, _, X, _, _], X));
  check('no false positive on empty board', !isWinner(emptyBoard(), X));
  check('winningLine returns the winning triple',
    JSON.stringify(winningLine([X, X, X, _, _, _, _, _, _], X)) === '[0,1,2]');

  const drawBoard = [X, O, X, X, O, O, O, X, X];
  check('full board with no line is a draw', isDraw(drawBoard));
  check('a won board is not a draw', !isDraw([X, X, X, O, O, _, _, _, _]));
  check('a non-full board is not a draw', !isDraw([X, O, _, _, _, _, _, _, _]));
})();

// ---- Minimax ----
section('Minimax');
const winNowBoard = [X, X, _, O, O, _, _, _, _];   // X plays 2 to win
const blockBoard = [O, O, _, X, _, _, X, _, _];    // X must play 2 to block O
(() => {
  const win = findBestMove(winNowBoard, 'minimax', X);
  check('Minimax takes the immediate winning move', win.bestMove === 2);
  check('Minimax scores an immediate win positively', win.score > 0);

  const block = findBestMove(blockBoard, 'minimax', X);
  check('Minimax blocks the opponent immediate win', block.bestMove === 2);

  const first = findBestMove(emptyBoard(), 'minimax', X);
  const optimalOpenings = [0, 2, 4, 6, 8]; // corners or center
  check('Minimax empty-board first move is a corner or center',
    optimalOpenings.includes(first.bestMove));
  check('Minimax empty-board score is 0 (perfect play draws)', first.score === 0);
  check('Minimax exposes a positive node counter', first.nodesExplored > 0);
  check('Minimax pruningEfficiency is N/A', first.pruningEfficiency === 'N/A');
})();

// ---- Alpha-Beta ----
section('Alpha-Beta');
(() => {
  const win = findBestMove(winNowBoard, 'alphabeta', X);
  check('Alpha-Beta takes the immediate winning move', win.bestMove === 2);

  const block = findBestMove(blockBoard, 'alphabeta', X);
  check('Alpha-Beta blocks the opponent immediate win', block.bestMove === 2);

  const mini = findBestMove(emptyBoard(), 'minimax', X);
  const ab = findBestMove(emptyBoard(), 'alphabeta', X);
  check('Alpha-Beta explores <= Minimax nodes on empty board', ab.nodesExplored <= mini.nodesExplored);
  check('Alpha-Beta actually prunes on the empty board (fewer nodes)', ab.nodesExplored < mini.nodesExplored);
  check('Alpha-Beta exposes a positive node counter', ab.nodesExplored > 0);
  check('Alpha-Beta pruningEfficiency is a percentage string', /^\d+\.\d%$|^\d+\.\d+%$/.test(ab.pruningEfficiency));
})();

// ---- Cross-checks: same move, never more nodes ----
section('Minimax vs Alpha-Beta agreement');
(() => {
  const boards = [
    emptyBoard(),
    winNowBoard,
    blockBoard,
    [X, _, O, _, X, _, _, _, O],
    [X, O, X, _, O, _, _, _, _],
    [_, _, _, _, X, _, _, _, _],
  ];
  boards.forEach((board, i) => {
    const mini = findBestMove(board, 'minimax', X);
    const ab = findBestMove(board, 'alphabeta', X);
    check('board ' + i + ': Minimax and Alpha-Beta return the same move', mini.bestMove === ab.bestMove);
    check('board ' + i + ': Alpha-Beta nodes <= Minimax nodes', ab.nodesExplored <= mini.nodesExplored);
  });

  const report = compareAlgorithms(emptyBoard(), X);
  check('compareAlgorithms reports agreement', report.agree === true);
  check('compareAlgorithms reports a positive pruning percentage', report.percentPruned > 0);
})();

// summary
console.log('Passed: ' + passed + '   Failed: ' + failed);
if (failed > 0) {
  console.log('Failing cases:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
