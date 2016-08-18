#!/usr/bin/env node
'use strict';

/* eslint max-len: 0, no-unused-expressions: 0 */
var chalk = require('chalk');
var pkg = require('../package.json');
var yargonaut = require('yargonaut').style('bold.underline', 'Commands:').style('bold.underline', 'Options:').style('bold.cyan', 'boolean').style('bold.yellow', 'string').style('bold.magenta', 'number').style('bold.blue', 'default:');
var yargs = require('yargs');
yargs.commandDir('cmds').usage(chalk.yellow('' + yargonaut.asFont('leximaven', 'Small Slant')) + '\n' + chalk.bold.underline('Usage:') + '\n$0 <command> [options]').help('h').alias('h', 'help').option('v', {
  alias: 'verbose',
  type: 'boolean',
  desc: 'Verbose output'
}).version('V', 'Show current version', pkg.version).alias('V', 'version').global('v').demand(1).argv;