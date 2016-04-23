// to enable es2015 features
'use strict';

let noble = require('noble');

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
