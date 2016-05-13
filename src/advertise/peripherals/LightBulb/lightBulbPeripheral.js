// to enable es2015 features
'use strict';

let bleno = require('bleno');

// require all services here
let MetaService = require('./MetaService/metaService');
let SwitchService = require('./SwitchService/switchService');

class LightBulbPeripheral
{
    constructor(name)
    {
        console.log('[LightBulb] create', name)
        this.name = name;

        // list all servies here
        this.services = [
            new MetaService(),
            new SwitchService(),
        ]

        // extract all service uuids for advertising
        this.servicesUUIDs = this.extractUUIDs(this.services);

        // register listeners
        bleno.on('stateChange', this.stateListener.bind(this));
        bleno.on('advertisingStart', this.startAdvertise.bind(this));

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

            bleno.startAdvertising(this.name, this.servicesUUIDs);
        }
        else
        {
            console.log("[advertise] stop advertising");
            bleno.stopAdvertising();
        }
    }

    startAdvertise(error)
    {
        if (!error){
            console.log("[advertise] set services")
            bleno.setServices(this.services);
        }
    }

    extractUUIDs(services){
        let uuids = []

        for(let service of services){
            if(service.uuid)
                uuids.push(service.uuid)
        }

        return uuids;
    }

    get state(){
        return bleno.state
    }

    set state(state){
        bleno.state = state
    }
}

module.exports = LightBulbPeripheral;
