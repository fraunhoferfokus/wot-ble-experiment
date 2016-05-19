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

        this.printPeripheralInformations(peripheral)
        this.connectToPeripheral(this.peripheral)
            .then(function(peripheral){
                console.log('[discover] connected with ', peripheral.advertisement.localName)
                //console.log('[discover] peripheral after connect ', peripheral)
                //return peripheral
            })
            .then(function(){
                //console.log('[discover] try to discover')
                //self.discoverServices(self.peripheral)
                self.discoverEverything(peripheral)
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
                    })

                    console.log('\n[Characteristics]')
                    characteristics.forEach(function(characteristic){
                        console.log('[C ' + characteristic.uuid + '] ', characteristic.name)
                    })
                }
                else
                    throw error

            })
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


/*
let stateListener = function(state){
  console.log("[discover] state changed to", state);

  if(state === 'poweredOn'){
      noble.startScanning();
  }
  else {
      noble.stopScanning();
  }
};

let discoverHandler = function(peripheral) {
    console.log("\n[discover] peripheral discovered: \n");
    console.log("[peripheral] id \t"        + peripheral.id + "\n" +
                "[peripheral] address \t"   + peripheral.address + "\n" +
                "[peripheral] name \t"      + peripheral.advertisement.localName + "\n" +
                "[peripheral] services \t"  + peripheral.advertisement.serviceUuids + "\n" +
                "[peripheral] object \n"    + peripheral
    );

    console.log();
};

let startScanner = function(start) {
    console.log("[discover] scan started");
}

let stopScanner = function(stop) {
    console.log("[discover] scan stopped");
}

console.log("[discover] start");
noble.on('stateChange', stateListener);
noble.on('discover', discoverHandler);
noble.on('scanStart', startScanner);
noble.on('scanStop', stopScanner);
*/
