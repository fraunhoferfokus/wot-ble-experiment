// to enable es2015 features
'use strict';

let bleno = require('bleno');

let manufacturerDescriptor = new bleno.Descriptor({
    uuid: '7777777777777777-111111111-F010101',
    value:'This characteristic represents the name of the manufacturer of the device'
});

class ManufacturerCharacteristic extends bleno.Characteristic {
    constructor(){
        super({
            uuid: '7777777777777777-111111111-F010100',
            properties: ['read'],
            descriptors: [
                manufacturerDescriptor
            ],
            value: 'Jonas Rook'
        })
    }
}

module.exports = ManufacturerCharacteristic;
