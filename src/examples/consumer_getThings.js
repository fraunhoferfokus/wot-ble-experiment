// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')

console.log('[WoT_getThings] get things example')

// first, discover all available peripherals with a thing description
wot.discover()

.then(discoveredPeripherals => {
    console.log(`[WoT_getThings] peripherals:`)
    console.log(JSON.stringify(discoveredPeripherals[0].description));
})

// last step, terminate the example
.then(() => {
    console.log(`\n\n[WoT_getThings] example out`)
    process.exit(0)
})

// if an error occures
.catch(error => {
    console.log(`[WoT_getThings] Error: ${error}`)
})
