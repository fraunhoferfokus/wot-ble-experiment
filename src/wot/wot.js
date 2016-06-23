// to enable es2015 features
'use strict'

let Discover = require('/discover/discover')
let uuids = require('./advertise/uuids')

class WoT {
    // list of connected peripherals
    let pool
    let discoverAPI

    constructor(){
        discoverAPI = new Discover()
        pool = []
    }

    /**
    *   looks for all peripherals with an WoT Service and
    *   returns the TD
    */
    discover(filter){
        let promise = new Promise((resolve, reject) => {
            let wotServiceUUID = uuids.WoTService.uuid
            let descriptionUUID = uuids.WoTTDCharacteristic.uuid
            let consumedThingList = []

            discoverAPI.discoverPeripherals(wotServiceUUID)
                .then((peripherals) => {
                    let promiseList = []
                    for(let peripheral of peripherals){
                        promiseList.push(this.readThingDescription(peripheral, wotServiceUUID, descriptionUUID))
                    }

                    return Promise.all(promiseList)
                })
                .then(promiseList){
                    // resolve the list with the descriptions
                    resolve('list with descriptions', promiseList)
                }
                .catch((error) => {
                    reject(error)
                })
        })

        return promise
    }

    /**
    *   creates an object of ConsumedThing with the given TD
    */
    consumeDescription(thingDescription){
        let promise = new Promise((resolve, reject) => {
            let thing = new ConsumedThing(thingDescription, pool)
                .then((thing) => {
                    resolve(thing)
                })
                .catch((error) => {
                    reject(error)
                })
        })

        return promise
    }

    /**
    *   this discovers the WoT-Services and reads the thingDescription
    */
    readThingDescription(peripheral, wotServiceUUID, descriptionUUID){
        let promise = new Promise((resolve, reject) => {
            discoverAPI.connectToPeripheral(peripheral)
                .then((peripheral) => {
                    return discoverAPI.discoverServices(peripheral, wotServiceUUID)
                })
                .then((response) => {
                    return discoverAPI.discoverCharacteristics(response, descriptionUUID)
                })
                .then((response) => {
                    return discoverAPI.readThingDescription(response)
                })
                .then((response) => {
                    console.log('[WoTAPI] current Description', response)
                    // TODO: create a ConsumedThing object
                    return this.consumeDescription(response)
                })
                .then((thing) => {
                    return discoverAPI.disconnectFromPeripheral(peripheral)
                        .then((peripheral) => {
                            resolve(thing)
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(error)
                })
        })

        return promise
    }
}
