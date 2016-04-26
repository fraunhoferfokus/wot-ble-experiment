// to enable es2015 features
'use strict';

let bleno = require('bleno');

// require all services here

class LightBulbPeripheral
{
    constructor(name)
    {
        console.log('[LightBulb] create', name)

        let self = this;
        self.name = name;
        self.servicesUUIDs = [
            // list all service UUIDs here
        ]

        self.services = [
            // list all servies here
        ]

        // register listeners
        bleno.on('stateChange', self.stateListener);
        bleno.on('advertisingStart', self.startAdvertise);

        bleno.on('advertisingStartError', function(error) {
            console.log('[advertise] advertisingStart: ' + (error ? ' error' + error : 'success'));
        });

        bleno.on('servicesSetError', function(error) {
            console.log('[advertise] servicesSet: ' + (error ? ' error' + error : 'success'));
        });
    }

    stateListener(state)
    {
        console.log("[advertise] state changed to ", state);

        if(state === 'poweredOn')
        {
            console.log("[advertise] start advertising");
            //bleno.startAdvertising(this.name, this.servicesUUIDs);
        }
        else
        {
            console.log("[advertise] stop advertising");
            bleno.stopAdvertising();
        }
    }

    startAdvertise(error)
    {
        if (!error)
            bleno.setServices(this.services);
    }
}

module.exports = LightBulbPeripheral;
