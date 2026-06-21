import { initPuzzleUI } from "../module_a/ui.js";

function initTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      buttons.forEach((btn) => btn.classList.remove("active"));
      panels.forEach((panel) => panel.classList.remove("active"));

      button.classList.add("active");

      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add("active");
      }
    });
  });
}

async function initModuleB() {
  const root = document.getElementById("ticTacToeRoot");

  if (!root) {
    return;
  }

  try {
    const moduleB = await import("../module_b/ui.js");

    if (typeof moduleB.initTicTacToeUI === "function") {
      moduleB.initTicTacToeUI();
    } else {
      console.error("initTicTacToeUI was not exported from src/module_b/ui.js");
      root.innerHTML =
        "<p>Tic-Tac-Toe UI could not load because initTicTacToeUI was not exported.</p>";
    }
  } catch (error) {
    console.error("Module B failed to load:", error);
    root.innerHTML =
      "<p>Tic-Tac-Toe UI could not load. Check the browser console for the exact error.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  if (document.getElementById("puzzleBoard")) {
    initPuzzleUI();
  }

  initModuleB();
});
