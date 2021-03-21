"use strict";

const redis = require('redis');

const { redis_use, redis_port, redis_host, redis_timeout, redis_password } = require("../../secrets");

class CacheNone {

    constructor() {
        redisClient = null
    }

    connect() {
        return redisClient
    }

    isConnected() {
        return false
    }

    getClient = () => {
        return redisClient
    }

    getKey() {
        return null
    }

    setKey() {
        return false
    }
}

class CacheRedis {
    #redisReady

    constructor() {
        this.#redisReady = false
        redisClient = null
    }

    connect = () => {

        if (redis_use && redisClient == null ) {
            redisClient = redis.createClient(redis_port, redis_host);

            if (redis_password != '') {
                redisClient.auth(redis_password)
            }

            redisClient.on("connected", () => {
                console.log(`Connected to Redis at ${redis_host}:${redis_port}`);
                this.#redisReady = true
            });

            redisClient.on("ready", () => {
                console.log('Redis is ready')
                this.#redisReady = true
            });

            //log error to the console if any occurs
            redisClient.on("error", (err) => {
                this.#redisReady = false
                console.log(err);
            });
        }
        return redisClient;
    }

    getKey = (key) => new Promise((resolve, reject) => {
        if ( this.#redisReady ) {
            redisClient.get(key, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        } else {
            return null
        }
    });

    setKey = (urlHash, data) => {
        if ( this.#redisReady ) {
            redisClient.setex(urlHash, redis_timeout, data)
        }
    }
}

// In memory object cache
class CacheFactory {
    constructor() {
        if (redis_use) {
            return new CacheRedis
        }
        return new CacheNone
    }
}

// singleton
let redisClient
let objCache 

module.exports = {
    CacheFactory, 
    objCache,
    redisClient
};

