AI Search Lab — 8-Puzzle Solver & Tic-Tac-Toe with AI

## Overview



##### ai-search-lab is a app that demonstates two search categories:

  - single-agent search (Module A) & adversarial search (Module B)

Module A implements BFS, Dijkstra, and A* to solve the classic sliding-tile puzzle.
Module B implements Minimax and Alpha-Beta Pruning for an unbeatable Tic-Tac-Toe AI.


Work was broken down into the following: 
Julian - Module A
Christie - Module B
Ealien - UI & Integration

Built by Julian Sanchez, Christie Jackett, and Myckheal Hosang for CAI4002 RVCC 1265 | Summer C.



## How to Run


Open index.html in any  browser — no installation or setup required acts as Single entry point


## Algorithms Implemented

#### Module A - 8-Puzzle Solver
- BFS - Explores states level by level
- Dijkstra - Cost-based priority search
- A* - Informed search using Manhattan Distance

#### Module B - Tic-Tac-Toe AI
- Minimax - Explores the full game tree to find the optimal move
- Alpha-Beta Pruning - Minimax with branch pruning to skip provably irrelevant nodes


## Heuristic Justification

<!-- 
WHAT TO WRITE: 2-3 sentences explaining why Manhattan Distance never overestimates.
You are NOT proving it makes things faster (the numbers do that). You are explaining
why A* is still guaranteed to find the optimal solution when using this heuristic.
-->

## Comparative Analysis Report

Prompt 1 - Structural Comparison

<!-- 
WHAT TO WRITE (~100 words): How is the 8-puzzle search space similar to and different 
from the Tic-Tac-Toe game tree?

Key points to hit:
- Similar: both are state spaces where you move from one state to another by applying an action
- Different: in the 8-puzzle, YOU control every move (single agent). In Tic-Tac-Toe, 
  an OPPONENT controls alternating moves — you can't just plan a path, you have to 
  plan responses to what they might do.
- Different: "solving" the 8-puzzle means finding a path to a fixed goal. 
  "Solving" Tic-Tac-Toe means finding a strategy that handles every possible opponent response.
-->

Prompt 2 - Algorithm Fit

<!-- 
WHAT TO WRITE (~100 words): Why is A* good for the 8-puzzle but not Tic-Tac-Toe?
Why doesn't Minimax apply to the 8-puzzle?

Key points to hit:
- A* needs a heuristic — a way to estimate distance to the goal. The 8-puzzle has a 
  clear, measurable goal state so Manhattan Distance works perfectly. Tic-Tac-Toe has 
  no fixed "distance to goal" — the outcome depends entirely on what the opponent does, 
  so there's nothing meaningful to estimate.
- Minimax needs two players taking turns. The 8-puzzle only has one player — there's 
  no opponent, no minimizing player, nothing to minimax against.
-->

Prompt 3 - Empirical Comparison: Module A

<!-- 
WHAT TO WRITE: Report your actual numbers from the standardized test puzzle.
Paste the table below and fill in the numbers. Then write 2-3 sentences of insight.

Test puzzle: [[8,1,3],[4,0,2],[7,6,5]] → goal [[1,2,3],[4,5,6],[7,8,0]]
-->

| Algorithm | Nodes Explored | Solution Length | Time (ms) |
|-----------|---------------|-----------------|-----------|
| BFS | 5,961 | 14 moves | 23 |
| Dijkstra | 5,961 | 14 moves | 203 |
| A* | 77 | 14 moves | 2 |

<!-- 
INSIGHT TO ADD (2-3 sentences): Don't just restate the numbers. Say something about what
they mean. Good observations to make:
- BFS and Dijkstra explored the exact same number of nodes — this shows that Dijkstra 
  adds no benefit over BFS when all move costs are equal (unit cost).
- A* explored 98.7% fewer nodes than BFS while still finding the exact same 14-move solution.
  This shows that a good heuristic doesn't sacrifice optimality — it just avoids wasted exploration.
- Something that surprised you? (e.g. you expected Dijkstra to do better than BFS)

SCREENSHOT: Insert a screenshot of your performance dashboard showing these numbers here.
The grader will not give credit for this section without screenshot evidence.
[INSERT SCREENSHOT]
-->

Prompt 4 - Empirical Comparison: Module B

<!-- 
WHAT TO WRITE: Report Minimax vs Alpha-Beta node counts on empty board, AI first as X.
Person 2 needs to provide these numbers from their benchmark tool in Module B.

| Algorithm | Nodes Explored |
|-----------|---------------|
| Minimax   | [NUMBER FROM PERSON 2] |
| Alpha-Beta | [NUMBER FROM PERSON 2] |

Pruning rate: ([Minimax nodes] - [Alpha-Beta nodes]) / [Minimax nodes] × 100 = [X]%

INSIGHT: 1-2 sentences on what the pruning rate means in practice.

SCREENSHOT: Insert screenshot of Module B benchmark output here.
[INSERT SCREENSHOT]
-->

Prompt 5 - Trade-off Analysis

| | BFS | Dijkstra | A* | Minimax | Alpha-Beta |
|--|-----|----------|----|---------|------------|
| **Complete?** | Yes | Yes | Yes | Yes | Yes |
| **Optimal?** | Yes (unit cost) | Yes | Yes (admissible heuristic) | Yes | Yes |
| **Time complexity** | Exponential — explores all states at each depth | Same as BFS on unit costs, sorting adds overhead | Much better in practice — heuristic skips large portions of the tree | Exponential — full game tree | Better than Minimax — pruning eliminates branches that can't affect the result |
| **Space complexity** | High — stores all visited states and full frontier | High — same as BFS, also stores costs | Lower than BFS — smaller frontier due to heuristic guidance | High — must store full path from root to current node | Same as Minimax in worst case, better in practice |
