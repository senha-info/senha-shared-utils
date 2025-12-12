#!/usr/bin/env node

const { execSync } = require("child_process");

const projectRoot = process.cwd();

execSync("npm version minor", { cwd: projectRoot, stdio: "inherit" });
