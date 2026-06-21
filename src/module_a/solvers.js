// mechanism of actualyl finding  solutions

function manhattanDistance(state) {
  // Where each tile number SHOULD be in the goal state
  const goalRow = { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 0: 2 };
  const goalCol = { 1: 0, 2: 1, 3: 2, 4: 0, 5: 1, 6: 2, 7: 0, 8: 1, 0: 2 };

  let total = 0;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let tile = state[row][col];

      if (tile !== 0) {
        // How far is this tile from where it belongs?
        let rowDistance = Math.abs(row - goalRow[tile]);
        let colDistance = Math.abs(col - goalCol[tile]);
        total = total + rowDistance + colDistance;
      }
    }
  }

  return total;
}

//B BFS
function solveBFS(startState) {
  let startTime = performance.now(); // start timer
  let nodesExplored = 0;

  //the node we came from (so we can trace back the path)
  let queue = [];
  queue.push({ state: startState, parent: null });

  // visited to keepa track of states we already saw so we don't explore the same board twice
  let visited = new Set();
  visited.add(boardToString(startState));

  while (queue.length > 0) {
    // Take from the fornt of the queue (old state first)
    let current = queue.shift();
    nodesExplored++;

    // check to see if wee hit the goal state
    if (checkIfGoalReached(current.state)) {
      return {
        path: traceSolution(current),
        nodesExplored: nodesExplored,
        timeMs: performance.now() - startTime,
      };
    }

    // Find all legal moves
    let moves = identifyLegalMoves(current.state);

    for (let i = 0; i < moves.length; i++) {
      let newRow = moves[i][0];
      let newCol = moves[i][1];
      let newState = swapTiles(current.state, newRow, newCol);

      let key = boardToString(newState);

      // Only add it if we havent seen this board before
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: newState, parent: current });
      }
    }
  }

  return null; // no solution found
}

// dijkstra
function solveDijkstra(startState) {
  let startTime = performance.now();
  let nodesExplored = 0;

  // storuing cost
  let priorityQueue = [];
  priorityQueue.push({ state: startState, parent: null, cost: 0 });

  let visited = {};

  while (priorityQueue.length > 0) {
    // Sortso the cheapest node is first
    priorityQueue.sort(function (a, b) {
      return a.cost - b.cost;
    });

    let current = priorityQueue.shift();
    let key = boardToString(current.state);

    // Skip if we already processed this state
    if (visited[key]) {
      continue;
    }

    visited[key] = true;
    nodesExplored++;

    if (checkIfGoalReached(current.state)) {
      return {
        path: traceSolution(current),
        nodesExplored: nodesExplored,
        timeMs: performance.now() - startTime,
      };
    }

    let moves = identifyLegalMoves(current.state);

    for (let i = 0; i < moves.length; i++) {
      let newRow = moves[i][0];
      let newCol = moves[i][1];
      let newState = swapTiles(current.state, newRow, newCol);

      let newKey = boardToString(newState);

      if (!visited[newKey]) {
        priorityQueue.push({
          state: newState,
          parent: current,
          cost: current.cost + 1, // incremnt for each move
        });
      }
    }
  }

  return null;
}
// astar
function solveAStar(startState) {
  let startTime = performance.now();
  let nodesExplored = 0;

  let priorityQueue = [];
  priorityQueue.push({
    state: startState,
    parent: null,
    g: 0,
    f: manhattanDistance(startState),
  });

  let visited = {};

  while (priorityQueue.length > 0) {
    // Always pick the node with the lowest f score
    priorityQueue.sort(function (a, b) {
      return a.f - b.f;
    });

    let current = priorityQueue.shift();
    let key = boardToString(current.state);

    if (visited[key]) {
      continue;
    }

    visited[key] = true;
    nodesExplored++;

    if (checkIfGoalReached(current.state)) {
      return {
        path: traceSolution(current),
        nodesExplored: nodesExplored,
        timeMs: performance.now() - startTime,
      };
    }

    let moves = identifyLegalMoves(current.state);

    for (i = 0; i < moves.length; i++) {
      let newRow = moves[i][0];
      let newCol = moves[i][1];
      let newState = swapTiles(current.state, newRow, newCol);
      newKey = boardToString(newState);

      if (!visited[newKey]) {
        let g = current.g + 1; // incremntign for move
        let h = manhattanDistance(newState); // checking the est of moves
        priorityQueue.push({
          state: newState,
          parent: current,
          g: g,
          f: g + h,
        });
      }
    }
  }

  return null;
  window.solveBFS = solveBFS;
  window.solveDijkstra = solveDijkstra;
  window.solveAStar = solveAStar;
}
