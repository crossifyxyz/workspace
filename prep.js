import { existsSync } from "fs";
import { spawnSync } from "child_process";
import config from "./config.js";

const repos = config.repos;

function cloneRepo(repoPath) {
  if (!existsSync(repoPath)) {
    try {
      const cloneProcess = spawnSync("git", ["clone", `https://github.com/crossify/${repoPath}.git`], { stdio: "inherit" });
      if (cloneProcess.error) {
        console.error(`Error cloning repo ${repoPath}:`, cloneProcess.error.message);
      }
    } catch (error) {
      console.error(`Error cloning repo ${repoPath}:`, error.message);
    }
  } else {
    console.log(`Repo ${repoPath} already exists. Skipping cloning.`);
  }
}

function main() {
  repos.forEach(cloneRepo);

  console.log(`Installing dependencies...`);
  const installProcess = spawnSync("npm", ["install"], { stdio: "inherit" });
  if (installProcess.error) {
    console.error("Error installing dependencies:", installProcess.error.message);
  }
}

main();
