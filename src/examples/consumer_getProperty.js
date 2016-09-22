// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')
let peripheralName = 'alpha_light'
let property = 'PowerStatus'
// let value = '1'


console.log('[WoT_getProperty] read characteristic example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[WoT_getProperty] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// third, read the characteristic
.then(thing => {
    console.log(`[WoT_getProperty] 2. read value from ${property}`)

    return thing.getProperty(property)
        .then(response => {
            console.log(`[WoT_getProperty] 2.1 Value: ${response}`)
            return thing
        })
})

// last step, terminate the example
.then(() => {
    console.log(`\n\n[WoT_getProperty] example out`)
    process.exit(0)
})

// if an error occures
.catch(error => {
    console.log(`[WoT_getProperty] Error: ${error}`)
})
