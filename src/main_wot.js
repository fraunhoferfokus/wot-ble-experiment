// to enable es2015 features
'use strict'

let wot = require('./wot/wot')

console.log('[main_wot] init wot test calls')

wot.discover()
    .then((things) => {
        console.log('[main_wot] list: ')

        return things[0]
    })
    .then((thing) => {
        thing.getProperty('softwareRevision')
            .then((response) => {
                console.log(`[main_wot] value 1: ${response}`)
            })
            .then(() => {
                thing.getProperty('softwareRevision')
                    .then((response) => {
                        console.log(`[main_wot] value 2: ${response}`)
                    })
            })
            .catch((error) => {
                console.log(`[main_wot] ${error}`)
            })
    })
    .catch((error) => {
        console.log(error)
    })
