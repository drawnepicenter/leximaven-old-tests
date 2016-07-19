'use strict';

/* eslint max-len:0, no-unused-vars:0 */
var tools = require('../../tools');

var chalk = require('chalk');
var moment = require('moment');
var needle = require('needle');
var noon = require('noon');

var CFILE = process.env.HOME + '/.leximaven.noon';

exports.command = 'info';
exports.desc = 'Datamuse metrics';
exports.builder = {};
exports.handler = function (argv) {
  tools.checkConfig(CFILE);
  var config = noon.load(CFILE);
  var url = 'http://api.datamuse.com/metrics';
  needle.get(url, function (error, response) {
    if (!error && response.statusCode === 200) {
      var body = response.body;
      var version = body[0];
      var qps = body[1];
      var sugf = body[2];
      var sugn = body[3];
      var wordf = body[4];
      var wordn = body[5];
      console.log(chalk.white('Current queries per second (v' + Math.round(version.value * 100) / 100.0 + '): ' + Math.round(qps.value * 100) / 100.0));
      console.log(chalk.white('Latency (/words): ' + Math.round(wordf.value * 100000) / 100.0 + ' ms (median), ' + Math.round(wordn.value * 100000) / 100.0 + ' ms (99 %ile)'));
      console.log(chalk.white('Latency (/sug): ' + Math.round(sugf.value * 100000) / 100.0 + ' ms (median), ' + Math.round(sugn.value * 100000) / 100.0 + ' ms (99 %ile)'));
    } else {
      console.error(chalk.red.bold('HTTP ' + response.statusCode + ':') + ' ' + chalk.red(error));
    }
  });
  var limit = config.dmuse.date.limit;
  var remain = config.dmuse.date.remain;
  var stamp = new Date(config.dmuse.date.stamp);
  var reset = 24 - moment(new Date()).diff(stamp, 'hours');
  console.log(chalk.white(remain + '/' + limit + ' requests remain today, will reset in ' + reset + ' hours.'));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNtZHMvZG11c2VfY21kcy9pbmZvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxJQUFNLFFBQVEsUUFBUSxhQUFSLENBQWQ7O0FBRUEsSUFBTSxRQUFRLFFBQVEsT0FBUixDQUFkO0FBQ0EsSUFBTSxTQUFTLFFBQVEsUUFBUixDQUFmO0FBQ0EsSUFBTSxTQUFTLFFBQVEsUUFBUixDQUFmO0FBQ0EsSUFBTSxPQUFPLFFBQVEsTUFBUixDQUFiOztBQUVBLElBQU0sUUFBVyxRQUFRLEdBQVIsQ0FBWSxJQUF2QixxQkFBTjs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsTUFBbEI7QUFDQSxRQUFRLElBQVIsR0FBZSxrQkFBZjtBQUNBLFFBQVEsT0FBUixHQUFrQixFQUFsQjtBQUNBLFFBQVEsT0FBUixHQUFrQixVQUFDLElBQUQsRUFBVTtBQUMxQixRQUFNLFdBQU4sQ0FBa0IsS0FBbEI7QUFDQSxNQUFNLFNBQVMsS0FBSyxJQUFMLENBQVUsS0FBVixDQUFmO0FBQ0EsTUFBTSxNQUFNLGlDQUFaO0FBQ0EsU0FBTyxHQUFQLENBQVcsR0FBWCxFQUFnQixVQUFDLEtBQUQsRUFBUSxRQUFSLEVBQXFCO0FBQ25DLFFBQUksQ0FBQyxLQUFELElBQVUsU0FBUyxVQUFULEtBQXdCLEdBQXRDLEVBQTJDO0FBQ3pDLFVBQU0sT0FBTyxTQUFTLElBQXRCO0FBQ0EsVUFBTSxVQUFVLEtBQUssQ0FBTCxDQUFoQjtBQUNBLFVBQU0sTUFBTSxLQUFLLENBQUwsQ0FBWjtBQUNBLFVBQU0sT0FBTyxLQUFLLENBQUwsQ0FBYjtBQUNBLFVBQU0sT0FBTyxLQUFLLENBQUwsQ0FBYjtBQUNBLFVBQU0sUUFBUSxLQUFLLENBQUwsQ0FBZDtBQUNBLFVBQU0sUUFBUSxLQUFLLENBQUwsQ0FBZDtBQUNBLGNBQVEsR0FBUixDQUFZLE1BQU0sS0FBTixtQ0FBNEMsS0FBSyxLQUFMLENBQVcsUUFBUSxLQUFSLEdBQWdCLEdBQTNCLElBQWtDLEtBQTlFLFdBQXlGLEtBQUssS0FBTCxDQUFXLElBQUksS0FBSixHQUFZLEdBQXZCLElBQThCLEtBQXZILENBQVo7QUFDQSxjQUFRLEdBQVIsQ0FBWSxNQUFNLEtBQU4sd0JBQWlDLEtBQUssS0FBTCxDQUFXLE1BQU0sS0FBTixHQUFjLE1BQXpCLElBQW1DLEtBQXBFLHNCQUEwRixLQUFLLEtBQUwsQ0FBVyxNQUFNLEtBQU4sR0FBYyxNQUF6QixJQUFtQyxLQUE3SCxtQkFBWjtBQUNBLGNBQVEsR0FBUixDQUFZLE1BQU0sS0FBTixzQkFBK0IsS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFMLEdBQWEsTUFBeEIsSUFBa0MsS0FBakUsc0JBQXVGLEtBQUssS0FBTCxDQUFXLEtBQUssS0FBTCxHQUFhLE1BQXhCLElBQWtDLEtBQXpILG1CQUFaO0FBQ0QsS0FYRCxNQVdPO0FBQ0wsY0FBUSxLQUFSLENBQWlCLE1BQU0sR0FBTixDQUFVLElBQVYsV0FBdUIsU0FBUyxVQUFoQyxPQUFqQixTQUFtRSxNQUFNLEdBQU4sQ0FBVSxLQUFWLENBQW5FO0FBQ0Q7QUFDRixHQWZEO0FBZ0JBLE1BQU0sUUFBUSxPQUFPLEtBQVAsQ0FBYSxJQUFiLENBQWtCLEtBQWhDO0FBQ0EsTUFBTSxTQUFTLE9BQU8sS0FBUCxDQUFhLElBQWIsQ0FBa0IsTUFBakM7QUFDQSxNQUFNLFFBQVEsSUFBSSxJQUFKLENBQVMsT0FBTyxLQUFQLENBQWEsSUFBYixDQUFrQixLQUEzQixDQUFkO0FBQ0EsTUFBTSxRQUFRLEtBQUssT0FBTyxJQUFJLElBQUosRUFBUCxFQUFpQixJQUFqQixDQUFzQixLQUF0QixFQUE2QixPQUE3QixDQUFuQjtBQUNBLFVBQVEsR0FBUixDQUFZLE1BQU0sS0FBTixDQUFlLE1BQWYsU0FBeUIsS0FBekIsOENBQXVFLEtBQXZFLGFBQVo7QUFDRCxDQXpCRCIsImZpbGUiOiJjbWRzL2RtdXNlX2NtZHMvaW5mby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludCBtYXgtbGVuOjAsIG5vLXVudXNlZC12YXJzOjAgKi9cbmNvbnN0IHRvb2xzID0gcmVxdWlyZSgnLi4vLi4vdG9vbHMnKVxuXG5jb25zdCBjaGFsayA9IHJlcXVpcmUoJ2NoYWxrJylcbmNvbnN0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5jb25zdCBuZWVkbGUgPSByZXF1aXJlKCduZWVkbGUnKVxuY29uc3Qgbm9vbiA9IHJlcXVpcmUoJ25vb24nKVxuXG5jb25zdCBDRklMRSA9IGAke3Byb2Nlc3MuZW52LkhPTUV9Ly5sZXhpbWF2ZW4ubm9vbmBcblxuZXhwb3J0cy5jb21tYW5kID0gJ2luZm8nXG5leHBvcnRzLmRlc2MgPSAnRGF0YW11c2UgbWV0cmljcydcbmV4cG9ydHMuYnVpbGRlciA9IHt9XG5leHBvcnRzLmhhbmRsZXIgPSAoYXJndikgPT4ge1xuICB0b29scy5jaGVja0NvbmZpZyhDRklMRSlcbiAgY29uc3QgY29uZmlnID0gbm9vbi5sb2FkKENGSUxFKVxuICBjb25zdCB1cmwgPSAnaHR0cDovL2FwaS5kYXRhbXVzZS5jb20vbWV0cmljcydcbiAgbmVlZGxlLmdldCh1cmwsIChlcnJvciwgcmVzcG9uc2UpID0+IHtcbiAgICBpZiAoIWVycm9yICYmIHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgY29uc3QgYm9keSA9IHJlc3BvbnNlLmJvZHlcbiAgICAgIGNvbnN0IHZlcnNpb24gPSBib2R5WzBdXG4gICAgICBjb25zdCBxcHMgPSBib2R5WzFdXG4gICAgICBjb25zdCBzdWdmID0gYm9keVsyXVxuICAgICAgY29uc3Qgc3VnbiA9IGJvZHlbM11cbiAgICAgIGNvbnN0IHdvcmRmID0gYm9keVs0XVxuICAgICAgY29uc3Qgd29yZG4gPSBib2R5WzVdXG4gICAgICBjb25zb2xlLmxvZyhjaGFsay53aGl0ZShgQ3VycmVudCBxdWVyaWVzIHBlciBzZWNvbmQgKHYke01hdGgucm91bmQodmVyc2lvbi52YWx1ZSAqIDEwMCkgLyAxMDAuMH0pOiAke01hdGgucm91bmQocXBzLnZhbHVlICogMTAwKSAvIDEwMC4wfWApKVxuICAgICAgY29uc29sZS5sb2coY2hhbGsud2hpdGUoYExhdGVuY3kgKC93b3Jkcyk6ICR7TWF0aC5yb3VuZCh3b3JkZi52YWx1ZSAqIDEwMDAwMCkgLyAxMDAuMH0gbXMgKG1lZGlhbiksICR7TWF0aC5yb3VuZCh3b3Jkbi52YWx1ZSAqIDEwMDAwMCkgLyAxMDAuMH0gbXMgKDk5ICVpbGUpYCkpXG4gICAgICBjb25zb2xlLmxvZyhjaGFsay53aGl0ZShgTGF0ZW5jeSAoL3N1Zyk6ICR7TWF0aC5yb3VuZChzdWdmLnZhbHVlICogMTAwMDAwKSAvIDEwMC4wfSBtcyAobWVkaWFuKSwgJHtNYXRoLnJvdW5kKHN1Z24udmFsdWUgKiAxMDAwMDApIC8gMTAwLjB9IG1zICg5OSAlaWxlKWApKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKGAke2NoYWxrLnJlZC5ib2xkKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX06YCl9ICR7Y2hhbGsucmVkKGVycm9yKX1gKVxuICAgIH1cbiAgfSlcbiAgY29uc3QgbGltaXQgPSBjb25maWcuZG11c2UuZGF0ZS5saW1pdFxuICBjb25zdCByZW1haW4gPSBjb25maWcuZG11c2UuZGF0ZS5yZW1haW5cbiAgY29uc3Qgc3RhbXAgPSBuZXcgRGF0ZShjb25maWcuZG11c2UuZGF0ZS5zdGFtcClcbiAgY29uc3QgcmVzZXQgPSAyNCAtIG1vbWVudChuZXcgRGF0ZSkuZGlmZihzdGFtcCwgJ2hvdXJzJylcbiAgY29uc29sZS5sb2coY2hhbGsud2hpdGUoYCR7cmVtYWlufS8ke2xpbWl0fSByZXF1ZXN0cyByZW1haW4gdG9kYXksIHdpbGwgcmVzZXQgaW4gJHtyZXNldH0gaG91cnMuYCkpXG59XG4iXX0=