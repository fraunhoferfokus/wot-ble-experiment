// to enable es2015 features
'use strict';

let TemperaturePeripheral = require('./TemperaturePeripheral/temperaturePeripheral');

console.log("[main] create new temperature peripheral");

let peripheral1 = new TemperaturePeripheral('peripheral1');
