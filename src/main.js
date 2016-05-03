// to enable es2015 features
'use strict';

//let TemperaturePeripheral = require('./advertise/peripherals/TemperaturePeripheral/temperaturePeripheral')
//let LightBulbPeripheral = require('./advertise/peripherals/LightBulb/lightBulbPeripheral')


// let lightbulb1 = new LightBulbPeripheral("lightbulb1");
// let peripheral1 = new TemperaturePeripheral('peripheral1');
// console.log(peripheral1.sensorService.characteristics[0]);

//let Discover = require('./discover/discover')
//let discover = new Discover()

console.log('[main] create discover object')
let Discover = require('./discover/discover')
let discover = new Discover()

console.log(discover.state)
discover.state = 'poweredOn'


/*
let char = peripheral1.sensorService.characteristics[0];

let i = 1
setInterval(function(){
    if(char.updateValueCallback){
        char.updateValueCallback(new Buffer("" + i++));
    }

}, 1000)

let Discover = require('./discover/discover')

let discover = new Discover()

//console.log(discover.getState())

*/
