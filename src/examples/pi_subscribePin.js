// to enable es2015 features
'use strict'

let wot = require('../api/wot/wot_consumer')

let peripheralName = 'alpha_pi'
let pin = '13'
let duration = 20000


console.log('[Pi_subscribePin] subscribe Pin example')

// first, discover all available peripherals with a thing description
wot.discover()

// second, select a peripheral from the list
.then(discoveredPeripherals => {
    console.log(`[Pi_subscribePin] 1. select ${peripheralName}`)

    let thing = discoveredPeripherals.find(x => x._peripheral.advertisement.localName === peripheralName)

    return thing
})

// subscribe to powerCharacteristic
.then(thing => {
    console.log(`[Pi_subscribePin] 2. add listener`)

    thing.addListener(pin, event => {
        console.log(`[Pi_subscribePin] \tPin ${pin} new value: ${event}`)
    })

    return thing
})

//
.then(thing => {
    console.log(`[Pi_subscribePin] 3. start timer to remove listener in the end`)

    return setTimeout(() => {
        console.log(`[Pi_subscribePin] remove listener`)

        return thing.removeListener(pin)
            .then(response => {
                console.log(`[Pi_subscribePin] ${response}`)
            })

            // last step, terminate the example
            .then(() => {
                console.log(`\n\n[Pi_subscribePin] example out`)
                process.exit(0)
            })
    }, duration);
})

// if an error occures
.catch(error => {
    console.log(`[Pi_subscribePin] Error: ${error}`)
})
