// to enable es2015 features
'use strict'

let Discover = require('/discover/discover')
let uuids = require('./advertise/uuids')

class WoT {
    // list of connected peripherals
    let pool
    let discoverAPI

    constructor(){
        let promise = new Promise((resolve, reject) => {
            discoverAPI = new Discover()
            pool = []
        })

        return promise
    }

    /**
    *   looks for all peripherals with an WoT Service and
    *   returns the TD
    */
    discover(filter){
        let promise = new Promise((resolve, reject) => {
            let wotServiceUUID = uuids.WoTService.uuid
            let thingDescriptionUUID = uuids.WoTTDCharacteristic.uuid
            let thingDescriptionList = []

            discoverAPI.discoverPeripherals(wotServiceUUID)
                .then((peripherals) => {
                    for(let peripheral of peripherals){
                        discoverAPI.discoverServices(peripheral, wotServiceUUID)
                            .then(discoverAPI.discoverCharacteristics(response, thingDescriptionUUID))
                            .then(discoverAPI.readThingDescription(response))
                            .then((response) => {
                                console.log('[WoTAPI] current Description', response)
                            })
                    }
                })

        })

        return promise
    }

    /**
    *   creates an object of ConsumedThing with the given TD
    */
    consumeDescription(td){
        let promise = new Promise((resolve, reject) => {


        })

        return promise
    }
}
