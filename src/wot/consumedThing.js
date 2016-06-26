// to enable es2015 features
'use strict'

class ConsumedThing {
    constructor(description, pool, discoverAPI) {
        console.log(`[${description.name}-Thing] constructor`)
        this.pool = pool
        this.description = description
        this.discoverAPI = discoverAPI
        this._peripheral = {}
    }

    invokeAction(actionName, parameter) {
        let promise = new Promise((resolve, reject) => {
            reject('invokeAction is not implemented')
        })

        return promise
    }

    setProperty(name, value) {
        let promise = new Promise((resolve, reject) => {
            reject('setProperty is not implemented')
        })

        return promise
    }

    getProperty(name) {
        let promise = new Promise((resolve, reject) => {
            console.log(`[${this.description.name}-Thing] getProperty ${name}`)

            let serviceUUID = ''
            let characteristicUUID = ''

            this.discoverAPI.connectToPeripheral(this._peripheral)
                .then(() => {
                    return this.checkName(name)
                })
                .then((response) => {
                    serviceUUID = response.hrefs[0]
                    characteristicUUID = response.hrefs[1]

                    return this.getPeripheralService(serviceUUID)
                })
                .then((response) => {
                    return this.getServiceCharacteristic(response[0], characteristicUUID)
                })
                .then((response) => {
                    return this.discoverAPI.readCharacteristic(response[0])
                        .then((response) => {
                            return response
                        })
                })
                .then((response) => {
                    this.discoverAPI.disconnectFromPeripheral(this._peripheral)
                        .then(() => {
                            resolve(response)
                        })
                })
                .catch((error) => {
                    console.log(`[${this.description.name}-Thing_getProperty] ${error}`)
                })
        })

        return promise
    }

    addListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            reject('addListener is not implemented')
        })

        return promise
    }

    removeListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            reject('removeListener is not implemented')
        })

        return promise
    }

    removeAllListeners(eventName) {
        let promise = new Promise((resolve, reject) => {
            reject('removeAllListeners is not implemented')
        })

        return promise
    }

    getDescription() {
        let promise = new Promise((resolve, reject) => {
            resolve(description)
        })

        return promise
    }


    /******************************************
    *
    *              Helper-Functions
    *
    ******************************************/
    addToPool(peripheral){

    }

    removeFromPool(peripheral){

    }

    /**
    *   checks if the name exists in the description
    */
    checkName(name) {
        console.log(`[${this.description.name}-Thing] checkName ${name}`)

        let promise = new Promise((resolve, reject) => {
            let propertyObject = this.description.properties.find(property => property.name === name)
            console.log(`[${this.description.name}-Thing] property ${propertyObject}`)

            if(propertyObject)
                resolve(propertyObject)
            else
                reject(`${name} not found`)
        })

        return promise
    }

    /**
    *   returns the service which includes the characteristic/property
    */
    getPeripheralService(propertyServiceUUID) {
        console.log(`[${this.description.name}-Thing] getPeripheralService ${propertyServiceUUID}`)

        let promise = new Promise((resolve, reject) => {
            let propertyService = this._peripheral.services.find(service => service.uuid === propertyServiceUUID)

            this.discoverAPI.discoverServices(this._peripheral, propertyServiceUUID)
                .then((response) => {
                    if(response)
                        resolve(response)
                    else
                        reject(`${propertyService} not found`)
                })
                .catch((error) => {
                    console.log(`[ConsumedThing_getPeripheralService] ${error}`)
                })
        })

        return promise
    }

    /**
    *   returns the characteristic which includes the characteristic/property value
    */
    getServiceCharacteristic(propertyService, characteristicUUID) {
        console.log(`[${this.description.name}-Thing] getServiceCharacteristic ${characteristicUUID}`)

        let promise = new Promise((resolve, reject) => {
                this.discoverAPI.discoverCharacteristics(propertyService, characteristicUUID)
                    .then((response) => {
                        if(response)
                            resolve(response)
                        else
                            reject(`${characteristicUUID} not found`)
                    })
                    .catch((error) => {
                        reject(error)
                    })
        })

        return promise
    }

    set peripheral(peripheral){
        console.log('setperipheral')
        this._peripheral = peripheral
    }
}

module.exports = ConsumedThing;
