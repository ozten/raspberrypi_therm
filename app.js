var fs = require('fs');
var path = require('path');

var http = require('http');

var therm = require('./w1_therm');

var hostname = process.env.W1_HOSTNAME || '0.0.0.0';
var port = process.env.W1_PORT || '8000';
var canned = !! process.env.CANNED_DATA ? true : false;

var logfile;

if (3 === process.argv.length) {
  logfile = path.resolve(__dirname, process.argv[2]);
  console.log('Logging data every second to', logfile);

  var log = fs.createWriteStream(logfile, {
    flags: 'a',
    encoding: 'utf8'
  });
  log.on('error', function(err) {
    if (err) {
      console.log('Unable to log to', logfile);
      console.log(err.stack || err);
    }
  });
  setInterval(function() {
    therm(function(err, temps) {
      var timestamp = new Date().getTime() + '';
      if (err) {
        console.log(err);
      } else {
        for (var i = 0; i < temps.length; i++) {
          log.write([timestamp, temps[i].id, temps[i].c, temps[i].f].join(',') + '\n', 'utf8');
        }
      }
    });
  }, 1000);
}

var server = http.createServer(function(req, res) {
  if (canned) {
    var cels = 40 + (Math.random() * 10) - 5;
    var far = (cels * (9 / 5)) + 32;
    return sendJson(res, [{
      id: 'canned',
      c: cels,
      f: far
    }]);
  } else {
    therm(function(err, temps) {
      if (err) {
        console.log(err);
        return sendJson(res, {
          err: err
        }, 500);
      }
      return sendJson(res, temps);
    });
  }
});

server.listen(port, hostname, function() {
  console.log('W1 Thermometer available at http://' + hostname + ':' + port);
});

function sendJson(res, json, statusCode) {
  res.statusCode = statusCode || 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(json));
}
