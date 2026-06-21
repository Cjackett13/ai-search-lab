const { emptyBoard, pruningEfficiency } = require('../game-logic');

const board = emptyBoard();
const result = pruningEfficiency(board, 'X');

console.log('Standardized position: empty board, AI plays first as X');
console.log('-------------------------------------------------------');
console.log('Minimax    -> move:', result.minimax.move, '| nodes:', result.minimax.nodes, '| score:', result.minimax.score);
console.log('Alpha-Beta -> move:', result.alphabeta.move, '| nodes:', result.alphabeta.nodes, '| score:', result.alphabeta.score);
console.log('-------------------------------------------------------');
console.log('Same move?        ', result.agree);
console.log('Pruning efficiency:', result.percentPruned.toFixed(1) + '% fewer nodes');
console.log('Alpha-Beta <= Minimax nodes?', result.alphabeta.nodes <= result.minimax.nodes);
