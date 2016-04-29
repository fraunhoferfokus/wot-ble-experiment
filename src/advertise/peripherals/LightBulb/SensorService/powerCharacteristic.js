// to enable es2015 features
'use strict';

let bleno = require('bleno');

let powerDescriptor = new bleno.Descriptor({
        uuid: '13333333333333333333333333330002',
        //name: 'Power',
        value:'To control the power of this sensor'
});

class PowerCharacteristic extends bleno.Characteristic {
    constructor(powerPeripheral){
        super({
            uuid: '13333333333333333333333333330002',
            properties: ['read', 'write', 'notify'],
            descriptors: [
                powerDescriptor
            ],
            //onReadRequest: this.onReadRequest
            // works, but onReadRequest isn't fired anymore
            //value: new Buffer('on'),
        })

        this.data = 'kaninchen'

        // works, if value is used, otherwise it will be fired twice
        //this.on('readRequest', this.onReadRequest.bind(this))
    }

    onReadRequest(offset, callback) {
        console.log('[powerCharacteristic] readRequest powerCharacteristic: ', this.data);

        if (offset) {
            callback(this.RESULT_ATTR_NOT_LONG, null);
        }
        else {
            callback(this.RESULT_SUCCESS, new Buffer(this.data));
        }
    }

    onUnsubscribe(){
        console.log("onUnsubscribe");
    }

    onNotify(){
        console.log("onNotify")
    }

    onIndicate(){
        console.log("onIndicate")
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        console.log('[powerCharacteristic] writeRequest: ', data.toString('utf8'))

        this.data = data.toString('utf8')
        callback(this.RESULT_SUCCESS)
    }
}

module.exports = PowerCharacteristic;
