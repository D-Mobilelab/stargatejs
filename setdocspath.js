const FILENAME = 'esdoc.json';
var fs = require('fs');
var esdocJSON = require('./esdoc.boiler.json');

var args = process.argv.slice(2);
var docsPath = args[0];
esdocJSON.destination = docsPath;
fs.writeFileSync(FILENAME, JSON.stringify(esdocJSON), 'utf8');