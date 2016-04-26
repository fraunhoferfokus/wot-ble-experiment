// to enable es2015 features
'use strict';

let TemperaturePeripheral = require('./TemperaturePeripheral/temperaturePeripheral');

console.log("[main] create new temperature peripheral");

let peripheral1 = new TemperaturePeripheral('peripheral1');
console.log(peripheral1.sensorService.characteristics[0]);
let char = peripheral1.sensorService.characteristics[0];

let i = 1
setInterval(function(){
    if(char.updateValueCallback){
        char.updateValueCallback(new Buffer("" + i++));
    }

}, 1000)
