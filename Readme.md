### **Installation:** ###

* install prerequisites (https://www.npmjs.com/package/noble#prerequisites)
* npm install

### **Usage** ###
* start advertising custom BLE peripheral (LightBulb)
```sh
$ node src/main_advertise
```

* start discovering BLE peripherals with the WoT-API
```sh
$ node src/main_wot
```

    * Alternative: use a BLE Scanner

### **Explanations** ###
In this section I will explain some parts of this project. The project is still under
development, so you will find a lot of console logs and messy code.  

* **BLE-APIs**  
To communicate with BLE devices I am using two different APIs. The first one is [**bleno**](https://github.com/sandeepmistry/bleno),
it allows me to provide my own BLE device. The second one is [**noble**](https://github.com/sandeepmistry/noble), which enables the
communcation between the user and the peripheral. The BLE devices communicates over the [**GATT**](https://developer.bluetooth.org/TechnologyOverview/Pages/GATT.aspx) protocol.

    * **discover.js (noble)**  
	  In this file, I have implemented the functions from the noble API, you can find the list of functions [**here**](https://github.com/sandeepmistry/bleno#actions).
	  These functions allows me to discover BLE devices via bluetooth and to interact with them.
	    
	* **lightBulbPeripheral.js (bleno)**
	  Currently there is no separated file like discover.js which provides functions to use the bleno API. Each Peripheral has to advertise itself.  

* **LightBulb peripheral**  
The LightBulb peripheral is a custom BLE device to implement and test all functions from APIs. The peripheral
provides three different services (**WoT**-, **Meta**-, **Switch**-Service). The first one is the most important service,
because it contains the **thing description**. The Meta-Service contains only readable characteristics and is not that important but
the Switch-Service provides a power characteristic which can be read, written and subscribed.  

* **Thing Description**  
The thing description contains all properties and events from the BLE device. At the moment it contains only the properties but it will be extended with events for subscribtions.

    * **LightBulb Thing Description**
    
    ```sh
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
            ]
        }
    ```
    
    This is the latest version of the used thing-description. The **uri** will be set dynamically because the mac addresses of the
    virtual devices aren't contstant. The "hrefs"-value contains two uuids, the first one comes from the service which contains the characteristic/property
    and the second one is the uuid of the characteristic.  
      
    **Service uuids**  
    
    In my example I have three different services with the uuids f100(WoT Service), f200(Meta Service), f300(Power Service). 
    Normally 16-bit-uuids are allocated for listed devices ([Bluetooth specifications](https://www.bluetooth.com/specifications/assigned-numbers/16-bit-uuids-for-sdos)).
    Uuids with a length of 128-bit can be used for custom devices, but the API used for advertising ble-devices only allows to advertise one service with 128-bit
    with two additional services using a 16-bit uuid.   
    The problem is, that in my case the test device provides three services, that's why I have used 16-bit-uuids.
    The characteristics and descriptors got 128-bit uuids. These uuids have the following structure "7777777777777777-111111111-f020100". The 7's and 1's are only
    filler, I used the last part "f020100" to list my uuids. The 'f' just marks the beginning of the uuid, the first two numbers (02) are counting the current service, the
    next two numbers stand for the characteristic and the last numbers symbolize the descriptors. In this example the uuid represents the first characteristic of the second service.
    This makes it easier for me to find out to whom it belongs to.  
       
    
    
    **Mapping WoT to GATT**

    With the WoT API it's sufficient to call one single function to get properties or subscribe to events. But in the back there are some several steps to take.
    These steps are similar for each function: 
      
    *  discover peripheral [if necessary, see consumeDescription]
    *  connect to peripheral
    *  discover service(uuid)
    *  discover characteristic(uuid) 
    *  **your operation**  
       *this part depends on the called function*  
       e.g. **getValue(), setValue(), subscribe()**
    *  disconnect from peripheral  
       this is necessary so that the peripheral can advertise itself again, otherwise it is blocked and can't be used.
    
  
* **WoT API**  
At the moment the WoT API provides two functions from the [**API definition**](http://w3c.github.io/wot/current-practices/wot-practices.html#scripting-api). **discover()** scans for BLE devices with a thing description and returns them. **consumeDescription()** gets a thing description as parameter and returns an object of the type **ConsumedThing**.

    * **discover(ThingFilter)**  
    *coming soon*
    
    * **consumeDescription(ThingDescription)**  
      *coming soon* 
    
    
* **ConsumedThing**   
An object of this class provides functions to interact with the BLE device.

    * **getProperty(name)**  
	  *coming soon*
	
	* **setProperty(name, value)**  
      *coming soon*

#### **Contributors:** ####
Louay Bassbouss,
Jonas Rook

### License

Free for non commercial use released under the GNU Lesser General Public License v3.0, See LICENSE file.

Contact us for commercial use <famecontact@fokus.fraunhofer.de>

Copyright (c) 2015 [Fraunhofer FOKUS](https://www.fokus.fraunhofer.de/)

### Contact

* [Fraunhofer FOKUS - Competence Center FAME // Future Applications and Media](http://www.fokus.fraunhofer.de/fame)
* <famecontact@fokus.fraunhofer.de>