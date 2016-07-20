// to enable es2015 features
'use strict'

let wot = require('./wot/wot')

console.log('[main_wot] init wot test calls')

wot.discover()
    .then(things => {
        return things[0]
    })

    // get characteristic
    .then(thing => {
        return thing.getProperty('PowerStatus')
            .then(response => {
                console.log(`[main_wot] value 1: ${response}`)
                return thing
            })
    })

    // set characteristic
    .then(thing => {
        return thing.setProperty('PowerStatus', 'off')
            .then(response => {
                console.log(`[main_wot] value written`)
                return thing
            })
    })

    // get characteristic
    .then(thing => {
        return thing.getProperty('PowerStatus')
            .then(response => {
                console.log(`[main_wot] value 1: ${response}`)
            })
    })
    .catch(error => {
        console.log(error)
    })
