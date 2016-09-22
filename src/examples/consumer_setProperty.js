// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')
let peripheralName = 'alpha_light'
let property = 'PowerStatus'
let value = 'off'

console.log('[WoT_setProperty] set characteristic example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[WoT_setProperty] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// third, set the characteristic
.then(thing => {
    console.log(`[WoT_setProperty] 3. set value from ${property} to ${value}`)

    return thing.setProperty(property, value)
        .then(response => {
            return thing
        })
})

// last step, terminate the example
.then(() => {
    console.log(`\n\n[WoT_setProperty] example out`)
    process.exit(0)
})

// if an error occures
.catch(error => {
    console.log(`[WoT_setProperty] Error: ${error}`)
})
