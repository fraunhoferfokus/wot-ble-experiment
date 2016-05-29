// to enable es2015 features
'use strict';

let bleno = require('bleno');

let thingDescription = {
    "@context" : "urlToContextDescription",
    "@type": "LightBulb",
    "name": "LightBulbTest",
    "uris": [
        "uuid?"
    ],
    "encodings": ["BLE"],
    "properties": [
        {
            "@id": "ThingDescription",
            "@type": "ThingDescription",
            "name": "WoT-ThingDescription",
            "outputData": "xsd:string",
            "writable": false,
            "hrefs": "[uuid?]"
        },
        {
            "@id": "Manufacturer",
            "@type": "Manufacturer",
            "name": "Manufacturer",
            "outputData": "xsd:string",
            "writable": false,
            "hrefs": "[uuid?]"
        },
        {
            "@id": "softwareRevision",
            "@type": "softwareRevision",
            "name": "softwareRevision",
            "outputData": "xsd:string",
            "writable": false,
            "hrefs": "[uuid?]"
        },
        {
            "@id": "PowerStatus",
            "@type": "PowerStatus",
            "name": "PowerStatus",
            "valueType": "xsd:boolean",
            "writable": true,
            "hrefs": "[uuid?]"
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
            value: JSON.stringify(thingDescription)
        })
    }
}

module.exports = WoTTDCharacteristic;
