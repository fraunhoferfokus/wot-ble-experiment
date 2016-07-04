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
communcation between the user and the peripheral.


* **LightBulb peripheral**  
The LightBulb peripheral is a custom BLE device to implement and test all functions from the APIs. The peripheral
provides three different services (**WoT**-, **Meta**-, **Switch**-Service). The first one is the most important service,
because it contains the **thing description**. The Meta-Service contains only readable characteristics and is not that important but
the Switch-Service provides a power characteristic which can be read, written and subscribed.  

* **Thing Description**  
The thing description contains all properties and events from the ble device. My used description is not completely conform with the definition (hrefs). It will be changed as soon as possible.

    **Mapping GATT to WoT**  
    *coming soon*   
  
  
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
