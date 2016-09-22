document.addEventListener('DOMContentLoaded', () => {
    let socket = io.connect('')
    let states = ['btn-danger', 'btn-success']

    let observedPins = [12, 13, 15, 17]
    let observedValues = []

    let send = (type, message) => {
        socket.emit(type, message)
    }

    let updatePin = (number, value) => {
        let isChange = observedValues[number] !== value ? true : false

        if(isChange) {
            console.log(`update pin ${number} to ${value}`)
            observedValues[number] = value

            let prevState = states[1 - value]
            let currState = states[value]

            document.getElementById(`${number}`).classList.remove(prevState)
            document.getElementById(`${number}`).classList.add(currState)
        }
    }

    console.log('[main] ready')
    send('observe', {pins: observedPins});
    send('status')

    triggerButton = source => {
        console.log('trigger')
        socket.emit('toggle', { pin: source.id });
    }

    socket.on('statusResponse', message => {
        console.log(`statusResponse`)

        for (var i = 0; i < message.pins.length; i++) {
            updatePin(message.pins[i], message.values[i])
        }
    })

    socket.on('pinUpdateResponse', message => {
        console.log('pin update received')
        updatePin(message.pin, message.value)
    })

    socket.on('getResponse', message => {
        console.log(`received get message: ${JSON.stringify(message)}`);
    })

    socket.on('setResponse', message => {
        console.log(`received set message: ${JSON.stringify(message)}`);
    })
});
