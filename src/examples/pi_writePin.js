// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')

let peripheralName = 'alpha_pi'
let pin = '13'
let value = '1'


console.log('[Pi_writePin] write Pin example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[Pi_writePin] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// third, read the characteristic
.then(thing => {
    console.log(`[Pi_writePin] 2. write value from ${pin} to ${value}`)

    return thing.setProperty(pin, value)
        .then(response => {
            console.log(`[Pi_writePin] 2.1 Pin ${pin}: ${response}`)
            return thing
        })
})

// last step, terminate the example
.then(() => {
    console.log(`\n\n[Pi_writePin] example out`)
    process.exit(0)
})

// if an error occures
.catch(error => {
    console.log(`[Pi_writePin] Error: ${error}`)
})
