import { existsSync, readFileSync, rmSync } from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';
import config from './config.js';

const repos = config.repos;

/**
 * Clones the repository at the specified path.
 *
 * @param {string} repoPath - The path of the repository to clone.
 */
function cloneRepo(repoPath) {
  if (!existsSync(repoPath)) {
    try {
      const cloneProcess = spawnSync(
        'git',
        ['clone', `https://github.com/crossify/${repoPath}.git`],
        { stdio: 'inherit' }
      );
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

/**
 * Removes the node_modules folder from the specified repository path.
 *
 * @param {string} repoPath - The path of the repository.
 */
function removeNodeModules(repoPath) {
  const nodeModulesPath = path.join(repoPath, 'node_modules');
  if (existsSync(nodeModulesPath)) {
    console.log(`Removing node_modules from ${repoPath}...`);
    rmSync(nodeModulesPath, { recursive: true });
  }
}

/**
 * Checks if the line `export PATH=$BUN_INSTALL/bin:$PATH` exists in $HOME/.bashrc.
 *
 * @returns {boolean} - True if line exists, false otherwise.
 */
function checkBunInBashrc() {
  const bashrcPath = path.join(process.env.HOME, '.bashrc');
  if (existsSync(bashrcPath)) {
    const bashrcContent = readFileSync(bashrcPath, 'utf-8');
    return bashrcContent.includes('export PATH=$BUN_INSTALL/bin:$PATH');
  }
  return false;
}

// Main function
function main() {
  const reposToRun = repos.filter((i) => i !== '.'); 
  reposToRun.forEach(cloneRepo);

  // Check if bun is installed based on $HOME/.bashrc
  if (!checkBunInBashrc()) {
    console.log('Installing bun...');
    spawnSync('curl -fsSL https://bun.sh/install | bash', {
      stdio: 'inherit',
      shell: true,
    });
    // source .bashrc from home dir after installing bun
    console.log('Sourcing .bashrc...');
    spawnSync('source', ['.bashrc'], { stdio: 'inherit' });
  } else {
    console.log('Bun is already installed. Skipping installation.');
  }

  // Run bun install
  console.log('Running bun install...');
  spawnSync('bun', ['install'], { stdio: 'inherit' });

  // Remove node_modules folders from each repo
  reposToRun.forEach(removeNodeModules);
}

main();
