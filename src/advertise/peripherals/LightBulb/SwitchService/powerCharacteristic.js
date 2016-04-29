// to enable es2015 features
'use strict';

let bleno = require('bleno');

let powerDescriptor = new bleno.Descriptor({
    uuid: '1111111111111111111111111F020101',
    value:'To control the power of this sensor'
});

let stateDescriptor = new bleno.Descriptor({
    uuid: '1111111111111111111111111F020102',
    value: "['on', 'off']"
});

class PowerCharacteristic extends bleno.Characteristic {
    constructor(){
        super({
            uuid: '1111111111111111111111111F020100',
            properties: ['read', 'write', 'notify'],
            descriptors: [
                powerDescriptor,
                stateDescriptor
            ],
        })

        this.data = 'on'
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

    onWriteRequest(data, offset, withoutResponse, callback) {
        let dataString = data.toString('utf8')

        if(dataString.match(/^(on|off)$/)){
            console.log('[powerCharacteristic] writeRequest: ', dataString)
            this.data = dataString

            if(this.updateValueCallback)
                this.updateValueCallback(new Buffer(this.data));

            callback(this.RESULT_SUCCESS)
        }else {
            console.log('[powerCharacteristic] writeRequest not valid: ', dataString)
            callback(this.RESULT_UNLIKELY_ERROR)
        }
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log('[powerCharacteristic] onSubscribe');
        let self = this
        self.maxValueSize = maxValueSize
        self.updateValueCallback = updateValueCallback

        /*
        self.i = 1

        self.timer = setInterval(function(){
            if(self.updateValueCallback){
                self.updateValueCallback(new Buffer("" + self.i++));
            }
        }, 1000)
        */
    };

    onUnsubscribe(){
        console.log('[powerCharacteristic] onUnsubscribe');

        this.maxValueSize = null
        this.updateValueCallback = null

        // only needed if a interval is used
        clearInterval(this.timer)
    }

    onNotify(){
        console.log('[powerCharacteristic] onNotify ', this.data)
    }

    onIndicate(){
        console.log('[powerCharacteristic] onIndicate')
    }
}

module.exports = PowerCharacteristic;
