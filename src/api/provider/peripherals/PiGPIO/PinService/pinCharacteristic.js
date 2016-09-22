// to enable es2015 features
'use strict';

let bleno = require('bleno');

class PinCharacteristic extends bleno.Characteristic {
    constructor(uuid, gpio){
        super({
            uuid: uuid,
            properties: ['read', 'write', 'notify']
        })

        this.gpio = gpio
        this.pin = ""
        this.delay = 500
        
        let components = uuid.split('')
        this.addPin(components)

        this.readPin()
        .then(value => {
            this.data = value
        })

        console.log(`Pin ${this.pin} created`)
    }

    onReadRequest(offset, callback) {
        if (offset) {
            console.log('read offset')
            callback(this.RESULT_ATTR_NOT_LONG, null);
        }
        else {
            this.readPin()
            .then(value => {
                console.log(`[Pin ${this.pin}] readRequest PinCharacteristic: ${value}`);

	            callback(this.RESULT_SUCCESS, new Buffer(`${value}`));
            })
        }
    }

    onWriteRequest(data, offset, withoutResponse, callback) {
        let dataString = data.toString('utf8')
        if(dataString == '1' || dataString == '0'){
            console.log(`[Pin ${this.pin}] writeRequest: ${dataString}`)

            let newValue = parseInt(dataString)
            this.writePin(newValue)

            if(this.updateValueCallback)
                this.updateValueCallback(new Buffer(this.data));

            callback(this.RESULT_SUCCESS)
        } else {
            console.log(`[Pin ${this.pin}] writeRequest not valid: ${dataString}`)
            callback(this.RESULT_UNLIKELY_ERROR)
        }
    }

    onSubscribe(maxValueSize, updateValueCallback) {
        console.log(`[Pin ${this.pin}] onSubscribe`);

        this.maxValueSize = maxValueSize
        this.updateValueCallback = updateValueCallback

        this.timer = setInterval(() => {
            if(this.updateValueCallback){
                this.readPin()
                .then(value => {
                    if(value !== this.data) {
                        console.log(`data changed`)
                        this.data = value
                        this.updateValueCallback(new Buffer(`${value}`))
                    }
                })
            }
        }, this.delay)

    };

    onUnsubscribe(){
        console.log(`[Pin ${this.pin}] onUnsubscribe`);

        this.maxValueSize = null
        this.updateValueCallback = null

        // only needed if a interval is used
        clearInterval(this.timer)
    }

    onNotify(){
        console.log(`[Pin ${this.pin}] changed to: ${this.data}`)

    }

    onIndicate(){
        console.log(`[Pin ${this.pin}] onIndicate`)
    }

    addPin(components) {
        let pin = ""
        let start = components.length-1;

        pin += components[start]

        if(components[start - 1] != 0)
            pin += components[start - 1]

        this.pin = pin
    }

    readPin() {
        let promise = new Promise((resolve, reject) => {
            let number = parseInt(this.pin);

            this.gpio.open(number, "output", (error) => {
                if(error) //console.log(`open error: ${error}`)

                this.gpio.read(number, (error, value) => {
                    resolve(value);
                });
            });
        });

        return promise
    }

    writePin(value) {
        console.log(`writePin: ${this.pin} with ${value}`)

        let number = parseInt(this.pin);

        this.gpio.open(number, "output", (error) => {
            if(error) //console.log(`open error: ${error}`)

            this.gpio.write(number, value, (error) => {
                if(error) console.log(`write error: ${error}`)
                this.data = value
            });
        });
    }
}

module.exports = PinCharacteristic;
