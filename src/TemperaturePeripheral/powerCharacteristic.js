// to enable es2015 features
'use strict';

let bleno = require('bleno');

let powerDescriptor = new bleno.Descriptor({
        uuid: '123',
        value:'To control the power of this sensor'
});

class PowerCharacteristic extends bleno.Characteristic {
    constructor(){
        super({
            uuid: '123456789',
            properties: ['read', 'write', 'notify'],
            descriptors: [
                powerDescriptor
            ],
            value: 'on'
        })
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        this.value = data;
        callback(this.RESULT_SUCCESS, 'set characteristic to ', data)
    }

    onReadRequest(offset, callback) {
        callback(this.RESULT_SUCCESS, this.value)
    }
}

module.exports = PowerCharacteristic;
