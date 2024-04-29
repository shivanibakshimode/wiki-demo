import fs from "fs";
import { execSync } from "node:child_process";

export async function downloadPreviousArtifact({ github, context, core }) {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  const workflows = await github.rest.actions.listRepoWorkflows({
    owner,
    repo,
  });

  console.log("workflows: ", workflows)
  const workflow = workflows.data.workflows.find((workflow) =>
    workflow.path.includes(process.env.WORKFLOW_FILENAME)
  );

  if (!workflow) {
    core.setFailed("No repo workflows found");
    return;
  }

  const runs = await github.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: workflow.id,
    status: "success",
    per_page: 1,
  });

  console.log("runs: ", runs)
  if (runs.data.total_count === 0) {
    core.setFailed("No workflow runs found");
    return;
  }

  const artifacts = await github.rest.actions.listWorkflowRunArtifacts({
    owner,
    repo,
    run_id: runs.data.workflow_runs[0].id,
  });

  console.log("artifacts: ", artifacts)
  const artifact = artifacts.data.artifacts.find(
    (artifact) => artifact.name === process.env.ARTIFACT_NAME
  );
  if (artifact) {
    console.log("artifact: ", artifact)
    const response = await github.rest.actions.downloadArtifact({
      owner,
      repo,
      artifact_id: artifact.id,
      archive_format: "zip",
    });
    fs.writeFileSync(process.env.ARTIFACT_FILENAME, Buffer.from(response.data));
    execSync(
      `unzip -o ${process.env.ARTIFACT_FILENAME} -d ${process.env.UNZIP_DIRECTORY}`
    );

    console.log("Artifact downloaded successfully");
  } else {
    core.setFailed("No artifact found");
  }
}
