// to enable es2015 features
'use strict';

let bleno = require('bleno');

/*let softwareRevisionDescriptor = new bleno.Descriptor({
    uuid: '7777777777777777-111111111-F010201',
    value:'This characteristic represents the code version'
});*/

class SoftwareRevisionCharacteristic extends bleno.Characteristic {
    constructor(uuids){
        super({
            uuid: uuids.SoftwareRevisionCharacteristic.uuid,
            properties: ['read'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: uuids.SoftwareRevisionDescriptor.uuid,
                    value:'This characteristic represents the code version'
                })
            ],
            value: '0.1.4'
        })
    }
}

module.exports = SoftwareRevisionCharacteristic;
