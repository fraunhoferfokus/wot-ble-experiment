// to enable es2015 features
'use strict'

class ConsumedThing {
    let pool = []
    let description = {}

    constructor(description, pool) {
        pool = pool
        description = description
    }

    invokeAction(actionName, parameter) {
        let promise = new Promise((resolve, reject) => {
            reject('invokeAction is not implemented')
        })

        return promise
    }

    setProperty(name, value) {
        let promise = new Promise((resolve, reject) => {
            reject('setProperty is not implemented')
        })

        return promise
    }

    getProperty(name) {
        let promise = new Promise((resolve, reject) => {
            reject('getProperty is not implemented')
        })

        return promise
    }

    addListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            reject('addListener is not implemented')
        })

        return promise
    }

    removeListener(eventName, listener) {
        let promise = new Promise((resolve, reject) => {
            reject('removeListener is not implemented')
        })

        return promise
    }

    removeAllListeners(eventName) {
        let promise = new Promise((resolve, reject) => {
            reject('removeAllListeners is not implemented')
        })

        return promise
    }

    getDescription() {
        let promise = new Promise((resolve, reject) => {
            resolve(description)
        })

        return promise
    }
}
