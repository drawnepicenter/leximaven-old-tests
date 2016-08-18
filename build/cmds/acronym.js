'use strict';

var themes = require('../themes');
var tools = require('../tools');

var _ = require('lodash');
var chalk = require('chalk');
var http = require('good-guy-http')();
var noon = require('noon');
var xml2js = require('xml2js');

var CFILE = process.env.HOME + '/.leximaven.noon';

exports.command = 'acronym <acronym>';
exports.desc = 'Acronyms';
exports.builder = {
  out: {
    alias: 'o',
    desc: 'Write cson, json, noon, plist, yaml, xml',
    default: '',
    type: 'string'
  },
  force: {
    alias: 'f',
    desc: 'Force overwriting outfile',
    default: false,
    type: 'boolean'
  }
};
exports.handler = function (argv) {
  tools.checkConfig(CFILE);
  var config = noon.load(CFILE);
  var theme = themes.loadTheme(config.theme);
  if (config.verbose) themes.label(theme, 'down', 'Acronyms');
  var acronym = argv.acronym.toUpperCase();
  var url = 'http://acronyms.silmaril.ie/cgi-bin/xaa?' + argv.acronym;
  var tofile = {
    type: 'acronym',
    source: 'http://acronyms.silmaril.ie',
    url: url
  };
  var ctstyle = _.get(chalk, theme.content.style);
  http({ url: url }, function (error, response) {
    if (!error && response.statusCode === 200) {
      var body = response.body;
      var parser = new xml2js.Parser();
      parser.parseString(body, function (err, result) {
        var found = result.acronym.found[0];
        var count = found.$;
        if (count.n === '0') {
          console.log(ctstyle('Found 0 acronyms for ' + acronym + '.'));
        } else {
          console.log(ctstyle('Found ' + count.n + ' acronyms for ' + acronym + ':'));
          var list = found.acro;
          for (var i = 0; i <= list.length - 1; i++) {
            var item = list[i];
            process.stdout.write(ctstyle('' + item.expan));
            tofile[['expansion' + i]] = item.expan[0];
            var comm = item.comment[0];
            if (comm !== '') {
              if (comm.a) {
                var comment = comm.a[0];
                process.stdout.write(ctstyle(' - ' + comment._ + ' - ' + comment.$.href));
                tofile[['comment' + i]] = comment._;
                tofile[['url' + i]] = comment.$.href;
              } else {
                process.stdout.write(ctstyle(' - ' + comm));
                tofile[['comment' + i]] = item.comment[0];
              }
            }
            console.log(ctstyle(' - DDC: ' + item.$.dewey));
            tofile[['DDC' + i]] = item.$.dewey;
          }
          if (argv.o) tools.outFile(argv.o, argv.f, tofile);
        }
      });
    } else {
      throw new Error('HTTP ' + response.statusCode + ': ' + error);
    }
  });
};