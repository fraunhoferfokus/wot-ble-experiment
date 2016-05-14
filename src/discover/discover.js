// to enable es2015 features
'use strict';

let noble = require('noble');

class Discover {
    constructor(){
        noble.on('stateChange', this.stateListener.bind(this))
        noble.once('discover', this.discoverHandler);
        noble.on('scanStart', this.onStartScanner);
        noble.on('scanStop', this.onStopScanner);
    }

    stateListener(state){
        console.log("[discover] state changed to", state);

        if(state === 'poweredOn'){
            this.startScanning([], true)
            //noble.startScanning();
        }
        else {
            noble.stopScanning();
        }
    }

    startScanning(serviceUUIDs, allowDuplicates){
        console.log('[discover] scan services')
        noble.startScanning(serviceUUIDs, allowDuplicates)
    }

    discoverHandler(peripheral) {
        console.log("\n[discover] peripheral discovered: \n");
        console.log("[peripheral] id \t"        + peripheral.id + "\n" +
                    "[peripheral] address \t"   + peripheral.address + "\n" +
                    "[peripheral] name \t"      + peripheral.advertisement.localName + "\n" +
                    "[peripheral] services \t"  + peripheral.advertisement.serviceUuids + "\n" +
                    "[peripheral] object \n"    + peripheral
        );

        console.log();
    }

    onStartScanner(start) {
        console.log("[discover] scan started");
    }

    onStopScanner(stop) {
        console.log("[discover] scan stopped");
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
