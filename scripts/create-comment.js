function addIndicator(latestValue, previousValue) {
  if (latestValue > previousValue) {
    return "&#8593;";
  } else if (latestValue < previousValue) {
    return "&#8595;";
  }
  return "";
}

export async function createComment({
  github,
  context,
  latestMarkdownContent,
  previousMarkdownContent,
}) {
  console.log("previousMarkdownContent: ", previousMarkdownContent);
  let markdown = "# Code Coverage Report\n\n";

  markdown += `### Total \n`;

  markdown += "| Statements | Branches | Functions | Lines |";
  markdown += "\n";
  markdown += "| :--------: | :------: | :-------: | :---: |";
  markdown += "\n";

  const latestFileCoverage = latestMarkdownContent["total"];

  if (previousMarkdownContent) {
    const previousFileCoverage = previousMarkdownContent["total"];

    const latestStatementsParameters = latestFileCoverage["statements"];
    const previousStatementsParameters = previousFileCoverage["statements"];

    if (
      typeof latestStatementsParameters === "object" &&
      typeof previousStatementsParameters === "object"
    ) {
      markdown += `| **${
        latestStatementsParameters.pct
      }%** &nbsp;${addIndicator(
        latestStatementsParameters.pct,
        previousStatementsParameters.pct
      )} \`${latestStatementsParameters.covered}/${
        latestStatementsParameters.total - latestStatementsParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const latestBranchesParameters = latestFileCoverage["branches"];
    const previousBranchesParameters = previousFileCoverage["branches"];

    if (
      typeof latestBranchesParameters === "object" &&
      typeof previousBranchesParameters === "object"
    ) {
      markdown += `| **${latestBranchesParameters.pct}%** &nbsp;${addIndicator(
        latestBranchesParameters.pct,
        previousBranchesParameters.pct
      )} \`${latestBranchesParameters.covered}/${
        latestBranchesParameters.total - latestBranchesParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const latestFunctionsParameters = latestFileCoverage["functions"];
    const previousFunctionsParameters = previousFileCoverage["functions"];

    if (
      typeof latestFunctionsParameters === "object" &&
      typeof previousFunctionsParameters === "object"
    ) {
      markdown += `| **${latestFunctionsParameters.pct}%** &nbsp;${addIndicator(
        latestFunctionsParameters.pct,
        previousFunctionsParameters.pct
      )} \`${latestFunctionsParameters.covered}/${
        latestFunctionsParameters.total - latestFunctionsParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const latestLinesParameters = latestFileCoverage["lines"];
    const previousLinesParameters = previousFileCoverage["lines"];

    if (
      typeof latestLinesParameters === "object" &&
      typeof previousLinesParameters === "object"
    ) {
      markdown += `| **${latestLinesParameters.pct}%** &nbsp;${addIndicator(
        latestLinesParameters.pct,
        previousLinesParameters.pct
      )} \`${latestLinesParameters.covered}/${
        latestLinesParameters.total - latestLinesParameters.skipped
      }\`&nbsp;&nbsp; `;
    }
  } else {
    const statementsParameters = latestFileCoverage["statements"];

    if (typeof statementsParameters === "object") {
      markdown += `| **${statementsParameters.pct}%** &nbsp; \`${
        statementsParameters.covered
      }/${
        statementsParameters.total - statementsParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const branchesParameters = latestFileCoverage["branches"];
    if (typeof branchesParameters === "object") {
      markdown += `| **${branchesParameters.pct}%** &nbsp; \`${
        branchesParameters.covered
      }/${
        branchesParameters.total - branchesParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const functionsParameters = latestFileCoverage["functions"];
    if (typeof functionsParameters === "object") {
      markdown += `| **${functionsParameters.pct}%** &nbsp; \`${
        functionsParameters.covered
      }/${
        functionsParameters.total - functionsParameters.skipped
      }\`&nbsp;&nbsp; `;
    }

    const linesParameters = latestFileCoverage["lines"];
    if (typeof linesParameters === "object") {
      markdown += `| **${linesParameters.pct}%** &nbsp; \`${
        linesParameters.covered
      }/${linesParameters.total - linesParameters.skipped}\`&nbsp;&nbsp; `;
    }
  }

  markdown += "\n";
  markdown += `<details>\n`;
  markdown += "<summary>\n\n### View Additional Reports\n\n</summary>\n\n";

  markdown += "| File  | Statements | Branches | Functions | Lines |";
  markdown += "\n";
  markdown += "| :---: | :--------: | :------: | :-------: | :---: |";
  markdown += "\n";

  Object.keys(latestMarkdownContent).forEach((filePath) => {
    const latestFileCoverage = latestMarkdownContent[filePath];

    const fileName = filePath.split(context.repo.repo).pop();
    if (fileName !== "total") {
      markdown += `| ${fileName} `;

      if (previousMarkdownContent) {
        const previousFileCoverage = previousMarkdownContent[filePath];

        const latestStatementsParameters = latestFileCoverage["statements"];
        const previousStatementsParameters = previousFileCoverage["statements"];

        if (
          typeof latestStatementsParameters === "object" &&
          typeof previousStatementsParameters === "object"
        ) {
          markdown += `| **${
            latestStatementsParameters.pct
          }%** &nbsp;${addIndicator(
            latestStatementsParameters.pct,
            previousStatementsParameters.pct
          )} \`${latestStatementsParameters.covered}/${
            latestStatementsParameters.total -
            latestStatementsParameters.skipped
          }\`&nbsp;&nbsp; `;
        }

        const latestBranchesParameters = latestFileCoverage["branches"];
        const previousBranchesParameters = previousFileCoverage["branches"];

        if (
          typeof latestBranchesParameters === "object" &&
          typeof previousBranchesParameters === "object"
        ) {
          markdown += `| **${
            latestBranchesParameters.pct
          }%** &nbsp;${addIndicator(
            latestBranchesParameters.pct,
            previousBranchesParameters.pct
          )} \`${latestBranchesParameters.covered}/${
            latestBranchesParameters.total - latestBranchesParameters.skipped
          }\`&nbsp;&nbsp; `;
        }

        const latestFunctionsParameters = latestFileCoverage["functions"];
        const previousFunctionsParameters = previousFileCoverage["functions"];

        if (
          typeof latestFunctionsParameters === "object" &&
          typeof previousFunctionsParameters === "object"
        ) {
          markdown += `| **${
            latestFunctionsParameters.pct
          }%** &nbsp;${addIndicator(
            latestFunctionsParameters.pct,
            previousFunctionsParameters.pct
          )} \`${latestFunctionsParameters.covered}/${
            latestFunctionsParameters.total - latestFunctionsParameters.skipped
          }\`&nbsp;&nbsp; `;
        }

        const latestLinesParameters = latestFileCoverage["lines"];
        const previousLinesParameters = previousFileCoverage["lines"];

        if (
          typeof latestLinesParameters === "object" &&
          typeof previousLinesParameters === "object"
        ) {
          markdown += `| **${latestLinesParameters.pct}%** &nbsp;${addIndicator(
            latestLinesParameters.pct,
            previousLinesParameters.pct
          )} \`${latestLinesParameters.covered}/${
            latestLinesParameters.total - latestLinesParameters.skipped
          }\`&nbsp;&nbsp; `;
        }
      } else {
        const statementsParameters = latestFileCoverage["statements"];
        if (typeof statementsParameters === "object") {
          markdown += `| **${statementsParameters.pct}%**   \`${
            statementsParameters.covered
          }/${statementsParameters.total - statementsParameters.skipped}\` `;
        }

        const branchesParameters = latestFileCoverage["branches"];
        if (typeof branchesParameters === "object") {
          markdown += `| **${branchesParameters.pct}%**   \`${
            branchesParameters.covered
          }/${branchesParameters.total - branchesParameters.skipped}\` `;
        }

        const functionsParameters = latestFileCoverage["functions"];
        if (typeof functionsParameters === "object") {
          markdown += `| **${functionsParameters.pct}%**   \`${
            functionsParameters.covered
          }/${functionsParameters.total - functionsParameters.skipped}\` `;
        }

        const linesParameters = latestFileCoverage["lines"];
        if (typeof linesParameters === "object") {
          markdown += `| **${linesParameters.pct}%**   \`${
            linesParameters.covered
          }/${linesParameters.total - linesParameters.skipped}\` `;
        }
      }

      markdown += "\n";
    }
  });

  markdown += `</details>`;

  await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: markdown,
  });
}