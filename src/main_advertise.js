// to enable es2015 features
'use strict';

//let TemperaturePeripheral = require('./advertise/peripherals/TemperaturePeripheral/temperaturePeripheral')
let LightBulbPeripheral = require('./advertise/peripherals/LightBulb/lightBulbPeripheral')

console.log('[main_advertise] start advertising')
let lightbulb1 = new LightBulbPeripheral("lightbulb1")
