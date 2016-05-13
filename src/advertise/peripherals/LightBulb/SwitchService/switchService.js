// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let PowerCharacteristic = require('./powerCharacteristic');

class SwitchService extends bleno.PrimaryService {
    constructor(){
        super({
            uuid: '111111111F020000',
            characteristics: [
                new PowerCharacteristic()
            ]
        })

        console.log('[SwitchService] created')
    }

}

module.exports = SwitchService;
