#! /usr/bin/env node
const ins = require("util").inspect;

const shell = require('shelljs');
const { Command } = require('commander');
const program = new Command();
const { version } = require("./package.json")

program
  .version(version)
  .option('-r, --repo <repo>', 'repository')
  .option('-o, --org <org>', 'org')
  .option('-n, --name <name>', 'name');

program.parse(process.argv);

const getrepoID = (owner, name) => `
query getrepoID{
    repository(owner: "${owner}", name: "${name}"){
      id
    }
  }
 `;

const renamerepo = (id) => `   
  mutation renamerepo($id: ID!){
    updateRepository(input: 
      {
        name: "pruebasergio"
        repositoryId: "${id}"
      }
    ) {
      repository{
        name
      }
    }
  }
`;

let args = program.args;

let originalName = `${program.opts().name}`;

let { org, repo, name } = program.opts();
// console.log(originalName);

if (!org || ! repo || !name) program.help();

if (!org || !repo || !name) program.help();

if (!shell.which('git')) shell.echo("git not installed")
if (!shell.which('gh')) shell.echo("gh not installed");

let r = shell.exec(`gh api graphql -f query='${getrepoID(org, repo)}'`, 
  {silent: true}
);
console.log("getrepoID return: \n", JSON.parse(r.stdout))