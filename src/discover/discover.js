// to enable es2015 features
'use strict';

let noble = require('noble');

class Discover {
    constructor(){
        noble.on('stateChange', this.stateListener.bind(this))
        noble.once('discover', this.onDiscover.bind(this))
        noble.on('scanStart', this.onStartScanner);
        noble.on('scanStop', this.onStopScanner);
    }

    stateListener(state){
        console.log("[discover] state changed to", state);

        if(state === 'poweredOn'){
            this.startScanning([], true)
        }
        else {
            noble.stopScanning();
        }
    }

    startScanning(serviceUUIDs, allowDuplicates){
        console.log('[discover] scan services')

        noble.startScanning(serviceUUIDs, allowDuplicates)
    }

    onDiscover(peripheral) {
        noble.stopScanning();

        this.peripheral = peripheral
        let self = this

        //this.printPeripheralInformations(peripheral)
        this.connectToPeripheral(this.peripheral)
            .then(function(peripheral){
                console.log('[discover] connected with ', peripheral.advertisement.localName)
            })
            .then(function(){
                //console.log('[discover] try to discover')
                //self.discoverServices(self.peripheral)
                console.log('0.0')
                return self.discoverEverything(peripheral)
            })
            .then(function(peripheralObj){
                console.log('1.0')
                let powerCharacteristic = peripheralObj.characteristics[5]
                //console.log('[onDiscover] powerCharacteristic', powerCharacteristic)
                return self.readCharacteristic(powerCharacteristic)
                    .then(function(data){
                        console.log('1.1')
                        console.log('[discover] read data', data.toString('utf8'))

                        return powerCharacteristic
                    })

                console.log('1.2')
            })
            .then(function(characteristic){
                console.log('2.0')
                if(characteristic){
                    return self.writeCharacteristic(characteristic, 'off')
                        .then(function(writeAnswer){
                            console.log('writeAnswer', writeAnswer)
                            if(writeAnswer == 'done'){
                                console.log('[discover] value written')

                                return characteristic
                            }
                            else {
                                console.log('undefined')
                                return undefined
                            }
                        })
                }
            })
            .then(function(characteristic){
                console.log('3.0')
                return self.readCharacteristic(characteristic)
                    .then(function(data){
                        console.log(data)
                        console.log('[discover] read new data', data.toString('utf8'))
                    })
            })
    }

    connectToPeripheral(peripheral){
        console.log('[discover] connect to ' + peripheral.advertisement.localName)

        let promise = new Promise(function(resolve, reject){
            peripheral.connect(function(error){
                if(error)
                    throw error;
                else
                    resolve(peripheral)
            })
        })

        return promise
    }

    discoverServices(peripheral, uuids){
        console.log('[discoverServices] discover services ' + (uuids != undefined ? uuids : 'all'))

        let serviceUUIDS = uuids || []
        let promise = new Promise(function(resolve, reject){
            peripheral.discoverServices(serviceUUIDS, function(error, services){
                if(!error){
                    services.forEach(function(service){
                        if(service.uuid != 1800 && service.uuid != 1801)
                            console.log('[discoverServices] ', service)
                    })
                }
                else
                    throw error

            })
            //console.log(peripheral)
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
                        console.log('[S ' + service.uuid + '] ', service.name)
                        console.log('[S ' + service.uuid + '] ', service.type)
                    })

                    console.log('\n[Characteristics]')
                    characteristics.forEach(function(characteristic){
                        console.log('[C ' + characteristic.uuid + '] ', characteristic.name)
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

        let promise = new Promise(function(resolve, reject){
            characteristic.read(function(error, data){
                if(!error)
                    resolve(data)
                else
                    throw error
            })
        })

        return promise
    }

    writeCharacteristic(characteristic, value){
        console.log('[discover] write characteristic value ', value)

        let promise = new Promise(function(resolve, reject){
            characteristic.write(new Buffer(value), false, (function(error, data){
                console.log('write call', data)
                if(error)
                    throw error
                else
                    resolve('done')
            }))
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

    get state(){
        return noble.state
    }

    set state(state){
        noble.state = state
    }
}

module.exports = Discover;
