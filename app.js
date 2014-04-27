var therm = require('./w1_therm');
therm(function(err, temps) {
  console.log('finally', err, temps);
});
