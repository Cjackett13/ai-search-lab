


// mechanism of actualyl finding  solutions 

function manhattanDistance(state) {

    // Where each tile number SHOULD be in the goal state
    goalRow = { 1:0, 2:0, 3:0, 4:1, 5:1, 6:1, 7:2, 8:2, 0:2 };
    goalCol = { 1:0, 2:1, 3:2, 4:0, 5:1, 6:2, 7:0, 8:1, 0:2 };

    total = 0;

    for (row = 0; row < 3; row++) {
        for (col = 0; col < 3; col++) {
            tile = state[row][col];

            if (tile !== 0) {
                // How far is this tile from where it belongs?
                rowDistance = Math.abs(row - goalRow[tile]);
                colDistance = Math.abs(col - goalCol[tile]);
                total = total + rowDistance + colDistance;
            }
        }
    }

    return total;
}

//B BFS 
function solveBFS(startState) {
     startTime = performance.now(); // start timer 
     nodesExplored = 0;

    //the node we came from (so we can trace back the path)
    queue = [];
    queue.push({ state: startState, parent: null });

    // visited to keepa track of states we already saw so we don't explore the same board twice
    visited = new Set();
    visited.add(boardToString(startState));

    while (queue.length > 0) {

        // Take from the fornt of the queue (old state first)
         current = queue.shift();
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
        moves = identifyLegalMoves(current.state);

        for ( i = 0; i < moves.length; i++) {
            newRow   = moves[i][0];
            newCol   = moves[i][1];
            newState = swapTiles(current.state, newRow, newCol);
            key      = boardToString(newState);

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
    startTime     = performance.now();
    nodesExplored = 0;

    // storuing cost
    priorityQueue = [];
    priorityQueue.push({ state: startState, parent: null, cost: 0 });

    visited = {};

    while (priorityQueue.length > 0) {

        // Sortso the cheapest node is first
        priorityQueue.sort(function(a, b) {
            return a.cost - b.cost;
        });

        current = priorityQueue.shift();
        key     = boardToString(current.state);

        // Skip if we already processed this state
        if (visited[key]) {
            continue;
        }

        visited[key] = true;
        nodesExplored++;

        if (checkIfGoalReached(current.state)) {
            return {
                path:          traceSolution(current),
                nodesExplored: nodesExplored,
                timeMs:        performance.now() - startTime,
            };
        }

        moves = identifyLegalMoves(current.state);

        for (i = 0; i < moves.length; i++) {
            newRow   = moves[i][0];
            newCol   = moves[i][1];
            newState = swapTiles(current.state, newRow, newCol);
            newKey   = boardToString(newState);

            if (!visited[newKey]) {
                priorityQueue.push({
                    state:  newState,
                    parent: current,
                    cost:   current.cost + 1,  // incremnt for each move
                });
            }
        }
    }

    return null;
}
// astar 
function solveAStar(startState) {
    startTime     = performance.now();
    nodesExplored = 0;

    priorityQueue = [];
    priorityQueue.push({
        state:  startState,
        parent: null,
        g: 0,                                 
        f: manhattanDistance(startState),     
    });

    visited = {};

    while (priorityQueue.length > 0) {

        // Always pick the node with the lowest f score
        priorityQueue.sort(function(a, b) {
            return a.f - b.f;
        });

        current = priorityQueue.shift();
        key     = boardToString(current.state);

        if (visited[key]) {
            continue;
        }

        visited[key] = true;
        nodesExplored++;

        if (checkIfGoalReached(current.state)) {
            return {
                path:          traceSolution(current),
                nodesExplored: nodesExplored,
                timeMs:        performance.now() - startTime,
            };
        }

        moves = identifyLegalMoves(current.state);

        for (i = 0; i < moves.length; i++) {
            newRow   = moves[i][0];
            newCol   = moves[i][1];
            newState = swapTiles(current.state, newRow, newCol);
            newKey   = boardToString(newState);

            if (!visited[newKey]) {
                g = current.g + 1;               // incremntign for move
                h = manhattanDistance(newState);  // checking the est of moves 
                priorityQueue.push({
                    state:  newState,
                    parent: current,
                    g:      g,
                    f:      g + h,
                });
            }
        }
    }

    return null;
}