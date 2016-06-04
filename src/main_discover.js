// to enable es2015 features
'use strict';

console.log('[main_discover] create discover object')
let Discover = require('./discover/discover')
let discover = new Discover()

console.log('[main_discover] current power state', discover.state)

discover.on('poweredOn', function(event){
    console.log('[main_discover] discover power is on')

    let uuids = []
    let allowDuplicates = true
    
    discover.discoverPeripherals(uuids, allowDuplicates)
        .then(function(peripherals){
            // check the response / is it an array or something else
            let lightBulb = peripherals[0]
            return connectToPeripheral(lightBulb)
        })
        .then(function(peripheral){
            discoverServices(peripheral)
        })
})

if(discover.state === 'poweredOff'){
    console.log('[main_discover] set power to poweredOn')
    discover.state = 'poweredOn'
}
