// to enable es2015 features
'use strict';

let bleno = require('bleno');
let BlenoPrimaryService = bleno.PrimaryService;

let stateListener = function(state){
    console.log("[advertise] state changed to", state);

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
                characteristics: []
            })
        ]);
    }
};

console.log("[advertise] start \n");
bleno.on('stateChange', stateListener);
bleno.on('advertisingStart', startAdvertise);
