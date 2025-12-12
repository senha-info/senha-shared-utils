#!/usr/bin/env node

const { execSync } = require("child_process");

const type = process.argv[2];

if (!["patch", "minor", "major"].includes(type)) {
  console.error("Use: commit <patch|minor|major>");
  process.exit(1);
}

const projectRoot = process.cwd();

execSync(`npm version ${type} --no-git-tag-version`, { cwd: projectRoot, stdio: "inherit" });
