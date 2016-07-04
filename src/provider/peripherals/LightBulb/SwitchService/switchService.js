// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let PowerCharacteristic = require('./powerCharacteristic');

class SwitchService extends bleno.PrimaryService {
    constructor(uuids){
        super({
            uuid: uuids.SwitchService.uuid,
            characteristics: [
                new PowerCharacteristic(uuids)
            ]
        })

        console.log('[SwitchService] created')
    }

}

module.exports = SwitchService;
