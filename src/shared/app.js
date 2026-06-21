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
      document.getElementById(target).classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initPuzzleUI();
});
