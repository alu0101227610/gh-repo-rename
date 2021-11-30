#!/usr/bin/env node

const ins = require("util").inspect;
const deb = (...args) => { 
    if (debug) console.log(ins(...args, {depth: null})); 
};

const fs = require("fs");
const shell = require('shelljs');
const { program } = require('commander');
const {version} = require("./package.json");

program 
  .version(version)
  .option('-o, --org <organization>', 'specifies the organization')
  .option('-r, --repo <reponame>', 'specifies the repository')
  .option('-n, --name <name>', 'name');

program.parse(process.argv);

let args = program.args;

const getrepoID = (owner, name) => `
query getrepoID{
    repository(owner: "${owner}", name: "${name}"){
      id
    }
  }
 `;

const renamerepo = (id, newName) => `   
  mutation renamerepo{
    updateRepository(input: 
      {
        name: "${newName}"
        repositoryId: "${id}"
      }
    ) {
      repository{
        name
      }
    }
  }
`;

let { org, repo, name } = program.opts();

if (!org || ! repo || !name) program.help();

if (!shell.which('git')) {
    shell.echo('Sorry, this extension requires git');
}
if (!shell.which('gh')) {
   shell.echo('Sorry, this extension requires GitHub Cli');
}

let r = shell.exec(`gh api graphql -f query='${getrepoID(org, repo)}' --jq '.data.repository.id'`, 
  {silent: true}
);
if (r.code !== 0) {
  console.error(r.stderr)
  process.exit(r.code)
}

//console.log("getrepoID return: \n", r.stdout)
const ID = r.stdout

r = shell.exec(`gh api graphql -f query='${renamerepo(ID, name)}' --jq '.data.updateRepository.repository.name'` , 
  {silent: true}
);

if (r.code !== 0) {
  console.error(r.stderr)
  process.exit(r.code)
}

console.log(`The new name for the repository is '${r.stdout.replace(/\s+$/, '')}'`)