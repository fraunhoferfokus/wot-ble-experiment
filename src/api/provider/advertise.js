// to enable es2015 features
'use strict';

const uuids = require('./uuids')

let bleno = require('bleno')

// peripherals
let LightBulbPeripheral = require('./peripherals/LightBulb/lightBulbPeripheral')
let GPIOPeripheral = require('./peripherals/PiGPIO/gpioPeripheral')

/**
*   available functions
*       - newThing(name)
*       - expose(thing)
*/
class Advertise {
    constructor(){
        this.availablePeripherals = [
            { type: 'lightbulb', create: this.createLightbulb },
            { type: 'piGPIO', create: this.createPiGPIO },
        ]

        //bleno.on('servicesSetError', this.setServiceError)
        bleno.on('advertisingStartError', function(error) {
            console.log('[advertise] advertisingStart: ' + (error ? ' error' + error : 'success'));
        });
    }

    newThing(type, name) {
        let promise = new Promise((resolve, reject) => {

            // 1. check if type exists
            let peripheral = this.availablePeripherals.find(x => x.type === type)

            // 2. return new Object of it
            if( peripheral ) {
                let peripheralObject = peripheral.create(name)
                resolve(peripheralObject)
            }
            else {
                reject(`newThing > type not found ${type}, available types: ${JSON.stringify(this.availablePeripherals)}`)
            }
        })

        return promise
    }

    expose(thing) {
        let promise = new Promise((resolve, reject) => {
            // 1. activate bluetooth
            this.activateBluetooth()

            // 2. advertise passed thing
            .then(isActive => {
                return this.startAdvertising(thing)
            })

            // 3. return a flag
            .then(onAdvertising => {
                if(onAdvertising)
                    resolve(true)
            })

            // reject if an error occures
            .catch(error => {
              reject(`expose > ${error}`)
            })
        })

        return promise;
    }

    startAdvertising(thing) {
        let promise = new Promise((resolve, reject) => {

            // second step: set the services which should be provided
            bleno.on('advertisingStart', error => {
                if(!error) {
                    bleno.setServices(thing.services, this.setServiceError)
                    resolve(true)
                }
                else {
                    console.log("[advertise] stop advertising");
                    bleno.stopAdvertising();
                    reject(`startAdvertising > Error: ${error}`)
                }
            })

            // first step: start advertising of the passed thing
            // console.log(thing)
            // console.log('start advertise', thing.serviceUUIDs)
            bleno.startAdvertising(thing.name, thing.serviceUUIDs);
        })

        return promise
    }

    activateBluetooth() {
        let promise = new Promise((resolve, reject) => {
            bleno.once('stateChange', state => {
                if(state === 'poweredOn')
                    resolve()
                else
                    reject(`activateBluetooth > Error: ${state}`)
            })

            // set state to active
            this.state = 'poweredOn';
        })

        return promise
    }

    createLightbulb(name) {
        return new LightBulbPeripheral(name, uuids)
    }

    createPiGPIO(name) {
        return new GPIOPeripheral(name, uuids)
    }

    /**
    *
    *   Helper functions
    */
    stateListener(state){
        console.log('state ', state)
        if(state !== 'poweredOn'){
            console.log(`state change occured ${state}`)
        }
    }

    setServiceError(error) {
        if(error)
          console.log(`Error on set services: ${error}`);
    }

    isInactive(){
        let inactive = true

        if(this.state === 'poweredOn')
          inactive = false

        return inactive
    }

    get state(){
        return bleno.state
    }

    set state(state){
        bleno.state = state
    }
}

module.exports = Advertise
