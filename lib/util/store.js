"use strict"

class Cache {

    constructor(cache) {
        this.cache = cache || {}
    }

    set(key, value){
        this.cache[key] = value
    }

    get(key){
        return this.cache[key]
    }
}