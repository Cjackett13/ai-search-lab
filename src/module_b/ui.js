(function () {
  const logic = window.ModuleB;
  const STEP_DELAY_MS = 600;

  const boardEl = document.getElementById('board');
  const cellEls = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');

  const metricEls = {
    algorithm: document.getElementById('m-algorithm'),
    move: document.getElementById('m-move'),
    time: document.getElementById('m-time'),
    nodes: document.getElementById('m-nodes'),
    pruning: document.getElementById('m-pruning'),
  };

  const humanPanel = document.getElementById('human-panel');
  const aiPanel = document.getElementById('ai-panel');

  const state = {
    mode: 'human',
    board: logic.emptyBoard(),
    aiPlayer: 'O',
    humanPlayer: 'X',
    current: 'X',
    over: true,
    busy: false,
  };

  function algorithmLabel(algorithm) {
    return algorithm === 'alphabeta' ? 'Alpha-Beta' : 'Minimax';
  }

  //redraw the whole board on the screen
  function render(lastMove, winLine) {
    cellEls.forEach((cell, i) => {
      const player = state.board[i];
      cell.textContent = player;
      cell.dataset.player = player;
      cell.classList.toggle('last', i === lastMove);
      cell.classList.toggle('win', !!winLine && winLine.includes(i));
    });
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  // dump the numbers into the metrics panel
  function showMetrics(result, pruningText) {
    metricEls.algorithm.textContent = algorithmLabel(result.algorithm);
    metricEls.move.textContent = result.move;
    metricEls.time.textContent = result.timeMs.toFixed(2) + ' ms';
    metricEls.nodes.textContent = result.nodes.toLocaleString();
    metricEls.pruning.textContent = pruningText;
  }

  function reportDecision(result, player) {
    let pruningText = 'n/a (Minimax)';
    if (result.algorithm === 'alphabeta') {
      const baseline = logic.findBestMove(state.boardBeforeMove, 'minimax', player);
      const percent = baseline.nodes === 0 ? 0 : ((baseline.nodes - result.nodes) / baseline.nodes) * 100;
      pruningText = percent.toFixed(1) + '% (' + result.nodes.toLocaleString()
        + ' vs ' + baseline.nodes.toLocaleString() + ')';
    }
    showMetrics(result, pruningText);
  }

  function outcomeText() {
    if (logic.isWinner(state.board, 'X')) return 'X wins!';
    if (logic.isWinner(state.board, 'O')) return 'O wins!';
    return "It's a draw.";
  }

  function finish() {
    state.over = true;
    const line = logic.winningLine(state.board, 'X') || logic.winningLine(state.board, 'O');
    render(state.lastMove, line);
    setStatus(outcomeText());
  }

  // let the ai think for a sec then drop its move
  function aiTurn(player, algorithm, onDone) {
    state.busy = true;
    state.boardBeforeMove = state.board;
    setStatus(algorithmLabel(algorithm) + ' (' + player + ') is thinking…');

    setTimeout(() => {
      const result = logic.findBestMove(state.board, algorithm, player);
      state.board = logic.makeMove(state.board, result.move, player);
      state.lastMove = result.move;
      reportDecision(result, player);
      render(state.lastMove, null);
      state.busy = false;
      onDone();
    }, STEP_DELAY_MS);
  }

  // human vs ai stuff

  //starts a fresh human vs ai game
  function startHumanGame() {
    const algorithm = document.getElementById('human-algorithm').value;
    const order = document.getElementById('human-order').value;

    state.mode = 'human';
    state.board = logic.emptyBoard();
    state.humanPlayer = order === 'first' ? 'X' : 'O';
    state.aiPlayer = logic.opponentOf(state.humanPlayer);
    state.algorithm = algorithm;
    state.current = 'X';
    state.over = false;
    state.lastMove = -1;
    render(-1, null);
    setStatus('Your move (' + state.humanPlayer + ').');

    if (state.aiPlayer === 'X') {
      advanceHuman();
    }
  }

  function advanceHuman() {
    if (logic.isTerminal(state.board, 'X', 'O')) {
      finish();
      return;
    }
    if (state.current === state.aiPlayer) {
      aiTurn(state.aiPlayer, state.algorithm, () => {
        state.current = state.humanPlayer;
        if (logic.isTerminal(state.board, 'X', 'O')) {
          finish();
        } else {
          setStatus('Your move (' + state.humanPlayer + ').');
        }
      });
    } else {
      setStatus('Your move (' + state.humanPlayer + ').');
    }
  }

  // player clicked a square
  function onCellClick(event) {
    if (state.mode !== 'human' || state.over || state.busy) return;
    if (state.current !== state.humanPlayer) return;

    const index = Number(event.currentTarget.dataset.index);
    if (state.board[index] !== '') return;

    state.board = logic.makeMove(state.board, index, state.humanPlayer);
    state.lastMove = index;
    render(index, null);
    state.current = state.aiPlayer;
    advanceHuman();
  }

  // ai vs ai

  //starts a fresh ai vs ai game
  function startAiGame() {
    state.mode = 'ai';
    state.board = logic.emptyBoard();
    state.current = 'X';
    state.over = false;
    state.lastMove = -1;
    state.algorithms = {
      X: document.getElementById('ai-x-algorithm').value,
      O: document.getElementById('ai-o-algorithm').value,
    };
    render(-1, null);
    stepAiGame();
  }

  function stepAiGame() {
    if (logic.isTerminal(state.board, 'X', 'O')) {
      finish();
      return;
    }
    const player = state.current;
    aiTurn(player, state.algorithms[player], () => {
      state.current = logic.opponentOf(player);
      stepAiGame();
    });
  }

  //standard empty board test for report

  function runBenchmark() {
    const result = logic.pruningEfficiency(logic.emptyBoard(), 'X');
    const lines = [
      'Empty board, AI first as X — first move only',
      '',
      'Minimax    move=' + result.minimax.move + '  nodes=' + result.minimax.nodes.toLocaleString(),
      'Alpha-Beta move=' + result.alphabeta.move + '  nodes=' + result.alphabeta.nodes.toLocaleString(),
      '',
      'Same move?  ' + (result.agree ? 'YES' : 'NO'),
      'Pruning:    ' + result.percentPruned.toFixed(1) + '% fewer nodes',
    ];
    document.getElementById('benchmark-output').textContent = lines.join('\n');
  }

  //hook everything up

  function selectMode(mode) {
    state.mode = mode;
    state.over = true;
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    humanPanel.classList.toggle('hidden', mode !== 'human');
    aiPanel.classList.toggle('hidden', mode !== 'ai');
    state.board = logic.emptyBoard();
    render(-1, null);
    setStatus(mode === 'human' ? 'Start a Human vs AI game.' : 'Start an AI vs AI game.');
  }

  cellEls.forEach(cell => cell.addEventListener('click', onCellClick));
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => selectMode(tab.dataset.mode));
  });
  document.getElementById('human-start').addEventListener('click', startHumanGame);
  document.getElementById('ai-start').addEventListener('click', startAiGame);
  document.getElementById('run-benchmark').addEventListener('click', runBenchmark);

  selectMode('human');
})();
