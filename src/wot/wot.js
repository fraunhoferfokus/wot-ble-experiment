// to enable es2015 features
'use strict'

let Discover = require('../discover/discover')
let uuids = require('../advertise/uuids')
let ConsumedThing = require('./consumedThing')

/**
*
*   exported functions
*       - discover(ThingFilter)
*       - consumeDescription(ThingDescription)
*/
class WoT {
    constructor(){
        console.log('[WoT_API] WoT object created')
        this.discoverAPI = new Discover()
        this.pool = []
    }

    /**
    *   looks for all peripherals with an WoT Service and
    *   returns the TD
    */
    discover(filter){
        let promise = new Promise((resolve, reject) => {
            let wotServiceUUID = uuids.WoTService.uuid
            let characteristicUUID = uuids.WoTTDCharacteristic.uuid
            let consumedThingList = []

            this.discoverAPI.discoverPeripherals(wotServiceUUID)
                .then((peripherals) => {
                    let promiseList = []
                    for(let peripheral of peripherals){
                        promiseList.push(this.readThingDescription(peripheral, wotServiceUUID, characteristicUUID))
                    }

                    return Promise.all(promiseList)
                })
                .then((promiseList) => {
                    resolve(promiseList)
                })
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
            let thing = new ConsumedThing(thingDescription, this.pool, this.discoverAPI)
            resolve(thing)
        })

        return promise
    }

    /**
    *   this discovers the WoT-Services and reads the thingDescription
    */
    readThingDescription(peripheral, wotServiceUUID, characteristicUUID){
        console.log('[WoT_API] readThingDescription from')
        let promise = new Promise((resolve, reject) => {
            this.discoverAPI.connectToPeripheral(peripheral)
                .then((peripheral) => {
                    console.log('[WoT_API] discoverServices')
                    return this.discoverAPI.discoverServices(peripheral, wotServiceUUID)
                })
                .then((response) => {
                    console.log('[WoT_API] discoverCharacteristics')
                    return this.discoverAPI.discoverCharacteristics(response[0], characteristicUUID)
                })
                .then((response) => {
                    console.log('[WoT_API] readThingDescription')
                    return this.discoverAPI.readThingDescription(response[0])
                })
                .then((response) => {
                    console.log('[WoT_API] create ConsumedThing')

                    // TODO: check validate thingDescription
                    response.uris = [`gatt://${peripheral.address}/`]

                    return this.consumeDescription(response)
                })
                .then((thing) => {
                    thing.peripheral = peripheral
                    console.log('[WoT_API] disconnectFromPeripheral')
                    return this.discoverAPI.disconnectFromPeripheral(peripheral)
                        .then((peripheral) => {
                            resolve(thing)
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
                .catch((error) => {
                    reject(`[WoT_readingDescription] ${error}`)
                })
        })

        return promise
    }
}

module.exports = new WoT();
