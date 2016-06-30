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
        .then((peripherals) => {
            // check the response / is it an array or something else
            console.log('[main_discover] peripherals discovered')

            if(Array.isArray(peripherals)){
                // do something
                console.log('[main_discover] list of peripherals', peripherals)
            }
            else {
                console.log('[main_discover] connect to peripheral', peripherals)

                let lightBulb = peripherals
                return discover.connectToPeripheral(lightBulb)
            }
        })
        .then((peripheral) => {
            discover.discoverServices(peripheral)
                .then((services) => {
                    console.log('[main_discover] discovered services', services.length)

                    for(let service of services){
                        console.log('service_id: ', service.uuid)

                        if(service.uuid == 'f100'){
                            console.log('[main_discover] WoT Service found')

                            discover.discoverCharacteristics(service)
                                .then((characteristics) => {
                                    for(let characteristic of characteristics){
                                        if(characteristic.uuid === '7777777777777777111111111f030100')
                                            discover.readThingDescription(characteristic)
                                                .then((response) => {
                                                    console.log('[main_discover] value ', response)
                                                })
                                                .catch((error) => {
                                                    console.log('error', error)
                                                })
                                    }
                                })

                        }
                    }


                })
        })
})

if(discover.state === 'poweredOff'){
    console.log('[main_discover] set power to poweredOn')
    discover.state = 'poweredOn'
}
