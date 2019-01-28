"use strict"

class Store {

    constructor(store) {
        this.store = store || {};
    }

    set(key, value) {
        this.store[key] = value;
    }

    get(key) {
        return this.store[key];
    }
}

module.exports = Store;