#!/usr/bin/env node

// # h5bp documentation cli file

// this file is the node program executed when one use the `h5bp-docs` command line tool.

var Path = require('path'),
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    h5bp = require('../lib/h5bp'),
    defaults = require('../conf/config.js'),
    optimist = require('optimist'),
    options, argv;


// There are also flags for the h5bp executable.
// which are described below next to their respective configuration options. The order of precedence for 
// conflicting settings is Command-line flags > Configuration file settings > Defaults
argv = optimist.argv;

// set default options, if a --config option provided, this is a local relative path to some
// other configuration file.
options = optimist.argv.config ? 
  require(Path.join(process.cwd(), optimist.argv.config)) : 
  defaults;

// get command line options, merge with defaults
argv = optimist.default(defaults).default(options).argv;


// basic help output when -h or --help used
var help = [
    "usage: h5bp-docs [options]",
    "",
    "options:",
    "  --config          Path to a local configuration files, used intead of h5bp-docs/conf/config.js as defaults",
    "  --verbose         Enable verbose output",
    "  --server          Start a static connect server once generation done",
    "  --src             Source folder where markdown files to process are stored",
    "  --dest            Destination folder, place where the generated files will land",
    "  --layout          layout file used to generate each files, using {{ content }} placeholder",
    "  --baseurl         Let you define a prefixed value for each generated href",
    "  -v, --version     display package version",
    "  -h, --help        You're staring at it"
].join('\n');

if(argv.help || argv.h) {
  console.log(help);
  process.exit(0);
}

if(argv.v || argv.version) {
  console.log(JSON.parse(fs.readFileSync(Path.join(__dirname, '..', 'package.json'), 'utf8')).version);
  process.exit(0);
}

// prevent generation if some mandatory options are missing
if(!argv.src) {
  console.log(' ✗ Missing src options. See below the list of options.');
  console.log('\n' + help);
  process.exit(0);
}

// run the whole process and pass in computed configuration
// (merge between config.yaml, config.js (defaults) and flags
// for the executable)
delete argv._;
delete argv.$0;
h5bp(argv);
