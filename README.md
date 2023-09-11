<div align="center">

[![license](https://img.shields.io/badge/license-Apache%202-blue)](/LICENSE.md)
[![Follow on Twitter](https://img.shields.io/twitter/follow/crossifyxyz.svg?label=follow+CROSSIFY)](https://twitter.com/crossifyxyz)

</div>

# Crossify Monorepo Workspace

This monorepo serves as a workspace for Crossify projects, providing an organized structure for managing related repositories.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Interacting with Repositories](#interacting-with-repositories)
- [Summary](#summary)

## Introduction

This monorepo is designed to manage and organize Crossify projects using a monorepo structure. It uses tools like NPM Workspaces to manage multiple packages and shared dependencies efficiently.

## Getting Started

1. Clone this repository to your local machine:

```bash
git clone https://github.com/crossify/workspace.git
```

2. Navigate to the root directory of the cloned repository:

```bash
cd workspace
```

3. Prep repos using prep script ( if there is any change in the package.json
   file of any repo, you need to run this script again ):

```bash
npm run prep
```

## Project Structure

The workspace is organized as follows:

```
workspace/
├── types/
├── mongoose/
├── web/
├── api/
├── analytics/
├── event-bus/
├── ... (other repos)
├── .gitignore
├── package.json
├── README.md
├── LICENSE.md
├── *.js
└── *.sh
```

- `@crossify/types/`: Shared types and interfaces used across different projects.
- `@crossify/mongoose/`: Mongoose schema and models package.
- `web/`, `api/`, `analytics/`, `event-bus/`: Project-specific repos.
- `.gitignore`: Git ignore rules for the monorepo.
- `package.json`: Workspace-level package.json file.
- `package-lock.json`: NPM lockfile.

## Usage

You can use NPM scripts to manage and work with the packages in this monorepo:

- To run dev:

```bash
bun run dev
```

- To push changes:

```bash
bun run push
```

For specific packages, navigate to their directories and run NPM commands as needed.

## Interacting with Repositories

While the monorepo processes are running, you can interact with them directly from the terminal:

- To send a command to all processes:

```bash
<any_command>
```

- To target a specific repository:

```bash
<repo_name>:<any_command>
```

For example, to send a restart command only to the web repo, you would type:

```bash
web:rs
```

This feature allows for flexible and fine-grained control over each repository process directly from your terminal.

## Summary

This README provides an overview of the monorepo structure, how to get started, how to use NPM commands, contributing guidelines, and licensing information. Customize it further to match your specific monorepo setup and needs.
