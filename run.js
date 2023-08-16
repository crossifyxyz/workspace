import { spawn } from "child_process";
import readline from "readline";
import config from "./config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repos = config.repos.filter((repo) => repo !== ".");
const selectedRepos = [];
const script = process.argv[2];

function runRepo(repoPath) {
  rl.question(`Do you want to run npm run ${script} in ${repoPath}? (y/n): `, (answer) => {
    if (answer.toLowerCase() === "y") {
      selectedRepos.push(`cd ${repoPath} && npm run ${script}`);
    }
    runNextRepo();
  });
}

function runNextRepo() {
  if (repos.length > 0) {
    const repoPath = repos.shift();
    runRepo(repoPath);
  } else {
    console.log("All repositories have been processed.");
    rl.close();

    if (selectedRepos.length > 0) {
      const concurrentlyCommand = `concurrently "${selectedRepos.join('" "')}"`;

      console.log(`Running repositories concurrently with ${script}...`);
      const child = spawn(concurrentlyCommand, {
        shell: true,
        stdio: "inherit",
      });

      child.on("exit", () => {
        console.log(`All repositories have been run concurrently with ${script}.`);
      });

      // Handle user's attempt to exit.
      process.on("SIGINT", () => {
        child.kill();
        process.exit();
      });
    } else {
      console.log(`No repositories selected to run ${script}.`);
    }
  }
}

function main() {
  if (repos.length === 0) {
    console.log("No repositories specified in config.");
    return;
  }

  runNextRepo();
}

main();
