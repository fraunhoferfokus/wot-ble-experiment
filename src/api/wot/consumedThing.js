// to enable es2015 features
'use strict'

class ConsumedThing {
    constructor(description, discoverAPI) {
        this.description = description
        this.discoverAPI = discoverAPI

        this._peripheral = {}
        this.subscribtions = []
    }

    invokeAction(actionName, parameter) {
        let promise = new Promise((resolve, reject) => {
            reject('invokeAction is not implemented')
        })

        return promise
    }

    setProperty(name, value) {
        let promise = new Promise((resolve, reject) => {
            // 1. validate data
            this.validateData(name)

            // 2. connect to peripheral
            .then(response => {
                return this.discoverAPI.connectToPeripheral(this._peripheral)
                    .then(() => {
                        return response
                    })
            })

            // 3. get characteristic
            .then(response => {
                return this.getCharacteristic(response)
            })

            // 4. own operation
            .then(response => {
                return this.discoverAPI.writeCharacteristic(response, value)
                    .then(response => {
                        return response
                    })
            })

            // 5. disconnect
            .then(response => {
                return this.discoverAPI.disconnectFromPeripheral(this._peripheral)
                    .then(() => {
                        resolve(response)
                    })
            })
            .catch(error => {
                reject(`setProperty > ${error}`)
            })
        })

        return promise
    }

    getProperty(name) {
        let promise = new Promise((resolve, reject) => {
            // 1. validate data
            this.validateData(name)

            // 2. connect to peripheral
            .then(response => {
                return this.discoverAPI.connectToPeripheral(this._peripheral)
                    .then(() => {
                        return response
                    })
            })

            // 3. get characteristic
            .then(response => {
                return this.getCharacteristic(response)
            })

            // 4. own operation
            .then(response => {
                return this.discoverAPI.readCharacteristic(response)
                    .then(response => {
                        return response
                    })
            })

            // 5. disconnect
            .then(response => {
                return this.discoverAPI.disconnectFromPeripheral(this._peripheral)
                    .then(() => {
                        resolve(response)
                    })
            })
            .catch(error => {
                reject(`getProperty > ${error}`)
            })
        })

        return promise
    }

    addListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            // 1. validate data
            this.validateData(eventName)

            // 2. connect to peripheral
            .then(response => {
                return this.discoverAPI.connectToPeripheral(this._peripheral)
                    .then(() => {
                        return response
                    })
            })

            // 3. get characteristic
            .then(response => {
                return this.getCharacteristic(response)
            })

            // 4. own operation
            .then(response => {
                response.name = eventName

                this.discoverAPI.subscribeCharacteristic(response, listener)
                this.subscribtions.push(response)

                return
            })

            .catch(error => {
                reject(`addListener > ${error}`)
            })
        })

        return promise
    }

    removeListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            let characteristic = this.subscribtions.find(char => char.name === eventName)

            if(!characteristic)
                reject(`${eventName} has no listener`)
            else {

                this.discoverAPI.unsubscribeCharacteristic(characteristic)
                .then(isUnsubscribed => {
                    if(isUnsubscribed) {
                        let subscribtionIndex = this.subscribtions.indexOf(characteristic)
                        this.subscribtions.splice(subscribtionIndex, 1)

                        if(this.subscribtions.length == 0){
                            return this.discoverAPI.disconnectFromPeripheral(this._peripheral)
                                .then(() => {
                                    resolve(`removed last subscribtion, disconnecting from peripheral`)
                                })
                        }
                        else {
                            resolve(`removed subscribtion`)
                        }
                    }
                })

                .catch(error => {
                    reject(`removeListener > ${error}`)
                })
            }
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
            if(this.description)
                resolve(this.description)
            else
                reject(`[${this.description.name}-Thing] no description available`)
        })

        return promise
    }


    /******************************************
    *
    *              Helper-Functions
    *
    ******************************************/

    /**
    *   returns the service which includes the characteristic/property
    */
    getPeripheralService(propertyServiceUUID) {
        let promise = new Promise((resolve, reject) => {
            let propertyService = this._peripheral.services.find(service => service.uuid === propertyServiceUUID)

            this.discoverAPI.discoverServices(this._peripheral, propertyServiceUUID)
                .then( response  => {
                    if(response)
                        resolve(response)
                    else
                        reject(`${propertyService} not found`)
                })
                .catch( error  => {
                    console.log(`[ConsumedThing_getPeripheralService] ${error}`)
                })
        })

        return promise
    }

    /**
    *   returns the characteristic which includes the characteristic/property value
    */
    getServiceCharacteristic(propertyService, characteristicUUID) {
        let promise = new Promise((resolve, reject) => {
                this.discoverAPI.discoverCharacteristics(propertyService, characteristicUUID)
                    .then((response) => {
                        if(response)
                            resolve(response)
                        else
                            reject(`${characteristicUUID} not found`)
                    })
                    .catch( error  => {
                        reject(error)
                    })
        })

        return promise
    }

    /**
    *   validates if name of the property and the peripheral itself exists
    */
    validateData(name) {
        let promise = new Promise((resolve, reject) => {
            // at first validate if peripheral exists
            if(!this._peripheral){
                reject(`[${this.description.name}-Thing] peripheral is ${this._peripheral}`)
            } else {
                // validate if a property with the given name exists
                let propertyObject = this.description.properties.find(property => property.name === name)
                let eventObject = this.description.events.find(property => property.name === name)

                // if exists, return it
                if(propertyObject){
                    resolve(propertyObject)
                } else if(eventObject){
                    resolve(eventObject)
                } else {
                    reject(`[${this.description.name}-Thing] ${name} not found`)
                }
            }
        })

        return promise
    }

    /**
    *   walks over all steps which are needed to interact with a characteristic
    *
    */
    getCharacteristic(tdProperty){
        let promise = new Promise((resolve, reject) => {
            // 1. split hrefs
            let hrefs = tdProperty.hrefs[0].split('/')
            let serviceUUID = hrefs[0]
            let characteristicUUID = hrefs[1]

            // 2. getPeripheralService
            this.getPeripheralService(serviceUUID)

            // 3. getServiceCharacteristic
            .then(response => {
                return this.getServiceCharacteristic(response[0], characteristicUUID)
            })

            // 4. resolve it
            .then(response => {
                if(response[0])
                    resolve(response[0])
                else
                    reject(`getCharacteristic > response[0] is ${response[0]}`)
            })
        })

        return promise
    }

    set peripheral(peripheral){
        this._peripheral = peripheral
    }
}

module.exports = ConsumedThing;
