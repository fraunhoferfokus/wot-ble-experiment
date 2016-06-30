// to enable es2015 features
'use strict'

let wot = require('./wot/wot')

console.log('[main_wot] init wot test calls')

wot.discover()
    .then((things) => {
        return things[0]
    })
    .then((thing) => {
        thing.getProperty('softwareRevision')
            .then((response) => {
                console.log(`[main_wot] value 1: ${response}`)
            })
    })
    .catch((error) => {
        console.log(error)
    })
