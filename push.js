import { spawnSync } from "child_process";
import { createInterface } from "readline";
import config from "./config.js";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repos = [...config.repos]; // Make a shallow copy to avoid modifying the original config

function hasStagedChanges(repoPath) {
  const statusProcess = spawnSync("git", ["status", "--porcelain"], {
    cwd: repoPath,
  });

  if (statusProcess.error) {
    throw statusProcess.error;
  }

  const output = statusProcess.stdout.toString();
  const lines = output.split("\n");

  // Check for lines that start with A, M, or D followed by a space, 
  // which indicates staged additions, modifications, or deletions.
  return lines.some(line => /^(A |M |D )/.test(line));
}


async function pushRepo(repoPath) {
  if (!hasStagedChanges(repoPath)) {
    console.log(`No changes to push for ${repoPath}`);
    pushNextRepo();
    return;
  }

  const commitMessage = await new Promise((resolve) => {
    rl.question(`Enter commit message for ${repoPath} (press ⏎ to skip): `, resolve);
  });

  if (!commitMessage) {
    console.log("Commit message is required. Skipping push.");
    pushNextRepo();
    return;
  }

  const commitProcess = spawnSync("git", ["commit", "-am", commitMessage], {
    cwd: repoPath,
    stdio: "inherit",
  });

  if (commitProcess.error || commitProcess.status !== 0) {
    console.error(`Error committing in repo ${repoPath}`);
    pushNextRepo();
    return;
  }

  // Check if repo is an npm package
  if (!!config.isNpm?.[repoPath]) {
    const answer = await new Promise((resolve) => {
      rl.question(
        `Do you want to release ${repoPath} (npm package)? (y/n): `,
        resolve
      );
    });

    if (answer.toLowerCase() === "y") {
      // Run npm release
      const releaseProcess = spawnSync("npm", ["run", "release"], {
        cwd: repoPath,
        stdio: "inherit",
      });

      if (releaseProcess.error || releaseProcess.status !== 0) {
        console.error(`Error releasing npm package in repo ${repoPath}`);
        pushNextRepo();
        return;
      }
    }
  }

  pushChanges(repoPath);
}

// Separate push logic into its own function for reusability
function pushChanges(repoPath) {
  const pushProcess = spawnSync("git", ["push", "--follow-tags"], {
    cwd: repoPath,
    stdio: "inherit",
  });

  // Handle any push errors
  if (pushProcess.error || pushProcess.status !== 0) {
    console.error(`Error pushing repo ${repoPath}`);
    pushNextRepo();
    return;
  }

  console.log(`Pushed changes for ${repoPath}`);
  pushNextRepo();
}

function pushNextRepo() {
  if (repos.length > 0) {
    const repoPath = repos.shift();
    pushRepo(repoPath);
  } else {
    console.log("All repositories have been pushed.");
    rl.close();
  }
}

function main() {
  if (repos.length > 0) {
    pushNextRepo();
  } else {
    console.log("No repositories to push.");
    rl.close();
  }
}

main();
