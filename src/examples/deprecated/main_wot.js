// to enable es2015 features
'use strict'

let wot = require('../wot/wot_consumer')

console.log('[main_wot] init wot test calls')

wot.consumeDescriptionUri('https://fraunhoferfokus.github.io/wot-ble-experiment/lightbulb_description.json')
  .then(response => {
    console.log('repsonse from reading URL', response)
  })

/*wot.discover()
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
                return thing
            })
    })

    // subscribe to powerCharacteristic
    .then(thing => {
        thing.addListener('counterExample', (event) => {
            console.log(`event received ${event}`)
        })

        return thing
    })

    //
    .then(thing => {
        return setTimeout(() => {
            console.log(`removing listener`)
            return thing.removeListener('counterExample')
                .then(() => {
                    console.log('listener removed successfully')
                })
                .catch(error => {
                    console.log(error)
                })

        }, 5000);
    })
    // error handling
    .catch(error => {
        console.log(`main_wot > ${error}`)
    })
*/
