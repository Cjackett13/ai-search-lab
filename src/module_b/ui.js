const STEP_DELAY_MS = 600;
const STYLE_ID = "ttt-styles";

// every selector is scoped under #ticTacToeRoot and the variables live on the
// container, not :root, so nothing here leaks into the shared page
const STYLES = `
#ticTacToeRoot {
  --bg: #0f1626;
  --panel: #18203a;
  --line: #2b3a55;
  --accent: #4f9dff;
  --x: #4f9dff;
  --o: #ff7a59;
  --text: #e6ecf7;
  --muted: #93a1bf;
  --win: #34d399;
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
#ticTacToeRoot .ttt { max-width: 520px; }
#ticTacToeRoot .ttt-controls,
#ticTacToeRoot .ttt-metrics,
#ticTacToeRoot .ttt-benchmark {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}
#ticTacToeRoot .ttt-tabs { display: flex; gap: 8px; margin-bottom: 14px; }
#ticTacToeRoot .ttt-tab {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
#ticTacToeRoot .ttt-tab.is-active { background: var(--accent); border-color: var(--accent); color: #fff; }
#ticTacToeRoot .ttt-panel { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; }
#ticTacToeRoot .ttt-panel.is-hidden { display: none; }
#ticTacToeRoot label { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: var(--muted); }
#ticTacToeRoot select,
#ticTacToeRoot button {
  font-size: 0.9rem;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--line);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
}
#ticTacToeRoot button { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; }
#ticTacToeRoot button:disabled { opacity: 0.5; cursor: not-allowed; }
#ticTacToeRoot .ttt-status { text-align: center; padding: 10px; margin-bottom: 16px; font-weight: 600; min-height: 1.2em; }
#ticTacToeRoot .ttt-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
#ticTacToeRoot .ttt-cell {
  aspect-ratio: 1;
  font-size: 2.6rem;
  font-weight: 700;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
}
#ticTacToeRoot .ttt-cell[data-player="X"] { color: var(--x); }
#ticTacToeRoot .ttt-cell[data-player="O"] { color: var(--o); }
#ticTacToeRoot .ttt-cell.is-win { border-color: var(--win); box-shadow: 0 0 0 2px var(--win) inset; }
#ticTacToeRoot .ttt-cell.is-last { border-color: var(--accent); }
#ticTacToeRoot .ttt-metrics table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
#ticTacToeRoot .ttt-metrics td { padding: 6px 4px; border-bottom: 1px solid var(--line); }
#ticTacToeRoot .ttt-metrics td:first-child { color: var(--muted); }
#ticTacToeRoot .ttt-metrics td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
#ticTacToeRoot h3 { font-size: 1rem; margin: 0 0 10px; }
#ticTacToeRoot pre {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 12px;
  overflow-x: auto;
  font-size: 0.8rem;
  white-space: pre-wrap;
  margin: 10px 0 0;
}
`;

const MARKUP = `
<div class="ttt">
  <div class="ttt-controls">
    <div class="ttt-tabs">
      <button class="ttt-tab is-active" data-mode="human">Human vs AI</button>
      <button class="ttt-tab" data-mode="ai">AI vs AI</button>
    </div>

    <div class="ttt-panel" data-panel="human">
      <label>Algorithm
        <select data-field="human-algorithm">
          <option value="minimax">Minimax</option>
          <option value="alphabeta">Alpha-Beta</option>
        </select>
      </label>
      <label>You play
        <select data-field="human-order">
          <option value="first">First (X)</option>
          <option value="second">Second (O)</option>
        </select>
      </label>
      <button data-action="human-start">New Game</button>
    </div>

    <div class="ttt-panel is-hidden" data-panel="ai">
      <label>X uses
        <select data-field="ai-x-algorithm">
          <option value="minimax">Minimax</option>
          <option value="alphabeta">Alpha-Beta</option>
        </select>
      </label>
      <label>O uses
        <select data-field="ai-o-algorithm">
          <option value="alphabeta">Alpha-Beta</option>
          <option value="minimax">Minimax</option>
        </select>
      </label>
      <button data-action="ai-start">Auto-Play</button>
    </div>
  </div>

  <div class="ttt-status" data-role="status">Pick a mode and start a game.</div>

  <div class="ttt-board" data-role="board">
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8]
      .map((i) => `<button class="ttt-cell" data-index="${i}"></button>`)
      .join("")}
  </div>

  <div class="ttt-metrics">
    <h3>Last AI Decision</h3>
    <table>
      <tbody>
        <tr><td>Algorithm</td><td data-metric="algorithm">—</td></tr>
        <tr><td>Move (cell)</td><td data-metric="move">—</td></tr>
        <tr><td>Decision time</td><td data-metric="time">—</td></tr>
        <tr><td>Nodes explored</td><td data-metric="nodes">—</td></tr>
        <tr><td>Pruning efficiency</td><td data-metric="pruning">—</td></tr>
      </tbody>
    </table>
  </div>

  <div class="ttt-benchmark">
    <h3>Standardized Position</h3>
    <p>Empty board, AI first as X — first move only.</p>
    <button data-action="benchmark">Run Minimax vs Alpha-Beta</button>
    <pre data-role="benchmark">—</pre>
  </div>
</div>
`;

