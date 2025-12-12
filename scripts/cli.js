#!/usr/bin/env node

const command = process.argv[2];

switch (command) {
  case "commit":
    require("./commit.js");
    break;
  default:
    console.log("Comandos disponíveis: commit, fbschema");
}
