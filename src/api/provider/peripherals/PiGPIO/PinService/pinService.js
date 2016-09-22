// to enable es2015 features
'use strict';

let bleno = require('bleno');

// define all characteristics here
let PinCharacteristic = require('./pinCharacteristic');

class PinService extends bleno.PrimaryService {
    constructor(uuids, pins, gpio){
        super({
            uuid: uuids.PinService.uuid
        })

        this.characteristics = this.createCharacteristics(uuids.PinCharacteristic.uuid, pins, gpio);
        console.log('[PinService] created')
    }

    createCharacteristics(startUUID, pins, gpio) {
        let characteristics = []

        for(let pin of pins) {
            let uuid = this.addPinToId(startUUID, pin)
            let characteristic = new PinCharacteristic(uuid, gpio)

            characteristics.push(characteristic)
        }

        return characteristics
    }

    addPinToId(startUUID, pin) {
        let uuidComponents = startUUID.split('');
        let numbers = pin.toString().split('');

        for (var i = 0; i < numbers.length; i++) {
            let uuidPosition = uuidComponents.length - 1 - i
            uuidComponents[uuidPosition] = numbers[i]
        }

        let newUUID = uuidComponents.join('');

        return newUUID
    }
}

module.exports = PinService;
