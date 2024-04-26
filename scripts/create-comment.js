export async function createComment({ github, context, latestMarkdownContent, previousMarkdownContent }) {
  let markdown = "# Code Coverage Report\n\n";

  const latestFileCoverage = latestMarkdownContent["total"];
  const previousFileCoverage = previousMarkdownContent["total"];

  markdown += `### Total \n`;

  markdown += "| Statements | Branches | Functions | Lines |";
  markdown += "\n";
  markdown += "| :--------: | :------: | :-------: | :---: |";
  markdown += "\n";

  const latestStatementsParameters = latestFileCoverage["statements"];
  const previousStatementsParameters = previousFileCoverage["statements"];

  if (typeof latestStatementsParameters === "object") {
    if (latestStatementsParameters.pct > previousStatementsParameters.pct) {
      markdown += `| **${latestStatementsParameters.pct}%** &nbsp;&#8593; \`${
        latestStatementsParameters.covered
      }/${
        latestStatementsParameters.total - latestStatementsParameters.skipped
      }\`&nbsp;&nbsp; `;
    } else {
      markdown += `| **${latestStatementsParameters.pct}%** &nbsp;&#8595; \`${
        latestStatementsParameters.covered
      }/${
        latestStatementsParameters.total - latestStatementsParameters.skipped
      }\`&nbsp;&nbsp; `;
    }
  }

  const branchesParameters = latestFileCoverage["branches"];
  if (typeof branchesParameters === "object") {
    markdown += `| **${branchesParameters.pct}%** &nbsp; \`${
      branchesParameters.covered
    }/${branchesParameters.total - branchesParameters.skipped}\`&nbsp;&nbsp; `;
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
