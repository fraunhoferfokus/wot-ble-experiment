// to enable es2015 features
'use strict';

const EventEmitter = require('events')
let noble = require('noble')
let cbor = require('cbor')
let request = require('request')

class Discover {

    constructor() {
        this.emitter = new EventEmitter()
        noble.on('stateChange', this.stateListener.bind(this))
        noble.on('scanStart', this.onStartScanner)
        noble.on('scanStop', this.onStopScanner)
    }

    stateListener(state) {
        if(state === 'poweredOn'){
            //this.startScanning([], true)
            this.emitter.emit('poweredOn')
        }
        else {
            console.log(`[discover] state problem: ${state}`);
            noble.stopScanning();
        }
    }

    startScanning(serviceUUIDs, allowDuplicates) {
        noble.startScanning(serviceUUIDs, allowDuplicates, (error) => {
            // error has the value true
            if(!error)
                console.log('[discover] scanner error', error)
        })
    }

    discoverPeripherals(serviceUUIDs, allowDuplicates) {
        let suuids = serviceUUIDs || []
        let duplicates = allowDuplicates || false

        let promise = new Promise((resolve, reject) => {
            this.activateScanner()
                .then(() => {
                    noble.once('discover', response => {
                        noble.stopScanning()
                        resolve([response])
                    })

                    this.startScanning(suuids, duplicates)
                })
        })

        return promise
    }

    onDiscover(peripheral) {
        noble.stopScanning()
        this.peripheral = peripheral
        let self = this

        this.connectToPeripheral(this.peripheral)
            .then(() => {
                return self.discoverEverything(peripheral)
            })
            .then(peripheralObj => {
                let powerCharacteristic = peripheralObj.characteristics[6]

                return self.readCharacteristic(powerCharacteristic)
                    .then(data => {
                        return powerCharacteristic
                    })
            })
    }

    connectToPeripheral(peripheral) {
        let promise = new Promise((resolve, reject) => {
            peripheral.connect(error => {
                if(error)
                    reject(error);
                else
                    resolve(peripheral)
            })
        })

        return promise
    }

    disconnectFromPeripheral(peripheral) {
        let promise = new Promise((resolve, reject) => {
            peripheral.disconnect(error => {
                if(error)
                    reject(error)
                else
                    resolve(peripheral)
            })
        })

        return promise
    }

    discoverServices(peripheral, uuids) {
        let serviceUUIDS = uuids || []
        let promise = new Promise((resolve, reject) => {
            peripheral.discoverServices(serviceUUIDS, (error, services) => {
                if(!error){
                    resolve(services)
                }
                else
                    throw error

            })
        })

        return promise
    }

    discoverCharacteristics(service, uuids) {
        let characteristicUUIDS = uuids || []

        let promise = new Promise((resolve, reject) => {
            service.discoverCharacteristics(characteristicUUIDS, (error, characteristics) => {
                if(!error)
                    resolve(characteristics)
                else
                    reject(error)
            })
        })

        return promise
    }

