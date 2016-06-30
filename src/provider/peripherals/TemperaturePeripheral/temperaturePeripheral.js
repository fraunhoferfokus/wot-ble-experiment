// to enable es2015 features
'use strict';

let bleno = require('bleno');

let SensorService = require('./sensorService');
//let sensorService = new SensorService();

class TemperaturePeripheral {
    constructor(name){
        this.name = name;
        this.sensorService = new SensorService();

        bleno.on('stateChange', this.stateListener.bind(this));
        bleno.on('advertisingStart', this.startAdvertise.bind(this));

        bleno.on('servicesSet', function(error) {
            console.log('[advertise] servicesSet: ' + (error ? 'error' + error : 'success'));
        });

        bleno.on('servicesSetError', function(error) {
            console.log('[advertise] servicesSetError: ' + (error ? 'error' + error : 'success'));
        });
    }

    stateListener(state){
        console.log("[advertise] state changed to", state);

        if(state === 'poweredOn'){
            console.log("[advertise] start advertising");
            
            bleno.startAdvertising(this.name,
                [this.sensorService.uuid],
                this.onAdvertiseError.bind(this)
            );
        }
        else {
            console.log("[advertise] stop advertising");
            bleno.stopAdvertising();
        }
    }

    startAdvertise(error){
        console.log('[advertise] advertisingStart: ' + (error ? 'error ' + error : 'success'));

        if (!error) {
            bleno.setServices([this.sensorService]);
        }
    }

    onAdvertiseError(error){
        if(error){
            console.log("[advertise] ", error);
        }
    }
}

module.exports = TemperaturePeripheral;