function injectStyles() {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function algorithmLabel(algorithm) {
  return algorithm === "alphabeta" ? "Alpha-Beta" : "Minimax";
}

function initTicTacToeUI(root = document.getElementById("ticTacToeRoot")) {
  if (!root) {
    return;
  }

  injectStyles();
  root.innerHTML = MARKUP;

  const q = (selector) => root.querySelector(selector);
  const cellEls = Array.from(root.querySelectorAll(".ttt-cell"));
  const statusEl = q('[data-role="status"]');
  const benchmarkEl = q('[data-role="benchmark"]');

  const metricEls = {
    algorithm: q('[data-metric="algorithm"]'),
    move: q('[data-metric="move"]'),
    time: q('[data-metric="time"]'),
    nodes: q('[data-metric="nodes"]'),
    pruning: q('[data-metric="pruning"]'),
  };

  const state = {
    mode: "human",
    board: window.emptyBoard(),
    aiPlayer: "O",
    humanPlayer: "X",
    algorithm: "minimax",
    algorithms: { X: "minimax", O: "alphabeta" },
    current: "X",
    lastMove: -1,
    over: true,
    busy: false,
  };

  function render(lastMove, winLine) {
    cellEls.forEach((cell, i) => {
      const player = state.board[i];
      cell.textContent = player;
      cell.dataset.player = player;
      cell.classList.toggle("is-last", i === lastMove);
      cell.classList.toggle("is-win", !!winLine && winLine.includes(i));
    });
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function reportDecision(result, algorithm) {
    metricEls.algorithm.textContent = algorithmLabel(algorithm);
    metricEls.move.textContent = result.bestMove;
    metricEls.time.textContent = result.decisionTimeMs.toFixed(2) + " ms";
    metricEls.nodes.textContent = result.nodesExplored.toLocaleString();
    metricEls.pruning.textContent = result.pruningEfficiency;

    if (
      document.getElementById("metricDecisionTime") &&
      typeof window.updateDashboard === "function"
    ) {
      window.updateDashboard({
        moduleName: "Tic-Tac-Toe",
        algorithm: algorithmLabel(algorithm),
        decisionTime: Math.round(result.decisionTimeMs),
        nodesExplored: result.nodesExplored,
        solutionLength: "N/A",
        pruningEfficiency: result.pruningEfficiency,
      });
    }
  }

  function outcomeText() {
    if (window.isWinner(state.board, "X")) {
      return "X wins!";
    }

    if (window.isWinner(state.board, "O")) {
      return "O wins!";
    }

    return "It's a draw.";
  }

  function finish() {
    state.over = true;
    const line =
      window.winningLine(state.board, "X") ||
      window.winningLine(state.board, "O");

    render(state.lastMove, line);
    setStatus(outcomeText());
  }

  function aiTurn(player, algorithm, onDone) {
    state.busy = true;
    setStatus(algorithmLabel(algorithm) + " (" + player + ") is thinking…");

    setTimeout(() => {
      const result = window.findBestMove(state.board, algorithm, player);
      state.board = window.makeMove(state.board, result.bestMove, player);
      state.lastMove = result.bestMove;

      reportDecision(result, algorithm);
      render(state.lastMove, null);

      state.busy = false;
      onDone();
    }, STEP_DELAY_MS);
  }

  function startHumanGame() {
    state.mode = "human";
    state.board = window.emptyBoard();
    state.humanPlayer =
      q('[data-field="human-order"]').value === "first" ? "X" : "O";
    state.aiPlayer = window.opponentOf(state.humanPlayer);
    state.algorithm = q('[data-field="human-algorithm"]').value;
    state.current = "X";
    state.over = false;
    state.lastMove = -1;

    render(-1, null);
    setStatus("Your move (" + state.humanPlayer + ").");

    if (state.aiPlayer === "X") {
      advanceHuman();
    }
  }

  function advanceHuman() {
    if (window.isTerminal(state.board, "X", "O")) {
      finish();
      return;
    }

    if (state.current === state.aiPlayer) {
      aiTurn(state.aiPlayer, state.algorithm, () => {
        state.current = state.humanPlayer;

        if (window.isTerminal(state.board, "X", "O")) {
          finish();
        } else {
          setStatus("Your move (" + state.humanPlayer + ").");
        }
      });
    } else {
      setStatus("Your move (" + state.humanPlayer + ").");
    }
  }

  function onCellClick(event) {
    if (state.mode !== "human" || state.over || state.busy) {
      return;
    }

    if (state.current !== state.humanPlayer) {
      return;
    }

    const index = Number(event.currentTarget.dataset.index);

    if (state.board[index] !== "") {
      return;
    }

    state.board = window.makeMove(state.board, index, state.humanPlayer);
    state.lastMove = index;
    render(index, null);
    state.current = state.aiPlayer;
    advanceHuman();
  }

  function startAiGame() {
    state.mode = "ai";
    state.board = window.emptyBoard();
    state.current = "X";
    state.over = false;
    state.lastMove = -1;
    state.algorithms = {
      X: q('[data-field="ai-x-algorithm"]').value,
      O: q('[data-field="ai-o-algorithm"]').value,
    };

    render(-1, null);
    stepAiGame();
  }

  function stepAiGame() {
    if (window.isTerminal(state.board, "X", "O")) {
      finish();
      return;
    }

    const player = state.current;

    aiTurn(player, state.algorithms[player], () => {
      state.current = window.opponentOf(player);
      stepAiGame();
    });
  }

  function runBenchmark() {
    const result = window.compareAlgorithms(window.emptyBoard(), "X");

    benchmarkEl.textContent = [
      "Empty board, AI first as X — first move only",
      "",
      "Minimax    move=" +
        result.minimax.bestMove +
        "  nodes=" +
        result.minimax.nodesExplored.toLocaleString(),
      "Alpha-Beta move=" +
        result.alphabeta.bestMove +
        "  nodes=" +
        result.alphabeta.nodesExplored.toLocaleString(),
      "",
      "Same move?  " + (result.agree ? "YES" : "NO"),
      "Pruning:    " + result.percentPruned.toFixed(1) + "% fewer nodes",
    ].join("\n");
  }

  function selectMode(mode) {
    state.mode = mode;
    state.over = true;

    root.querySelectorAll(".ttt-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.mode === mode);
    });

    root.querySelectorAll(".ttt-panel").forEach((panel) => {
      panel.classList.toggle("is-hidden", panel.dataset.panel !== mode);
    });

    state.board = window.emptyBoard();
    render(-1, null);
    setStatus(
      mode === "human"
        ? "Start a Human vs AI game."
        : "Start an AI vs AI game.",
    );
  }

  cellEls.forEach((cell) => cell.addEventListener("click", onCellClick));

  root.querySelectorAll(".ttt-tab").forEach((tab) => {
    tab.addEventListener("click", () => selectMode(tab.dataset.mode));
  });

  q('[data-action="human-start"]').addEventListener("click", startHumanGame);
  q('[data-action="ai-start"]').addEventListener("click", startAiGame);
  q('[data-action="benchmark"]').addEventListener("click", runBenchmark);

  selectMode("human");
}

window.initTicTacToeUI = initTicTacToeUI;
