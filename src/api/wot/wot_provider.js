// to enable es2015 features
'use strict'

let Advertise = require('../provider/advertise')

/**
*
*   available functions
*       - newThing(type, name)
*       - expose(thing)
*/
class WoT {
    constructor(){
        this.advertiseAPI = new Advertise()
    }

    /**
    *   TODO: write description
    */
    newThing(type, name){
        let promise = new Promise((resolve, reject) => {
            this.advertiseAPI.newThing(type, name)
                .then(thing => {
                    resolve(thing)
                })
                .catch(error => {
                    reject(`newThing > ${error}`)
                })
        })

        return promise
    }

    /**
    *   TODO: write description
    */
    expose(thing){
        let promise = new Promise((resolve, reject) => {
            this.advertiseAPI.expose(thing)
                .then(onAdvertising => {
                    if(onAdvertising)
                        resolve(true)
                })
                .catch(error => {
                    reject(`expose > ${error}`)
                })
        })

        return promise
    }
}

module.exports = new WoT();
