#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const main = async function() {
  if (process.platform !== 'win32') {
    console.log('Just use npm install -g npm@latest'); process.exit(0); }
  const {promisify} = require('util'); // https://stackoverflow.com/questions/12941083/execute-and-get-the-output-of-a-shell-command-in-node-js
  const exec = promisify(require('child_process').exec);
  let rootFolder = await exec('npm root -g');
  if (rootFolder.stderr) {
    console.log('Error: ', rootFolder.stderr); process.exit(1);
  }
  rootFolder = rootFolder.stdout.split('\n')[0];
  rootFolder = path.dirname(rootFolder);
  if (fs.existsSync(path.join(rootFolder, 'npm'))
    || fs.existsSync(path.join(rootFolder, 'npm.cmd'))) {
    console.log('Npm instaled as Global package: uninstalling...');
    let npmUninstall = await exec('npm uninstall npm -g');
    if (npmUninstall.stderr) {
      console.log('Error: ', npmUninstall.stderr); process.exit(1);
    }
    npmUninstall = npmUninstall.stdout;
  }
  const node = path.dirname(process.execPath); // process.argv0 may output 'node' from cmd invoke
  let npmLocalVersion = await exec('npm --version', {cwd: node});
  if (npmLocalVersion.stderr) {
    console.log('Error: ', npmLocalVersion.stderr); process.exit(1);
  }
  npmLocalVersion = npmLocalVersion.stdout.split('\n')[0];
  console.log(`Found local NPM v${npmLocalVersion} in node Folder ${node}`);
  if (fs.existsSync(path.join(node, 'node_modules', 'npm', 'npmrc'))) {
    console.log('Saving npmrc and updating npm ', node); // The magic happens on ""{node}"" 4 parameters & npm|MORE as wait pipe
    const update = await exec(`${path.join(__dirname, 'cmdAdmin.exe.lnk')} "cd ""${node}"" ${fs.existsSync(path.join(node, 'node_modules', 'npm', 'npmrc')) ? `&& copy "${path.join(node, 'node_modules', 'npm', 'npmrc')}" "${path.join(node, 'npmrc')}"` : ''} && npm update npm|MORE && IF EXIST "${path.join(node, 'npmrc')}" ( move "${path.join(node, 'npmrc')}" "${path.join(node, 'node_modules', 'npm', 'npmrc')}" ) && IF EXIST "${path.join(node, 'package-lock.json')}" ( del "${path.join(node, 'package-lock.json')}" ) && exit"`);
    if (update.stderr) {
      console.log('Error: ', update.stderr, '\nPlease copy npmrc and do manual instalation from https://docs.npmjs.com/try-the-latest-stable-version-of-npm'); process.exit(1);
    }
    console.log(update.stdout);
    console.log('UPDATE SUCESSFULY');
  }
  // #region From npx-cli.js For Installation
  // const npx = require('libnpx');
  // const path = require('path');
  // const NPM_PATH = path.join(__dirname, 'node_modules/npm/bin/npm-cli.js');
  // let globalListedPackages = npx(npx.parseArgs(['fakeShell', 'SimulatingArgs', "npm", "list", "-g", "--depth=0"], NPM_PATH));
  // const rootGlobals = npx(npx.parseArgs(['fakeShell', 'SimulatingArgs', "npm", "root", "-g"], NPM_PATH));
  // globalListedPackages.then(ok=>{
  //     console.log(globalListedPackages,"end");
  // },ko=>{})
  // #endregion
  // #region NPM way untaken
  // //https://github.com/npm/cli/blob/latest/lib/install.js
  // //https://github.com/npm/cli/blob/latest/lib/ls.js
  // let npm = require('npm'); //https://stackoverflow.com/questions/20686244/install-programmatically-a-npm-package-providing-its-version
  // npm.load({global: true, loaded: false}, function (err) {
  //     // catch errors
  //     //npm.commands.ls([""], function (er, data) {
  //     npm.commands.api(["ls"], function (er, data) {
  //     //npm.commands.install(["global karma-cli"], function (er, data) {
  //         // log the error or data
  //         console.log(data,"data")
  //         console.log(er,"er")
  //     });
  //     npm.on("log", function (message) {
  //         // log the progress of the installation
  //         console.log(message);
  //     });
  // });
  // #endregion
};
// Comander inputs
// const program = require('commander');
// program
//     .option('-n, --node <nodePath>', 'Defines the node path.')
//     .option('-p, --npm <npmPath>', 'Defines the npm path.')
//     .action( main );
// program.parse(process.argv);
main();
