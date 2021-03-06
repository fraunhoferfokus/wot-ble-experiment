// to enable es2015 features
'use strict';

const EventEmitter = require('events')
let noble = require('noble')
let cbor = require('cbor')

class Discover {
    constructor(){
        this.emitter = new EventEmitter()
        noble.on('stateChange', this.stateListener.bind(this))
        noble.on('scanStart', this.onStartScanner)
        noble.on('scanStop', this.onStopScanner)
    }

    stateListener(state){
        console.log("[discover] state changed to", state);

        if(state === 'poweredOn'){
            //this.startScanning([], true)
            this.emitter.emit('poweredOn')
        }
        else {
            noble.stopScanning();
        }
    }

    startScanning(serviceUUIDs, allowDuplicates){
        console.log('[discover] scan services ' + serviceUUIDs + ' ' + allowDuplicates)

        noble.startScanning(serviceUUIDs, allowDuplicates, (error) => {
            // error has the value true
            if(!error)
                console.log('[discover] scanner error', error)
        })
    }

    discoverPeripherals(serviceUUIDs, allowDuplicates){
        console.log('[discover] discover peripherals')

        let suuids = serviceUUIDs || []
        let duplicates = allowDuplicates || false

        let promise = new Promise((resolve, reject) => {
            this.activateScanner()
                .then(() => {
                    noble.once('discover', (response) => {
                        console.log('[discover] discovered peripherals')
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

        //this.printPeripheralInformations(peripheral)
        this.connectToPeripheral(this.peripheral)
            .then((peripheral) => {
                console.log('[discover] connected with ', peripheral.advertisement.localName)
            })
            .then(() => {
                return self.discoverEverything(peripheral)
            })
            .then((peripheralObj) => {
                let powerCharacteristic = peripheralObj.characteristics[6]

                return self.readCharacteristic(powerCharacteristic)
                    .then((data) => {
                        //console.log('[discover] read data', JSON.parse(data.toString('utf8')))

                        return powerCharacteristic
                    })
            })
    }

    connectToPeripheral(peripheral){
        console.log('[discover] connect to ' + peripheral.advertisement.localName)

        let promise = new Promise(function(resolve, reject){
            peripheral.connect((error) => {
                if(error)
                    throw error;
                else
                    resolve(peripheral)
            })
        })

        return promise
    }

    disconnectFromPeripheral(peripheral){
        console.log('[discover] disconnect from ' + peripheral.advertisement.localName)

        let promise = new Promise(function(resolve, reject){
            peripheral.disconnect((error) => {
                if(error)
                    reject(error)
                else
                    resolve(peripheral)
            })
        })

        return promise
    }

    discoverServices(peripheral, uuids){
        console.log('[discover] discover services ' + (uuids != undefined ? uuids : 'all'))

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

    discoverCharacteristics(service, uuids){
        console.log('[discover] discover characteristics ' + (uuids != undefined ? uuids : 'all'))

        let characteristicUUIDS = uuids || []

        let promise = new Promise((resolve, reject) => {
            service.discoverCharacteristics(characteristicUUIDS, (error, characteristics) => {
                if(!error)
                    resolve(characteristics)
                else
                    throw error

            })

        })

        return promise
    }

    discoverEverything(peripheral){
        console.log('[discover] discover all services and characteristics from ' + peripheral.advertisement.localName)

        let promise = new Promise(function(resolve, reject){
            peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics){
                if(!error){
                    console.log('[discover] everything discovered')
                    console.log('[discover] services: ', services.length)
                    console.log('[discover] characteristics: ', characteristics.length + '\n')

                    console.log('[Services]')
                    services.forEach(function(service){
                        console.log('[S ' + service.uuid + '] name', service.name)
                        console.log('[S ' + service.uuid + '] type', service.type)
                    })

                    console.log('\n[Characteristics]')
                    characteristics.forEach(function(characteristic){
                        console.log('[C ' + characteristic.uuid + '] name', characteristic.name)
                    })

                    let peripheralObj = {}
                    peripheralObj.obj = peripheral
                    peripheralObj.services = services
                    peripheralObj.characteristics = characteristics

                    resolve(peripheralObj)
                }
                else
                    throw error

            })
        })

        return promise
    }

    readCharacteristic(characteristic){
        console.log('[discover] read characteristic')

        let promise = new Promise((resolve, reject) => {
            characteristic.read((error, data) => {
                if(!error){
                    resolve(data)
                }
                else
                    throw error
            })
        })

        return promise
    }

    readCborCharacteristic(characteristic){
        console.log('[discover] read cbor characteristic')

        let promise = new Promise((resolve, reject) => {
            this.readCharacteristic(characteristic)
                .then((characteristicValue) => {

                    cbor.decodeFirst(characteristicValue, function(error, obj) {
                        if(error !== null)
                            throw error
                        else
                            resolve(obj)
                    })
                })
                .catch((error) => {
                    console.log('readCbor ', error)
                })
        })

        return promise
    }

    readThingDescription(characteristic){
        console.log('[discover] read thing description')

        let promise = new Promise((resolve, reject) => {
            this.readCborCharacteristic(characteristic)
                .then((data) => {

                    // check if the data is the TD in json format
                    // use it earlier, at this time it is already a json object
                    if(this.isJSON(data))
                        resolve(data)
                    else {
                        this.loadDescriptionFromURL(data)
                            .then((data) => {
                                resolve(data)
                            })
                    }


                })
                .catch((error) => {
                    console.log(error)
                })
        })

        return promise
    }

    writeCharacteristic(characteristic, value){
        console.log('[discover] write characteristic value ', value)

        let promise = new Promise(function(resolve, reject){
            characteristic.write(new Buffer(value), false, (function(error, data){
                if(error)
                    throw error
                else
                    resolve('done')
            }))
        })

        return promise
    }

    subscribeCharacteristic(characteristic){
        console.log('[discover] subscribe to ', characteristic.uuid)

        characteristic.notify(true, function(error){
            if(error)
                throw error
            else {
                console.log('notify response', error)
            }
        })

        characteristic.once('notify', function(response){
            if(response)
                console.log('on ' + characteristic.uuid + ' subscribed')
        })

        characteristic.on('read', this.onNotify.bind(this))
        this.characteristic = characteristic
    }

    onNotify(data, isNotification){
        console.log('isNotification', isNotification)
        if( data.toString('utf8') <= 10)
            console.log('notification ', data.toString('utf8'))
        else {
            this.unsubscribeCharacteristic(this.characteristic)
        }
    }

    unsubscribeCharacteristic(characteristic){
        characteristic.notify(false, function(error){
            if(error)
                throw error
            else {
                console.log('notify response', error)
            }
        })
    }

    activateScanner(){
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
        console.log("[discover] scan started");
    }

    onStopScanner(stop) {
        console.log("[discover] scan stopped");
    }

    printPeripheralInformations(peripheral){
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
            reject('LoaderNotImplemented')
        })

        return promise
    }

    isJSON(jsonString){
        let isJSON = false

        if(typeof jsonString != 'string' )
            isJSON = true

        return isJSON
    }

    on(event, callback){
        this.emitter.on(event, callback)
    }

    get state(){
        return noble.state
    }

    set state(state){
        noble.state = state
    }
}

module.exports = Discover;