    discoverEverything(peripheral) {
        console.log('[discover] discover all services and characteristics from ' + peripheral.advertisement.localName)

        let promise = new Promise(function(resolve, reject) {
            peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
                if(!error) {
                    console.log('[discover] everything discovered')
                    console.log('[discover] services: ', services.length)
                    console.log('[discover] characteristics: ', characteristics.length + '\n')

                    console.log('[Services]')
                    services.forEach(service => {
                        console.log('[S ' + service.uuid + '] name', service.name)
                        console.log('[S ' + service.uuid + '] type', service.type)
                    })

                    console.log('\n[Characteristics]')
                    characteristics.forEach(characteristic => {
                        console.log('[C ' + characteristic.uuid + '] name', characteristic.name)
                    })

                    let peripheralObj = {}
                    peripheralObj.obj = peripheral
                    peripheralObj.services = services
                    peripheralObj.characteristics = characteristics

                    resolve(peripheralObj)
                }
                else
                    reject(error)

            })
        })

        return promise
    }

    readCharacteristic(characteristic) {
        let promise = new Promise((resolve, reject) => {
            characteristic.read((error, data) => {
                if(!error){
                    resolve(data)
                }
                else
                    reject(error)
            })
        })

        return promise
    }

    readCborCharacteristic(characteristic) {
        let promise = new Promise((resolve, reject) => {
            this.readCharacteristic(characteristic)
                .then(characteristicValue => {

                    cbor.decodeFirst(characteristicValue, (error, obj) => {
                        if(error !== null)
                            reject(error)
                        else
                            resolve(obj)
                    })
                })
                .catch(error => {
                    reject(error)
                })
        })

        return promise
    }

    readThingDescription(characteristic) {
        let promise = new Promise((resolve, reject) => {
            this.readCborCharacteristic(characteristic)
                .then(data => {

                    // check if the data is the TD in json format
                    // use it earlier, at this time it is already a json object
                    if(this.isJSON(data))
                        resolve(data)
                    else {
                        this.loadDescriptionFromURL(data)
                            .then(data => {
                                resolve(data)
                            })
                            .catch(error => {
                              reject(`readThingDescription > ${error}`)
                            })
                    }
                })
                .catch(error => {
                    reject(`readThingDescription > ${error}`)
                })
        })

        return promise
    }

    writeCharacteristic(characteristic, value) {
        let promise = new Promise((resolve, reject) => {
            characteristic.write(new Buffer(value), false, ((error, data) => {
                if(error)
                    reject(error)
                else
                    resolve('done')
            }))
        })

        return promise
    }

    subscribeCharacteristic(characteristic, listener) {
        characteristic.subscribe(error => {
            if(error)
                throw error
        })

        // characteristic.once('notify', response => {
        //     if(response)
        //         console.log('on ' + characteristic.uuid + ' subscribed')
        // })

        characteristic.on('read', listener)
        this.characteristic = characteristic
    }

    onNotify(data, isNotification) {
        console.log('[discover] isNotification', isNotification)
        console.log('[discover] notification ', data.toString('utf8'))
    }

    unsubscribeCharacteristic(characteristic) {
        let promise = new Promise(function(resolve, reject) {
            characteristic.unsubscribe(error => {
                if(error)
                    reject(`unsubscribeCharacteristic > Error: ${error}`)
                else {
                    resolve(true)
                }
            })
        });

        return promise;
    }

    activateScanner() {
        let promise = new Promise((resolve, reject) => {
            if(this.state === 'poweredOn'){
                resolve()
            }
            else {
                this.on('poweredOn', (event) => {
                    resolve()
                })

                this.state = 'poweredOn'
            }
        })

        return promise
    }

    onStartScanner(start) {
        // console.log("[discover] scan started");
    }

    onStopScanner(stop) {
        // console.log("[discover] scan stopped");
    }

    printPeripheralInformations(peripheral) {
        console.log('\n[discover] peripheral discovered:');
        console.log('[peripheral] id \t'        + peripheral.id + '\n' +
                    '[peripheral] address \t'   + peripheral.address + '\n' +
                    '[peripheral] name \t'      + peripheral.advertisement.localName + '\n' +
                    '[peripheral] services \t'  + peripheral.advertisement.serviceUuids + '\n' +
                    '[peripheral] raw object \n'+ peripheral + '\n'
        )
    }

    loadDescriptionFromURL(url) {
        let promise = new Promise((resolve, reject) => {
            console.log(`read url ${url}`)

            request({
                url: url,
                json: true
            }, (error, response, body) => {
                if(!error && response.statusCode === 200)
                  resolve(body)
                else {
                  reject(`loadDescriptionFromURL > Error: ${error}`)
                }
            })
        })

        return promise
    }

    isJSON(jsonString) {
        let isJSON = false

        if(typeof jsonString != 'string' )
            isJSON = true

        return isJSON
    }

    on(event, callback) {
        this.emitter.on(event, callback)
    }

    get state() {
        return noble.state
    }

    set state(state) {
        noble.state = state
    }
}

module.exports = Discover;
