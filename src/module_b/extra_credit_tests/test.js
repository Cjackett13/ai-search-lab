const logic = require('../game-logic');

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
  const board = logic.emptyBoard();
  const next = logic.makeMove(board, 4, X);
  check('makeMove does not mutate the original board', board[4] === '');
  check('makeMove places the player on the copy', next[4] === X);
  check('emptyCells lists every empty index', logic.emptyCells(next).join(',') === '0,1,2,3,5,6,7,8');
  check('emptyCells is empty on a full board',
    logic.emptyCells([X, O, X, X, O, O, O, X, X]).length === 0);
})();

// ---- Win / draw detection ----
section('Win / draw detection');
(() => {
  check('row win detected', logic.isWinner([X, X, X, _, _, _, _, _, _], X));
  check('column win detected', logic.isWinner([X, _, _, X, _, _, X, _, _], X));
  check('main diagonal win detected', logic.isWinner([X, _, _, _, X, _, _, _, X], X));
  check('anti-diagonal win detected', logic.isWinner([_, _, X, _, X, _, X, _, _], X));
  check('no false positive on empty board', !logic.isWinner(logic.emptyBoard(), X));
  check('winningLine returns the winning triple',
    JSON.stringify(logic.winningLine([X, X, X, _, _, _, _, _, _], X)) === '[0,1,2]');

  const drawBoard = [X, O, X, X, O, O, O, X, X];
  check('full board with no line is a draw', logic.isDraw(drawBoard));
  check('a won board is not a draw', !logic.isDraw([X, X, X, O, O, _, _, _, _]));
  check('a non-full board is not a draw', !logic.isDraw([X, O, _, _, _, _, _, _, _]));
})();

// ---- Minimax ----
section('Minimax');
const winNowBoard = [X, X, _, O, O, _, _, _, _];   // X plays 2 to win
const blockBoard = [O, O, _, X, _, _, X, _, _];    // X must play 2 to block O
(() => {
  const win = logic.findBestMove(winNowBoard, 'minimax', X);
  check('Minimax takes the immediate winning move', win.move === 2);
  check('Minimax scores an immediate win positively', win.score > 0);

  const block = logic.findBestMove(blockBoard, 'minimax', X);
  check('Minimax blocks the opponent immediate win', block.move === 2);

  const first = logic.findBestMove(logic.emptyBoard(), 'minimax', X);
  const optimalOpenings = [0, 2, 4, 6, 8]; // corners or center
  check('Minimax empty-board first move is a corner or center',
    optimalOpenings.includes(first.move));
  check('Minimax empty-board score is 0 (perfect play draws)', first.score === 0);
  check('Minimax exposes a positive node counter', first.nodes > 0);
})();

// ---- Alpha-Beta ----
section('Alpha-Beta');
(() => {
  const win = logic.findBestMove(winNowBoard, 'alphabeta', X);
  check('Alpha-Beta takes the immediate winning move', win.move === 2);

  const block = logic.findBestMove(blockBoard, 'alphabeta', X);
  check('Alpha-Beta blocks the opponent immediate win', block.move === 2);

  const mini = logic.findBestMove(logic.emptyBoard(), 'minimax', X);
  const ab = logic.findBestMove(logic.emptyBoard(), 'alphabeta', X);
  check('Alpha-Beta explores <= Minimax nodes on empty board', ab.nodes <= mini.nodes);
  check('Alpha-Beta actually prunes on the empty board (fewer nodes)', ab.nodes < mini.nodes);
  check('Alpha-Beta exposes a positive node counter', ab.nodes > 0);
})();

// ---- Cross-checks: same move, never more nodes ----
section('Minimax vs Alpha-Beta agreement');
(() => {
  const boards = [
    logic.emptyBoard(),
    winNowBoard,
    blockBoard,
    [X, _, O, _, X, _, _, _, O],
    [X, O, X, _, O, _, _, _, _],
    [_, _, _, _, X, _, _, _, _],
  ];
  boards.forEach((board, i) => {
    const mini = logic.findBestMove(board, 'minimax', X);
    const ab = logic.findBestMove(board, 'alphabeta', X);
    check('board ' + i + ': Minimax and Alpha-Beta return the same move', mini.move === ab.move);
    check('board ' + i + ': Alpha-Beta nodes <= Minimax nodes', ab.nodes <= mini.nodes);
  });

  const report = logic.pruningEfficiency(logic.emptyBoard(), X);
  check('pruningEfficiency reports agreement', report.agree === true);
  check('pruningEfficiency reports a positive pruning percentage', report.percentPruned > 0);
})();

// ---- Summary ----
console.log('\n=======================================');
console.log('Passed: ' + passed + '   Failed: ' + failed);
console.log('=======================================');
if (failed > 0) {
  console.log('Failing cases:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
