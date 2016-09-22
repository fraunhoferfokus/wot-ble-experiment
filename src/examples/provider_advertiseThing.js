// to enable es2015 features
'use strict';

/**
*   Description:
*   This file demonstrates the usage of the
*   wot_provider API. In this case a thing with type lightbulb
*   will be created and advertised.
*
*   Necessary steps:
*     1. wot.newThing(type, name) - creates a thing with the given type
*     2. wot.expose(thing)        - starts the advertising of the thing
*/

let wot = require('../api/wot/wot_provider')

// let type = 'lightbulb'
// let name = 'alpha_light'

let type = 'piGPIO'
let name = 'alpha_pi'

console.log(`[main_advertise] create ${name} by type: ${type}`)

// first, create new thing with type and name
wot.newThing(type, name)

// second, returns the thing with the passed type
.then(thing => {
    console.log(`[main_advertise] thing created`)
    return thing
})

// third, expose the passed thing
.then(thing => {
    console.log(`[main_advertise] start advertising`)
    return wot.expose(thing)
})

// fourth, the passed value indicates if the object will be advertised at the moment
.then(onAdvertising => {
    console.log(`[main_advertise] onAdvertising: ${onAdvertising}`)
})

// last, return the error if occures
.catch(error => {
    console.log(error)
})
