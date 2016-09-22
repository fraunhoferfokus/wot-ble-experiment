// to enable es2015 features
'use strict';

let bleno = require('bleno');

// require all services here
let MetaService = require('./MetaService/metaService')
let SwitchService = require('./SwitchService/switchService')
let WoTService = require('./WoTService/wotService')

class LightBulbPeripheral
{
    constructor(name, uuids)
    {
        console.log(`[LightBulb] create ${name}`)
        this._name = name;

        // list all servies here
        this._services = [
            new MetaService(uuids),
            new SwitchService(uuids),
            new WoTService(uuids)
        ]

        // extract all service uuids for advertising
        this._servicesUUIDs = this.extractUUIDs(this._services);

        bleno.on('advertisingStartError', function(error) {
            console.log('[advertise] advertisingStart: ' + (error ? ' error' + error : 'success'));
        });

        bleno.on('servicesSetError', function(error) {
            console.log('[advertise] servicesSet: ' + (error ? ' error' + error : 'success'));
        });
    }

    extractUUIDs(services){
        let uuids = []

        for(let service of services){
            if(service.uuid)
                uuids.push(service.uuid)
        }

        return uuids;
    }

    get name() {
        return this._name
    }

    set name(name) {
        this._name = name
    }

    get serviceUUIDs() {
        return this._servicesUUIDs
    }

    set serviceUUIDs(serviceUUIDS) {
        this._servicesUUIDs = serviceUUIDS
    }

    get services() {
        return this._services
    }

    set services(services){
        this._services = services
    }
}

module.exports = LightBulbPeripheral;
