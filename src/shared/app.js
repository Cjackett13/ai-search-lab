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

document.addEventListener("DOMContentLoaded", () => {
  initTabs();

  if (
    document.getElementById("puzzleBoard") &&
    typeof window.initPuzzleUI === "function"
  ) {
    window.initPuzzleUI();
  }

  if (
    document.getElementById("ticTacToeRoot") &&
    typeof window.initTicTacToeUI === "function"
  ) {
    window.initTicTacToeUI();
  }
});
