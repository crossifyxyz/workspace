# Crossify Monorepo Workspace

This monorepo serves as a workspace for Crossify projects, providing an organized structure for managing related repositories.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)

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

3. Prep repos using prep script:

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
├── ... (other packages)
├── .gitignore
├── package.json
└── README.md
```
- `@crossify/types/`: Shared types and interfaces used across different projects.
- `@crossify/mongoose/`: Mongoose schema and models package.
- `web/`, `api/`, `analytics/`, `event-bus/`: Project-specific packages.
- `.gitignore`: Git ignore rules for the monorepo.
- `package.json`: Workspace-level package.json file.
- `package-lock.json`: NPM lockfile.

## Usage

You can use NPM scripts to manage and work with the packages in this monorepo:

- To run dev:

```bash
npm run dev
```

- To push changes:

```bash
npm run push
```

For specific packages, navigate to their directories and run Yarn commands as needed.

## License

This project is licensed under the [MIT License](LICENSE).

This README provides an overview of the monorepo structure, how to get started, how to use Yarn commands, contributing guidelines, and licensing information. Customize it further to match your specific monorepo setup and needs.