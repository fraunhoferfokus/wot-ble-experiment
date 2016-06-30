// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let ManufacturerCharacteristic = require('./manufacturerCharacteristic');
let SoftwareRevisionCharacteristic = require('./softwareRevisionCharacteristic');


class MetaService extends bleno.PrimaryService {
    constructor(uuids){
        super({
            // TODO: figure out how to set the correct uuid
            // always use 128 bit uuids, 16- and 32-bits are reserved for the ble spec list
            // idea of this uuid structure 'F_00_00_01' - #
            // F marks the beginning; two zeros as counter for the services;
            // two zeros as counter for the characteristics; two zeros as counter for the descriptors
            //uuid: '7777777777777777-111111111-F010000',

            uuid: uuids.MetaService.uuid,

            characteristics: [
                new ManufacturerCharacteristic(uuids),
                new SoftwareRevisionCharacteristic(uuids)
            ]
        })

        console.log('[MetaService] created')
    }

}

module.exports = MetaService;
