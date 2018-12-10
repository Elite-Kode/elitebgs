const path = require('path');
const fs = require('fs-extra');
const appVersion = require('./package.json').version;

const angularVersionFilePath = path.join(__dirname + '/src/environments/version.ts');
const nodeVersionFilePath = path.join(__dirname + '/server/version.js');

const angularSrc = `export const version = '${appVersion}';\n`;
const nodeSrc = `module.exports = '${appVersion}';\n`;

fs.writeFileSync(angularVersionFilePath, angularSrc);
fs.writeFileSync(nodeVersionFilePath, nodeSrc);
