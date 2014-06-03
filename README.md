# Raspberry Pi w1 Thermometer

This is a simple Thermometer, which I use with the w1_therm via a Raspberry PI

The w1_term is a kernel module for the 1-wire Dallas network protocol, temperature family.

## Setup

    npm install async
    sudo modprobe w1-gpio
    sudo modprobe w1-therm

## Deployment

    node app.js

to specify port which webservice is on

    W1_PORT=9000 node app.js

## Use Cases

1) Provide a webservice which gets the temperature from the [DS18B20](https://www.adafruit.com/products/381) temperature sensor

2) See what the current temperature is

3) Estimate in hours, minutes or seconds how long it will be until we reach a target temperature

4) Play alarm when a target temperature is reached

## Other Ideas

* Graph temperature
* Add configuration stored in localStorage for endpoint
* Show no thermometer when none is plugged in

## Example w1 data

    9d 01 4b 46 7f ff 03 10 57 : crc=57 YES
    9d 01 4b 46 7f ff 03 10 57 t=25812

    ff ff ff ff ff ff ff ff ff : crc=c9 NO
    46 01 4b 46 7f ff 0a 10 85 t=-62