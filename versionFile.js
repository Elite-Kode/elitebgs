const path = require('path');
const fs = require('fs');

const appVersion = require('./package.json').version;

const frontendVersionFilePath = path.join(__dirname + '/frontend/src/environments/version.ts');
const frontendNodeVersionFilePath = path.join(__dirname + '/frontend/version.js');
const backendVersionFilePath = path.join(__dirname + '/backend/version.js');
const eddnListenerVersionFilePath = path.join(__dirname + '/eddn_listener/version.js');
const guildBotVersionFilePath = path.join(__dirname + '/guild_bot/version.js');
const tickListenerVersionFilePath = path.join(__dirname + '/tick_listener/version.js');

const angularSrc = `export const version = '${appVersion}';\n`;
const nodeSrc = `module.exports = '${appVersion}';\n`;

fs.writeFileSync(frontendVersionFilePath, angularSrc);
fs.writeFileSync(frontendNodeVersionFilePath, nodeSrc);
fs.writeFileSync(backendVersionFilePath, nodeSrc);
fs.writeFileSync(eddnListenerVersionFilePath, nodeSrc);
fs.writeFileSync(guildBotVersionFilePath, nodeSrc);
fs.writeFileSync(tickListenerVersionFilePath, nodeSrc);
