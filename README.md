<img width="744" height="522" alt="881b9b7d-6f79-4322-b296-e1f3bd72259e" src="https://github.com/user-attachments/assets/0a9242d0-e7e8-4dca-b0e5-c783c168b1a5" />
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

We used Manhatten Distance as out A* heuristic. Manhatten Distance is always counting best case scenario  / minimum number of moves for the tile to reach its goal. Since the tiles could block other tiles there is room for error so it would increase the number of moves required, but never decrease the number of moves. This shows that Manhatten Distance doesn't over estimate but in fact underestimate the number of steps which makes it admissible and allowing A* to always return the optimal solution 

## Comparative Analysis Report

### Prompt 1 - Structural Comparison

The 8 puzzle and Tic tac Toe are similar because we can represent both as a search space where each state leads to another state by valid moves, and in both the algorithm explores different possibilities before deciding on the best action.

The biggest difference is in the 8 puzzle game we use a single agent search meaning we control every move and are simply trying to find a path from the starting state to the goal state. 

The Tic tac Toe game we use adversarial search  because we are activly playing against another player who is trying to stop us from winning. Instead of simply trying to finding one path to a goal we / the AI has to consider all possible opponent responses and choose a move that gives the best outcome no matter what the opponent may do.

### Prompt 2 - Algorithm Fit

The A* search works well for the 8 puzzle because there is a clear goal state and the Manhattan Distance gives an estimate of how far a state is from the goal allowing A* to focus on the most promising states first while still guaranteeing the optimal solution.

But Minimax wouldnt any sense for the 8 puzzle because there is no opponent and the puzzle would only have one player making decisions meaning we would have nothing to minimize against. Samething with A* not being a good fit for Tic tac Tor because there is no real distance to measure in the way to win. The result would depend on what the opponent does which is why Minimax and Alpha Beta Pruning are the better choices.

### Prompt 3 - Empirical Comparison: Module A

| Algorithm | Nodes Explored | Solution Length | Time (ms) |
|-----------|---------------|-----------------|-----------|
| BFS | 5,961 | 14 moves | 17 |
| Dijkstra | 5,961 | 14 moves | 202 |
| A* | 77 | 14 moves | 2 |


- BFS and Dijkstra explored the exact same number of nodes which shows that Dijksta priority search doesnt really make a diffrence in this case since all moves cost the same.
<img width="919" height="668" alt="image" src="https://github.com/user-attachments/assets/a61ab990-a434-4d78-b02b-bc8cc8dabf9d" />

<img width="917" height="673" alt="image" src="https://github.com/user-attachments/assets/dfba63a9-e37b-4e4e-9959-e6413b667b0c" />


What does this tell you about the value of heuristic information?
  
- A* explored 98.7% fewer nodes than BFS while still finding the exact same 14-move solution.
  This shows that the Manhatten Distance heuristic doesn't sacrifice results, and it just avoids wasted exploration.
  <img width="919" height="668" alt="image" src="https://github.com/user-attachments/assets/14730b12-b8af-44c4-8338-8a6ab7ba25f2" />

Something that surprised us was just how fast A* with heuristic really is. It beat out the other searched by a huge margin and it isnt the most complex thing to add.

### Prompt 4 - Empirical Comparison: Module B

| Algorithm | Nodes Explored |
|-----------|---------------|
| Minimax   | 549,945 |
| Alpha-Beta | 34,202 |

Pruning rate: ([549,945] - [34,202]) / [Minimax nodes] × 100 = [X]%

INSIGHT: 1-2 sentences on what the pruning rate means in practice.

<img width="368" height="927" alt="image" src="https://github.com/user-attachments/assets/d897f726-3835-4ead-9b76-e83478d55f1f" />



Prompt 5 - Trade-off Analysis

| | BFS | Dijkstra | A* | Minimax | Alpha-Beta |
|--|-----|----------|----|---------|------------|
| **Complete?** | Yes | Yes | Yes | Yes | Yes |
| **Optimal?** | Yes (unit cost) | Yes | Yes (admissible heuristic) | Yes | Yes |
| **Time complexity** | Exponential — explores all states at each depth | Same as BFS on unit costs, sorting adds overhead | Much better in practice — heuristic skips large portions of the tree | Exponential — full game tree | Better than Minimax — pruning eliminates branches that can't affect the result |
| **Space complexity** | High — stores all visited states and full frontier | High — same as BFS, also stores costs | Lower than BFS — smaller frontier due to heuristic guidance | High — must store full path from root to current node | Same as Minimax in worst case, better in practice |
