function updateTemp(temperature) {
  var tempDiv = document.getElementById('temperature');
  tempDiv.innerHTML = temperature;
}

function chooseScale(scale) {
  var scales = document.getElementsByClassName('scale');
  for (var i = 0; i < scales.length; i++) {
    var classes = scales[i].getAttribute('class').split(' ');
    for (var j = 0; j < classes.length; j++) {
      if (classes[j] === scale) {
        scales[i].setAttribute('class',
          scales[i].getAttribute('class') + ' active');
      }
    }
  }
}

chooseScale('f');

function resize() {
  var body = document.getElementsByTagName('body')[0];
  body.style.fontSize = body.offsetWidth / 12 + 'pt';
}

window.addEventListener('resize', resize, false);

resize();

var hist = [];
var MAX_HIST = 60; // 1 minute in seconds
var POLLING_FREQ = 1000; // 1 Second in milliseconds

var endpoint = 'http://10.0.1.66:8000/';

//'http://localhost:9000/'

setInterval(function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint, false);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      try {
        if ('' === xhr.responseText) {
          // TODO: Show unable to contact temperature service
          updateTemp('X');
          return;
        }
        var json = xhr.responseText;
        var d = JSON.parse(json);
        // TODO check for error...
        // TODO: Show no thermometer plugged in error
        if (hist.length > MAX_HIST) {
          hist.shift();
        }
        hist.push({
          time: new Date().getTime(),
          data: d[0]
        });
        updateTemp(Math.round(d[0].f));
      } catch (e) {
        updateTemp('?');
        console.log(e);
      }
    }
  };
  xhr.send();
}, POLLING_FREQ);


function estimateTimeTo(target) {

  var currentTemp = hist[hist.length - 1].data.f;
  // Average the values of the first 5 elements of history
  var avg = 0;
  for (var i = 0; i < 5; i++) {
    avg += hist[i].data.f;
  }
  avg = avg / 5;

  // which was N seconds ago...
  var period = new Date().getTime() - hist[0].time;

  // Temp is changing at the rate of diff every N seconds
  var diff = target - avg;

  var targetDiff = target - currentTemp;
  var cycles = targetDiff / diff;
  return cycles * period;
}
