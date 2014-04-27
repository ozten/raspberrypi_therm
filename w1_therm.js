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
    async.each(devices, function(file, filesCb) {
      console.log('reading', path.join(devicesDir, file, 'w1_slave'));
      fs.readFile(path.join(devicesDir, file, 'w1_slave'), {
          encoding: 'utf8'
        },
        function(err, data) {
          if (err) {
            console.error(err);
            filesCb(err);
          } else {
            var lines = data.split('\n');
            if (lines[0].indexOf('YES') !== -1) {
              var parts = lines[1].split('=');
              var cels = parseInt(parts[1], 10) / 1000;
              var far = (cels * (9 / 5)) + 32;
              console.log(far, 'F');
              filesCb(null, {
                id: file,
                c: cels,
                f: far
              });
            } else {
              console.log('garbage');
              filesCb(null, null);
            }
          }
        });
    });
  }, function(err) {
console.log('and lastly');
    if (err, temps) {
      cb(err);
    } else {
      cb(null, temps);
    }
  });

}
