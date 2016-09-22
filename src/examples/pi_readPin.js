// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')

let peripheralName = 'alpha_pi'
let pin = '13'


console.log('[Pi_readPin] read Pin example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[Pi_readPin] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// third, read the characteristic
.then(thing => {
    console.log(`[Pi_readPin] 2. read value from ${pin}`)

    return thing.getProperty(pin)
        .then(response => {
            console.log(`[Pi_readPin] 2.1 Pin ${pin}: ${response}`)
            return thing
        })
})

// last step, terminate the example
.then(() => {
    console.log(`\n\n[Pi_readPin] example out`)
    process.exit(0)
})

// if an error occures
.catch(error => {
    console.log(`[Pi_readPin] Error: ${error}`)
})
