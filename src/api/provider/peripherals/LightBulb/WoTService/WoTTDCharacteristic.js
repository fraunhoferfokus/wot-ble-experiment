// to enable es2015 features
'use strict';

let bleno = require('bleno')
let cbor = require('cbor')

let thingURL = 'https://fraunhoferfokus.github.io/wot-ble-experiment/lightbulb_description.json'

let thingDescription = {
    "@context" : ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
    "@type": "Thing",
    "name": "LightBulb",
    "uris": ["gatt://{BLE MAC address}/"],
    "encodings": ["BLE", "JSON"],
    "properties": [
        {
            "name": "Manufacturer",
            "outputData": "gatt:string",
            "writable": false,
            "hrefs": ["f200/7777777777777777111111111f010100"]
        },
        {
            "name": "softwareRevision",
            "outputData": "gatt:string",
            "writable": false,
            "hrefs": ["f200/7777777777777777111111111f010200"]
        },
        {
            "name": "PowerStatus",
            "valueType": "gatt:boolean",
            "writable": true,
            "hrefs": ["f300/7777777777777777111111111f020100"]
        }
    ],
    "events": [
        {
            "@type": "actuator:counter",
            "name": "counterExample",
            "valueType": {"type": "string"},
            "hrefs": ["f300/7777777777777777111111111f020100"]
        }
    ]
}

class WoTTDCharacteristic extends bleno.Characteristic {
    constructor(uuids){
        super({
            uuid: uuids.WoTTDCharacteristic.uuid,
            properties: ['read'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: uuids.WoTTDDescriptor.uuid,
                    value:'pathToDescription'
                })
            ],

            //value: cbor.encode(thingURL)
            value: cbor.encode(thingDescription)
        })

        this.isURI = false

        if(!this.isURI)
          bleno.once('advertisingStart', this.onAdvertisingStart.bind(this))
    }

    onAdvertisingStart(error) {
      thingDescription.uris = [`gatt://${bleno.address}/`]
      this.value = cbor.encode(thingDescription)
    }
}

module.exports = WoTTDCharacteristic;
