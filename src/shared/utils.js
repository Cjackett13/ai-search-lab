function updateDashboard({
  moduleName = "N/A",
  algorithm = "N/A",
  decisionTime = 0,
  nodesExplored = 0,
  solutionLength = 0,
  pruningEfficiency = "N/A",
}) {
  const decisionTimeElement = document.getElementById("metricDecisionTime");
  const nodesExploredElement = document.getElementById("metricNodesExplored");
  const solutionLengthElement = document.getElementById("metricSolutionLength");
  const pruningEfficiencyElement = document.getElementById(
    "metricPruningEfficiency",
  );
  const runSummaryElement = document.getElementById("runSummary");

  if (decisionTimeElement) {
    decisionTimeElement.textContent = `${decisionTime} ms`;
  }

  if (nodesExploredElement) {
    nodesExploredElement.textContent = nodesExplored;
  }

  if (solutionLengthElement) {
    solutionLengthElement.textContent = solutionLength;
  }

  if (pruningEfficiencyElement) {
    pruningEfficiencyElement.textContent = pruningEfficiency;
  }

  if (runSummaryElement) {
    runSummaryElement.textContent = `Module: ${moduleName}
Algorithm: ${algorithm}
Decision Time: ${decisionTime} ms
Nodes Explored: ${nodesExplored}
Solution Length: ${solutionLength}
Pruning Efficiency: ${pruningEfficiency}`;
  }
}

window.updateDashboard = updateDashboard;
