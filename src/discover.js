// to enable es2015 features
'use strict';

let noble = require('noble');

console.log("Start discover.js \n");

let stateListener = function(state){
  console.log("state changed to", state);

  if(state === 'poweredOn'){
    noble.startScanning();
  }
  else {
    noble.stopScanning();
  }
};

let discoverHandler = function(peripheral) {
  console.log("peripheral discovered:");
  console.log("id \t\t" + peripheral.id + "\n" +
              "address \t" + peripheral.address + "\n" +
              "name \t" + peripheral.advertisement.localName + "\n" +
              "services \t" + peripheral.advertisement.serviceUuids
  );
  console.log();
};

let startScanner = function(start) {
  console.log("scan started");
}

let stopScanner = function(stop) {
  console.log("scan stopped");
}


noble.on('stateChange', stateListener);
noble.on('discover', discoverHandler);
noble.on('scanStart', startScanner);
noble.on('scanStop', stopScanner);
