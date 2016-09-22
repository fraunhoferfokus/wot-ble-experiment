// to enable es2015 features
'use strict';

let bleno = require('bleno')
let gpio = require('pi-gpio')
// require all services here
let PinService = require('./PinService/pinService')
let WoTService = require('./WoTService/wotService')

class GPIOPeripheral
{
    constructor(name, uuids)
    {
        console.log(`[GPIOPeripheral] create ${name}`)
        this._name = name;
        // this.availablePins = [ 7, 11, 12, 13, 15, 16, 18, 22, 29, 31, 32, 33, 35, 37, 38, 40 ]
        this.availablePins = [ 7, 11, 12, 13, 15 ]

        let pinService = new PinService(uuids, this.availablePins, gpio)
        // list all servies here
        this._services = [
            pinService,
            new WoTService(uuids, pinService.characteristics)
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

module.exports = GPIOPeripheral;
