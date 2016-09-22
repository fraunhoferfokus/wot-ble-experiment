'use strict'

class ConnectionHandler {

    constructor(connection, gpio) {
        console.log(`[ConnectionHandler] new connection established`);

        // add params to class
        this.connection = connection;
        this.gpio = gpio;
        // this.pinWatcher = this.pinWatcher.bind(this)

        // bind functions to this class scope
        this.setPin = this.setPin.bind(this)
        this.getPin = this.getPin.bind(this)
        this.togglePin = this.togglePin.bind(this)
        this.sendStatus = this.sendStatus.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)
        this.observePins = this.observePins.bind(this)

        // list with observed pins
        this.availablePins = [ 7, 11, 12, 13, 15, 16, 18, 22, 29, 31, 32, 33, 35, 37, 38, 40 ]
        this.observedPins = new Map()
        this.watchInterval = undefined
        this.delay = 500
        this.watchFunction = this.watchFunction.bind(this)


        // register event listener
        connection.on('set', this.setPin)
        connection.on('get', this.getPin)
        connection.on('toggle', this.togglePin)
        connection.on('status', this.sendStatus)
        connection.on('observe', this.observePins)
        connection.on('disconnect', this.onDisconnect)

        this.pinWatcher();
    }

    /**
    *   returns the status of the pins
    **/
    sendStatus() {

        let pins = Array.from(this.observedPins.keys());
        let values = Array.from(this.observedPins.values());

        this.send('status', {pins: pins, values: values})
    }

    setPin(number, value) {
        // gpio set pin value
        //console.log(`set Pin: ${number} to ${value}`);

        if(!this.observedPins.has(number)) {
            console.log(`observe pin ${number}`)
            this.observedPins.set(number, value)
        }
        else {
            console.log(`cannot observe pin ${number}`)
        }

        console.log(this.observedPins)
    }

    getPin(number) {
        // gpio read pin value

        let value = -1
        if(this.observedPins.has(number)) {
            value = this.observedPins.get(number)
        }

        this.send('get', {pin: number, value: value})
    }

    togglePin(message) {
        let pin = parseInt(message.pin)
        let newValue = 1 - this.observedPins.get(pin)

        this.writePin(pin, newValue)
    }

    observePins(message) {
        let newPins = message.pins;

        for(let pin of newPins) {
            let number = parseInt(pin)
            if(this.isAvailable(number)) {
                this.setPin(number, 0)
                this.openPin(number)
            }
        }
    }

    pinWatcher() {
        this.watchInterval = setInterval(this.watchFunction, this.delay);
    }

    watchFunction() {
        for(let pin of this.observedPins.keys()) {
            this.readPin(pin)
        }
    }

    openPin(number) {
      this.gpio.open(number, error => {
        if(error)
          console.log(`Error while opening pin: ${error}`);
        else
          console.log(`Pin ${number} opened`);
      })
    }

    closePin(number) {
      this.gpio.close(number, error => {
        if(error)
          console.log(`Error while closing pin: ${error}`);
        else
          console.log(`Pin ${number} closed`);
      })
    }

    readPin(number) {
        // gpio stuff

        if(this.gpio) {
            this.gpio.read(number, (error, value) => {
                let oldValue = parseInt(this.observedPins.get(number))

                if(value !== oldValue) {
	    	        console.log(`Update Pin ${number} from ${oldValue} to ${value}`);
                    this.observedPins.set(number, value)
                    this.send('pinUpdate', {pin: number, value: value})
                }
            })
        }
        else {
            console.log(`read pin ${number}`);
        }
    }

    writePin(number, value) {
        if(!this.gpio) {
            console.log('offline mode')
            this.observedPins.set(number, value);
            this.sendStatus()
        }
        else {
          this.gpio.write(number, value, error => {
              if(error)
                console.log(`Error while writing: ${error}`);
              else
                console.log(`Pin ${number} set value to ${value}`);
          })
        }
    }

    send(source, value) {
        let responseType = `${source}Response`
	    // console.log('send message ' + responseType + " " + JSON.stringify(value));
        this.connection.emit(responseType, value)
    }

    onDisconnect() {
        console.log(`disconnect`)
        clearInterval(this.watchInterval)

        let pins = this.observedPins.keys()

        for(let pin of pins) {
          let number = parseInt(pin)
          this.closePin(number);
        }
    }

    /**
    *   helper functions
    */
    isAvailable(pin) {
        let available = false

        if(this.availablePins.find(x => x === pin))
            available = true

        return available
    }
}

module.exports = ConnectionHandler;
