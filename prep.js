import { existsSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
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

function linkDependencies(repo) {
  if (config.isNpm[repo]) {
    console.log(`Running npm link for ${repo}...`);
    spawnSync('npm', ['link'], { cwd: path.join(process.cwd(), repo), stdio: 'inherit' });
  } else {
    // Linking @crossify/ prefixed repos
    const isNpmRepos = Object.keys(config.isNpm).filter(key => config.isNpm[key]);
    const isNpmReposWithPrefix = isNpmRepos.map(repo => `@crossify/${repo}`);
    if (isNpmReposWithPrefix.length > 0) {
      console.log(`Running npm link ${isNpmReposWithPrefix.join(' ')} for ${repo}...`);
      spawnSync('npm', ['link', ...isNpmReposWithPrefix], { cwd: path.join(process.cwd(), repo), stdio: 'inherit' });
    }

    // Linking hasLocalDeps repos
    const localDeps = config.hasLocalDeps[repo];
    if (localDeps && localDeps.length > 0) {
      const localDepsWithPrefix = localDeps.map(dep => `@crossify/${dep}`);
      console.log(`Running npm link ${localDepsWithPrefix.join(' ')} for ${repo}...`);
      spawnSync('npm', ['link', ...localDepsWithPrefix], { cwd: path.join(process.cwd(), repo), stdio: 'inherit' });
    }
  }
}

function installAndLinkDependencies(repo) {
  console.log(`Installing dependencies for ${repo}...`);
  const installProcess = spawnSync('npm', ['install'], { cwd: path.join(process.cwd(), repo), stdio: 'inherit' });
  if (installProcess.error) {
    console.error(`Error installing dependencies for ${repo}:`, installProcess.error.message);
    return;
  }

  linkDependencies(repo);
}

function main() {
  repos.forEach(cloneRepo);

  repos.filter(i => i !== '.').forEach(installAndLinkDependencies);
}

main();
