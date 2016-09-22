// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')
let peripheralName = 'alpha_light'
let property = 'PowerStatus'
let value = 'off'
let duration = 5000

console.log('[WoT_subscribeEvent] subscribe event example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[WoT_subscribeEvent] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// subscribe to powerCharacteristic
.then(thing => {
    console.log(`[WoT_subscribeEvent] 2. add listener`)
    
    thing.addListener('counterExample', event => {
        console.log(`[WoT_subscribeEvent] \tevent received ${event}`)
    })

    return thing
})

//
.then(thing => {
    console.log(`[WoT_subscribeEvent] 3. start timer to remove listener in the end`)

    return setTimeout(() => {
        console.log(`[WoT_subscribeEvent] remove listener`)

        return thing.removeListener('counterExample')
            .then(response => {
                console.log(`[WoT_subscribeEvent] ${response}`)
            })

            // last step, terminate the example
            .then(() => {
                console.log(`\n\n[WoT_subscribeEvent] example out`)
                process.exit(0)
            })
    }, duration);
})

// if an error occures
.catch(error => {
    console.log(`[WoT_subscribeEvent] Error: ${error}`)
})
