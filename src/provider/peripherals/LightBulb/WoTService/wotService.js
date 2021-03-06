// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
//let ManufacturerCharacteristic = require('./manufacturerCharacteristic');
let WoTTDCharacteristic = require('./WoTTDCharacteristic')


class WoTService extends bleno.PrimaryService {
    constructor(uuids){
        super({
            uuid: uuids.WoTService.uuid,

            characteristics: [
                new WoTTDCharacteristic(uuids)
            ]
        })

        console.log('[WoTService] created')
    }

}

module.exports = WoTService;
