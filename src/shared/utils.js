export function updateDashboard({
  moduleName = "N/A",
  algorithm = "N/A",
  decisionTime = 0,
  nodesExplored = 0,
  solutionLength = 0,
  pruningEfficiency = "N/A",
}) {
  document.getElementById("metricDecisionTime").textContent =
    `${decisionTime} ms`;
  document.getElementById("metricNodesExplored").textContent = nodesExplored;
  document.getElementById("metricSolutionLength").textContent = solutionLength;
  document.getElementById("metricPruningEfficiency").textContent =
    pruningEfficiency;

  document.getElementById("runSummary").textContent = `Module: ${moduleName}
Algorithm: ${algorithm}
Decision Time: ${decisionTime} ms
Nodes Explored: ${nodesExplored}
Solution Length: ${solutionLength}
Pruning Efficiency: ${pruningEfficiency}`;
}
