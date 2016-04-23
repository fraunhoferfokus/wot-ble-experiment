// to enable es2015 features
'use strict';

let bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

console.log("Start advertise.js \n");

let stateListener = function(state){
  console.log("state changed to", state);

  if(state === 'poweredOn'){
    bleno.startAdvertising('echo', ['ec00']);
  }
  else {
    bleno.stopAdvertising();
  }
};

let startAdvertise = function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: 'ec00',
        characteristics: [

        ]
      })
    ]);
  }
}

bleno.on('stateChange', stateListener);
bleno.on('advertisingStart', startAdvertise);
