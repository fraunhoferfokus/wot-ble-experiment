// to enable es2015 features
'use strict';

//let TemperaturePeripheral = require('./advertise/peripherals/TemperaturePeripheral/temperaturePeripheral')
let LightBulbPeripheral = require('./provider/peripherals/LightBulb/lightBulbPeripheral')
let uuids = require('./provider/uuids')

console.log('[main_advertise] start advertising')
let lightbulb1 = new LightBulbPeripheral("lightbulb1", uuids)

console.log('[main_advertise] bleno state', lightbulb1.state)
lightbulb1.state = 'poweredOn'
