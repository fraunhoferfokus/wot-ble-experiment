# consumer API

interface WoT {
    Promise<sequence<ConsumedThing>> discover(ThingFilter filter);
    Promise<ConsumedThing>           consumeDescription(object td);
    Promise<ConsumedThing>           consumeDescriptionUri(DOMString uri);
};

```
{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": "Thing",
  "name": "MyTemperatureThing",
  "uris": "gatt://{MAC-ADDRESS}/{SERVICE-UUID1}/",
  "encodings": ["JSON"],
  "properties": [
    {
      "name": "temperature",
      "valueType": "gatt:float64",
      "writable": false,
      "hrefs": ["{CHARACTERISTIC-UUID1}"]
    },
    {
      "name": "humidity",
      "valueType": "gatt:float64",
      "writable": false,
      "hrefs": ["{CHARACTERISTIC-UUID2}"]
    }
  ]
}
```

```
{
  "@context": ["http://w3c.github.io/wot/w3c-wot-td-context.jsonld"],
  "@type": "Thing",
  "name": "MyTemperatureThing",
  "uris": "gatt://{MAC-ADDRESS}/",
  "encodings": ["JSON"],
  "properties": [
    {
      "name": "temperature",
      "valueType": "gatt:float64",
      "writable": false,
      "hrefs": ["{SERVICE-UUID1}/{CHARACTERISTIC-UUID1}"]
    },
    {
      "name": "humidity",
      "valueType": "gatt:float64",
      "writable": false,
      "hrefs": ["{SERVICE-UUID2}/{CHARACTERISTIC-UUID2}"]
    }
  ]
}
```


Effective URI =  gatt://{MAC-ADDRESS}/{SERVICE-UUID}/{CHARACTERISTIC-UUID}
Effective URI relative to MAC Address = gatt:///{SERVICE-UUID}/{CHARACTERISTIC-UUID} and Client creates the final URL by adding the MAC-Address to the URI
´´´
class WoT {
    let pool = {};
    discover(ThingFilter filter){
        var promise = new Promise();
        var list = new Array();
        BLE.discover(WoT_SERVICE_UUID).then(function(devices){
           connect to all devices and get TD
           create a new ConsumedThing(td,pool) and add to list
           OPTIONAL: cache TDs. cache ID is MAC-ADDRESS
           promise.resolve(list);
        })
        return promise;
    }

    consumeDescription(td){
        var promise = new Promise();
        var thing = new ConsumedThing(td);
        return promise;
    }
}
´´´

```
class ConsumedThing {
    constructor(td,pool){
        this.td = td;
        this.name = READ BLE NAME;
    }
    invokeAction(actionName, parameter){
        var p = new Promise();
        promise.reject();
        return promise;
    }

    setProperty propertyName, newValue){
        var p = new Promise();
        promise.reject(); if property not found
        promise.resolve(); if property is found, and value is available
        return promise;
    }
Promise<any>  getProperty(DOMString propertyName);
ConsumedThing addListener(DOMString eventName, ThingEventListener listener);
ConsumedThing removeListener(DOMString eventName,
                             ThingEventListener listener);
ConsumedThing removeAllListeners(DOMString eventName);
object        getDescription();
}
```
