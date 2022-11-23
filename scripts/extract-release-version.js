const { execSync } = require("child_process");

const headGitCommit = execSync("git log -1 --pretty=%B", {
  encoding: "utf-8",
}).trim();
const matched = headGitCommit.toLowerCase().match(/release\/([^\s]+)/);
if (matched) {
  console.log(matched[1]);
} else {
  throw new Error("Failed to extract the latest release version");
}
