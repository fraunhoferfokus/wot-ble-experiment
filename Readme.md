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
it allows me to provide my own ble device. The second one is [**noble**](https://github.com/sandeepmistry/noble), which enables the
communcation between the user and the peripheral. The BLE devices communicates over the [**GATT**](https://developer.bluetooth.org/TechnologyOverview/Pages/GATT.aspx) protocol.

    * **discover.js (noble)**  
	  In this file, I have implemented the functions from the noble API, you can find the list of functions [**here**](https://github.com/sandeepmistry/bleno#actions).
	  This functions allows me to discover ble devices via bluetooth and to interact with them.
	    
	* **lightBulbPeripheral.js (bleno)**
	  Currently there is no separated file like discover.js which provides functions to use the bleno API. Each Peripheral has to advertise himself.  

* **LightBulb peripheral**  
The LightBulb peripheral is a custom BLE device to implement and test all functions from the APIs. The peripheral
provides three different services (**WoT**-, **Meta**-, **Switch**-Service). The first one is the most important service,
because it contains the **thing description**. The Meta-Service contains only readable characteristics and is not that important but
the Switch-Service provides a power characteristic which can be read, written and subscribed.  

* **Thing Description**  
The thing description contains all properties and events from the ble device. My used description is not completely conform with the definition (hrefs). It will be changed as soon as possible.

    **Mapping WoT to GATT**
	With the WoT API it's sufficient to call one single function to get properties or subscribe to events. 
    [To get a property which is described in the thing description you only have to call the WoT function **getProperty()**. But in the back there are some several steps]
  
  
* **WoT API**  
The WoT API provides at the moment two functions from the [**API definition**](http://w3c.github.io/wot/current-practices/wot-practices.html#scripting-api). **discover()** scans for BLE devices with a thing description and returns them. **consumeDescription()** gets a thing description as parameter and returns an object of the type **ConsumedThing**.

    * **discover(ThingFilter)**  
	  *coming soon*
	
	* **consumeDescription(ThingDescription)**  
	  *coming soon* 
	
	
* **ConsumedThing**   
An object of this class provides functions to interact with the ble device. At the moment is only the function **getProperty()** implemented.


#### **Contributors:** ####
Jonas Rook,
Louay Bassbouss

### License

Free for non commercial use released under the GNU Lesser General Public License v3.0, See LICENSE file.

Contact us for commercial use <famecontact@fokus.fraunhofer.de>

Copyright (c) 2015 [Fraunhofer FOKUS](https://www.fokus.fraunhofer.de/)

### Contact

* [Fraunhofer FOKUS - Competence Center FAME // Future Applications and Media](http://www.fokus.fraunhofer.de/fame)
* <famecontact@fokus.fraunhofer.de>