import { emptyBoard, compareAlgorithms } from '../game-logic.js';

const result = compareAlgorithms(emptyBoard(), 'X');

console.log('Standardized position: empty board, AI plays first as X');
console.log('-------------------------------------------------------');
console.log('Minimax    -> move:', result.minimax.bestMove, '| nodes:', result.minimax.nodesExplored, '| score:', result.minimax.score);
console.log('Alpha-Beta -> move:', result.alphabeta.bestMove, '| nodes:', result.alphabeta.nodesExplored, '| score:', result.alphabeta.score);
console.log('-------------------------------------------------------');
console.log('Same move?        ', result.agree);
console.log('Pruning efficiency:', result.percentPruned.toFixed(1) + '% fewer nodes');
console.log('Alpha-Beta <= Minimax nodes?', result.alphabeta.nodesExplored <= result.minimax.nodesExplored);
