// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let WoTTDCharacteristic = require('./WoTTDCharacteristic')


class WoTService extends bleno.PrimaryService {
    constructor(uuids, pinCharacteristics){
        super({
            uuid: uuids.WoTService.uuid,

            characteristics: [
                new WoTTDCharacteristic(uuids, pinCharacteristics)
            ]
        })

        console.log('[WoTService] created')
    }

}

module.exports = WoTService;
