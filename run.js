import { spawn } from "child_process";
import readline from "readline";
import config from "./config.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repos = config.repos.filter((repo) => repo !== ".");
const selectedCommands = [];
const script = process.argv[2];
const childProcesses = [];
const childLookup = {};

function runRepo(repoPath) {
  rl.question(`Do you want to run npm run ${script} in ${repoPath}? (y/n): `, (answer) => {
    if (answer.toLowerCase() === "y") {
      selectedCommands.push({ command: `cd ${repoPath} && npm run ${script}`, repo: repoPath });
    }
    runNextRepo();
  });
}

function runSelectedRepos() {
  selectedCommands.forEach(({ command, repo }) => {
    const child = spawn('sh', ['-c', command], {
      stdio: ['pipe', 'inherit', 'inherit']
    });

    childLookup[repo] = child;
    childProcesses.push(child);
  });
}

function runNextRepo() {
  if (repos.length > 0) {
    const repoPath = repos.shift();
    runRepo(repoPath);
  } else {
    console.log("All repositories have been processed.");
    rl.close();

    if (selectedCommands.length > 0) {
      console.log(`Running selected repositories with ${script}...`);
      runSelectedRepos();

      // Listen for further input
      const rlCommand = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: '>'
      });

      rlCommand.prompt();

      rlCommand.on('line', (input) => {
        const [repoSpecific, command] = input.split(":");

        if (childLookup[repoSpecific]) {
          childLookup[repoSpecific].stdin.write(command + "\n");
        } else {
          childProcesses.forEach(child => child.stdin.write(input + "\n"));
        }
        
        rlCommand.prompt();
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

// Handle user's attempt to exit.
process.on("SIGINT", () => {
  for (let child of childProcesses) {
    child.kill();
  }
  process.exit();
});
