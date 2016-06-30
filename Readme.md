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
comming soon
  
* **WoT API**  
comming soon
  
* **ConsumedThing**   
comming soon
  
#### **Contributors:** ####
Jonas Rook,
Louay Bassbouss
