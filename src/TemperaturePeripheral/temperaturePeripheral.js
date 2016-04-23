// to enable es2015 features
'use strict';

let bleno = require('bleno');

let SensorService = require('./sensorService');

class TemperaturePeripheral {
    constructor(name){
        this.name = name;
        this.sensorService = new SensorService();

        bleno.on('stateChange', this.stateListener.bind(this));
        bleno.on('advertisingStart', this.startAdvertise.bind(this));
    }

    stateListener(state){
        console.log("[advertise] state changed to", state);

        if(state === 'poweredOn'){
            console.log("[advertise] start");
            bleno.startAdvertising(this.name, [this.sensorService.uuid], this.onAdvertiseError.bind(this));
        }
        else {
            console.log("[advertise] stop \n");
            bleno.stopAdvertising();
        }
    }

    startAdvertise(error){
        console.log('[advertise] on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

        if (!error) {
            bleno.setServices([
                this.sensorService
            ]);
        }
    }

    onAdvertiseError(error){
        if(error)
            console.log("[advertise] error ", error);
    }
}

module.exports = TemperaturePeripheral;
