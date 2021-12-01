#!/usr/bin/env node

const ins = require("util").inspect;
const deb = (...args) => { 
    if (debug) console.log(ins(...args, {depth: null})); 
};

const fs = require("fs");
const shell = require('shelljs');
const { program } = require('commander');
const {version} = require("./package.json");
const { getRepoID, renameRepo } = require('./repo-rename');

program 
  .version(version)
  .option('-o, --org <organization>', 'specifies the organization')
  .option('-r, --repo <reponame>', 'specifies the repository')
  .option('-n, --name <name>', 'name');

program.parse(process.argv);

let args = program.args;

let { org, repo, name } = program.opts();

if (!org || ! repo || !name) program.help();

if (!shell.which('git')) {
    shell.echo('Sorry, this extension requires git');
}
if (!shell.which('gh')) {
   shell.echo('Sorry, this extension requires GitHub Cli');
}

const ID = getRepoID(owner, name);
const newName = renameRepo(ID, name);

console.log(`The new name for the repository is '${newName}'`)