// to enable es2015 features
'use strict';

let bleno = require('bleno');

class ManufacturerCharacteristic extends bleno.Characteristic {
    constructor(uuids){
        super({
            uuid: uuids.ManufacturerCharacteristic.uuid,
            properties: ['read'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: uuids.ManufacturerDescriptor.uuid,
                    value:'This characteristic represents the name of the manufacturer of the device'
                })
            ],
            value: 'Jonas Rook'
        })
    }
}

module.exports = ManufacturerCharacteristic;
