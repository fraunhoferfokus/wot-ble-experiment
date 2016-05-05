// to enable es2015 features
'use strict';

let bleno = require('bleno');

let softwareRevisionDescriptor = new bleno.Descriptor({
    uuid: '111111111F010201',
    value:'This characteristic represents the code version'
});

class SoftwareRevisionCharacteristic extends bleno.Characteristic {
    constructor(){
        super({
            uuid: '111111111F010200',
            properties: ['read'],
            descriptors: [
                softwareRevisionDescriptor
            ],
            value: '0.0.1'
        })
    }
}

module.exports = SoftwareRevisionCharacteristic;
