// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let PowerCharacteristic = require('./powerCharacteristic');

class SwitchService extends bleno.PrimaryService {
    constructor(){
        super({
            //uuid: '7777777777777777-111111111-F020000',
            uuid: 'f200',
            characteristics: [
                new PowerCharacteristic()
            ]
        })

        console.log('[SwitchService] created')
    }

}

module.exports = SwitchService;
