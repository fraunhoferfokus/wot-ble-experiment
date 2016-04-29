// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
//let PowerCharacteristic = require('./powerCharacteristic');


class MetaService extends bleno.PrimaryService {
    constructor(){
        super({
            //TODO: figure out how to set the correct uuid
            // always use 128 bit uuids, 16- and 32-bits are reserved for the ble spec list
            //uuid: '13333333333333333333333333333338',
            uuid: '11111111111111111111111111F00001',
            characteristics: [
                //new PowerCharacteristic()
            ]
        })

        //console.log('[MetaService] created')
    }

}

module.exports = MetaService;
