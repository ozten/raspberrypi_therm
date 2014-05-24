var fs = require('fs');
var path = require('path');

var async = require('async');

var devicesDir = '/sys/bus/w1/devices';

module.exports = function reading(cb) {
  fs.readdir(devicesDir, function(err, files) {
    if (err) return cb(err);
    var devices = [];
    files.forEach(function(file) {
      if (file.indexOf('28-') === 0) {
        devices.push(file);
      }
    });
    if (0 === devices.length) return cb(new Error('no w1'));
    async.map(devices, function(file, filesCb) {
        fs.readFile(path.join(devicesDir, file, 'w1_slave'), {
            encoding: 'utf8'
          },
          function(err, data) {
            if (err) {
              filesCb(err);
            } else {
              var lines = data.split('\n');
              if (lines[0].indexOf('YES') !== -1) {
                var parts = lines[1].split('=');
                var cels = parseInt(parts[1], 10) / 1000;
                var far = (cels * (9 / 5)) + 32;
                console.log(file, cels, far);
                filesCb(null, {
                  id: file,
                  c: cels,
                  f: far
                });
              } else {
                console.log('No reading');
                filesCb(null, []);
              }
            }
          });
      },
      function(err, temps) {
        if (err) {
          cb(err);
        } else {
          cb(null, temps);
        }
      });
  });
};
