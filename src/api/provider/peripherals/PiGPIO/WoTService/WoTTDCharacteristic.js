// to enable es2015 features
'use strict';

let bleno = require('bleno')
let cbor = require('cbor')

//let thingURL = 'https://fraunhoferfokus.github.io/wot-ble-experiment/lightbulb_description.json'

let propertyDummy = {
    "name": "",
    "valueType": "gatt:number",
    "writable": true,
    "hrefs": []
}

let eventDummy = {
    "@type": "actuator:observer",
    "name": "",
    "valueType": {"type": "string"},
    "hrefs": []
}

let thingDescription = {
    "@context" : ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
    "@type": "Thing",
    "name": "Pi_Gpio",
    "uris": ["gatt://{BLE MAC address}/"],
    "encodings": ["BLE", "JSON"],
    "properties": [],
    "events": []
}

class WoTTDCharacteristic extends bleno.Characteristic {
    constructor(uuids, pinCharacteristics){
        super({
            uuid: uuids.WoTTDCharacteristic.uuid,
            properties: ['read'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: uuids.WoTTDDescriptor.uuid,
                    value:'pathToDescription'
                })
            ]
        })

        this.addPinsToProperties(pinCharacteristics, uuids)
        this.addPinsToEvents(pinCharacteristics, uuids)

        this.value = cbor.encode(thingDescription)

        this.isURI = false
        if(!this.isURI)
          bleno.once('advertisingStart', this.onAdvertisingStart.bind(this))
    }

    onAdvertisingStart(error) {
      thingDescription.uris = [`gatt://${bleno.address}/`]
      this.value = cbor.encode(thingDescription)
    }

    addPinsToProperties(pinCharacteristics, uuids) {
        for(let pin of pinCharacteristics) {
            let property = Object.assign({}, propertyDummy)

            property.name = pin.pin
            property.hrefs = [`${uuids.PinService.uuid}/${pin.uuid}`]

            thingDescription.properties.push(property)
        }
    }

    addPinsToEvents(pinCharacteristics, uuids) {
        for(let pin of pinCharacteristics) {
            let property = Object.assign({}, eventDummy)

            property.name = pin.pin
            property.hrefs = [`${uuids.PinService.uuid}/${pin.uuid}`]

            thingDescription.events.push(property)
        }
    }
}

module.exports = WoTTDCharacteristic;
