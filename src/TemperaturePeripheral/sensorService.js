// to enable es2015 features
'use strict';

let bleno = require('bleno');

let PowerCharacteristic = require('./powerCharacteristic');


class SensorService extends bleno.PrimaryService {
    constructor(){
        super({
            uuid: '1234567890',
            characteristics: [
                new PowerCharacteristic()
            ]
        })
    }

}

module.exports = SensorService;
