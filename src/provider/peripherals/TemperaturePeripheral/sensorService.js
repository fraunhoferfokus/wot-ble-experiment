// to enable es2015 features
'use strict';

let bleno = require('bleno');

let PowerCharacteristic = require('./powerCharacteristic');

class SensorService extends bleno.PrimaryService {
    constructor(){
        super({
            //TODO: figure out how to set the correct uuid
            uuid: '13333333333333333333333333333337',
            characteristics: [
                new PowerCharacteristic()
            ]
        })
    }

}

module.exports = SensorService;
