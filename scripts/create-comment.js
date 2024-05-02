function addIndicator(latestValue, previousValue) {
  if (latestValue > previousValue) {
    return "&#8593;";
  } else if (latestValue < previousValue) {
    return "&#8595;";
  }
  return "-";
}

function addRedColor(value) {
  return `$\\color{red}{${value}}$`;
}

function addGreenColor(value) {
  return `$\\color{green}{${value}}$`;
}

function addColor(latestValue, previousValue) {
  if (latestValue > previousValue) {
    return addGreenColor(latestValue);
  } else if (latestValue < previousValue) {
    return addRedColor(latestValue);
  }
  return addRedColor(`${latestValue}`); // TODO: change to green color
}

function addPreviousMarkdownContent(latestParameters, previousParameters) {
  return `| **${addColor(
    latestParameters.pct,
    previousParameters.pct
  )}** &nbsp;${addIndicator(latestParameters.pct, previousParameters.pct)} \`${
    latestParameters.covered
  }/${latestParameters.total - latestParameters.skipped}\`&nbsp;&nbsp; `;
}

export async function createComment({
  github,
  context,
  latestMarkdownContent,
  previousMarkdownContent,
}) {
  let markdown = "# Code Coverage Report\n\n";

  markdown += `### Total \n`;

  markdown += "| Statements | Branches | Functions | Lines |";
  markdown += "\n";
  markdown += "| :--------: | :------: | :-------: | :---: |";
  markdown += "\n";

  const previousMarkdownContentExists = Object.keys(
    previousMarkdownContent
  )?.length;

  const latestFileCoverage = latestMarkdownContent["total"];

  if (previousMarkdownContentExists) {
    const previousFileCoverage = previousMarkdownContent["total"];

    const latestStatementsParameters = latestFileCoverage["statements"];
    const previousStatementsParameters = previousFileCoverage["statements"];

    if (
      typeof latestStatementsParameters === "object" &&
      typeof previousStatementsParameters === "object"
    ) {
      markdown += addPreviousMarkdownContent(
        latestStatementsParameters,
        previousStatementsParameters
      );
    }

    const latestBranchesParameters = latestFileCoverage["branches"];
    const previousBranchesParameters = previousFileCoverage["branches"];

    if (
      typeof latestBranchesParameters === "object" &&
      typeof previousBranchesParameters === "object"
    ) {
      markdown += addPreviousMarkdownContent(
        latestBranchesParameters,
        previousBranchesParameters
      );
    }

    const latestFunctionsParameters = latestFileCoverage["functions"];
    const previousFunctionsParameters = previousFileCoverage["functions"];

    if (
      typeof latestFunctionsParameters === "object" &&
      typeof previousFunctionsParameters === "object"
    ) {
      markdown += addPreviousMarkdownContent(
        latestFunctionsParameters,
        previousFunctionsParameters
      );
    }

    const latestLinesParameters = latestFileCoverage["lines"];
    const previousLinesParameters = previousFileCoverage["lines"];

    if (
      typeof latestLinesParameters === "object" &&
      typeof previousLinesParameters === "object"
    ) {
      markdown += addPreviousMarkdownContent(
        latestLinesParameters,
        previousLinesParameters
      );
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

      if (previousMarkdownContentExists) {
        const resolvedFilePath = Object.keys(previousMarkdownContent).filter(
          (previousFilePath) => {
            const previousFileName = previousFilePath
              .split(context.repo.repo)
              .pop();
            if (previousFileName === fileName) {
              return previousFilePath;
            }
          }
        );
        const previousFileCoverage = previousMarkdownContent[resolvedFilePath];

        const latestStatementsParameters = latestFileCoverage["statements"];
        const previousStatementsParameters = previousFileCoverage["statements"];

        if (
          typeof latestStatementsParameters === "object" &&
          typeof previousStatementsParameters === "object"
        ) {
          markdown += addPreviousMarkdownContent(
            latestStatementsParameters,
            previousStatementsParameters
          );
        }

        const latestBranchesParameters = latestFileCoverage["branches"];
        const previousBranchesParameters = previousFileCoverage["branches"];

        if (
          typeof latestBranchesParameters === "object" &&
          typeof previousBranchesParameters === "object"
        ) {
          markdown += addPreviousMarkdownContent(
            latestBranchesParameters,
            previousBranchesParameters
          );
        }

        const latestFunctionsParameters = latestFileCoverage["functions"];
        const previousFunctionsParameters = previousFileCoverage["functions"];

        if (
          typeof latestFunctionsParameters === "object" &&
          typeof previousFunctionsParameters === "object"
        ) {
          markdown += addPreviousMarkdownContent(
            latestFunctionsParameters,
            previousFunctionsParameters
          );
        }

        const latestLinesParameters = latestFileCoverage["lines"];
        const previousLinesParameters = previousFileCoverage["lines"];

        if (
          typeof latestLinesParameters === "object" &&
          typeof previousLinesParameters === "object"
        ) {
          markdown += addPreviousMarkdownContent(
            latestLinesParameters,
            previousLinesParameters
          );
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
