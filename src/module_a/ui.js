import { updateDashboard } from "../shared/utils.js";
import { bfs, dijkstra, aStar } from "./solvers.js";

let currentState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let solutionPath = [];
let currentStep = 0;
let tileImages = null;

export function initPuzzleUI() {
  renderBoard(currentState);

  document
    .getElementById("defaultPuzzleBtn")
    .addEventListener("click", useDefaultPuzzle);
  document
    .getElementById("shuffleBtn")
    .addEventListener("click", shufflePuzzle);
  document.getElementById("solveBtn").addEventListener("click", solvePuzzle);
  document.getElementById("stepBtn").addEventListener("click", showNextStep);
  document
    .getElementById("autoPlayBtn")
    .addEventListener("click", autoPlaySolution);
  document
    .getElementById("resetBtn")
    .addEventListener("click", useDefaultPuzzle);
  document
    .getElementById("imageUpload")
    .addEventListener("change", handleImageUpload);
}

function useDefaultPuzzle() {
  currentState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  solutionPath = [];
  currentStep = 0;
  tileImages = null;
  renderBoard(currentState);
  setStatus("Default puzzle loaded.");
}

function shufflePuzzle() {
  currentState = [8, 1, 3, 4, 0, 2, 7, 6, 5];
  solutionPath = [];
  currentStep = 0;
  renderBoard(currentState);
  setStatus("Standard test puzzle loaded.");
}

function renderBoard(state) {
  const board = document.getElementById("puzzleBoard");
  board.innerHTML = "";

  state.forEach((tile, index) => {
    const tileElement = document.createElement("button");
    tileElement.className = tile === 0 ? "tile empty-tile" : "tile";
    tileElement.dataset.index = index;

    if (tile !== 0) {
      if (tileImages && tileImages[tile]) {
        tileElement.style.backgroundImage = `url(${tileImages[tile]})`;
        tileElement.textContent = "";
      } else {
        tileElement.textContent = tile;
      }
    }

    tileElement.addEventListener("click", () => moveTile(index));
    board.appendChild(tileElement);
  });
}

function moveTile(index) {
  const emptyIndex = currentState.indexOf(0);
  const validMoves = getValidMoveIndexes(emptyIndex);

  if (!validMoves.includes(index)) {
    setStatus("Invalid move. Select a tile beside the empty space.");
    return;
  }

  [currentState[index], currentState[emptyIndex]] = [
    currentState[emptyIndex],
    currentState[index],
  ];
  renderBoard(currentState);
  setStatus("Tile moved manually.");
}

function getValidMoveIndexes(emptyIndex) {
  const moves = [];
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;

  if (row > 0) moves.push(emptyIndex - 3);
  if (row < 2) moves.push(emptyIndex + 3);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < 2) moves.push(emptyIndex + 1);

  return moves;
}

function solvePuzzle() {
  const algorithm = document.getElementById("algorithmSelect").value;
  const startTime = performance.now();

  let result;

  if (algorithm === "bfs") {
    result = bfs(currentState);
  } else if (algorithm === "dijkstra") {
    result = dijkstra(currentState);
  } else {
    result = aStar(currentState);
  }

  const endTime = performance.now();
  const decisionTime = Math.round(endTime - startTime);

  solutionPath = result.path || [];
  currentStep = 0;

  updateDashboard({
    moduleName: "8-Puzzle",
    algorithm,
    decisionTime,
    nodesExplored: result.nodesExpanded || 0,
    solutionLength:
      result.solutionLength || Math.max(solutionPath.length - 1, 0),
    pruningEfficiency: "N/A",
  });

  setStatus(
    `Solved with ${algorithm}. Use Next Step or Auto Play to visualize.`,
  );
}

function showNextStep() {
  if (!solutionPath.length) {
    setStatus("No solution path available. Run Solve first.");
    return;
  }

  if (currentStep >= solutionPath.length) {
    setStatus("Solution complete.");
    return;
  }

  currentState = solutionPath[currentStep];
  renderBoard(currentState);
  setStatus(`Showing step ${currentStep} of ${solutionPath.length - 1}.`);
  currentStep++;
}

function autoPlaySolution() {
  if (!solutionPath.length) {
    setStatus("No solution path available. Run Solve first.");
    return;
  }

  currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep >= solutionPath.length) {
      clearInterval(interval);
      setStatus("Auto play complete.");
      return;
    }

    currentState = solutionPath[currentStep];
    renderBoard(currentState);
    currentStep++;
  }, 500);
}

function handleImageUpload(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.includes("image")) {
    setStatus("Please upload a JPG or PNG image.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();

    img.onload = function () {
      cropAndSliceImage(img);
      renderBoard(currentState);
      setStatus("Image uploaded, cropped, and sliced into puzzle tiles.");
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function cropAndSliceImage(img) {
  const size = Math.min(img.width, img.height);
  const startX = (img.width - size) / 2;
  const startY = (img.height - size) / 2;
  const tileSize = size / 3;

  tileImages = {};

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const tileNumber = row * 3 + col + 1;

      if (tileNumber === 9) continue;

      const canvas = document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 150;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        startX + col * tileSize,
        startY + row * tileSize,
        tileSize,
        tileSize,
        0,
        0,
        150,
        150,
      );

      tileImages[tileNumber] = canvas.toDataURL();
    }
  }

  currentState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
}
