"use strict";

const redis = require('redis');

const { redis_use, redis_port, redis_host, redis_timeout, redis_password } = require("../../secrets");

// singleton
let redisClient
let objCache

class CacheNone {

    constructor() {
        redisClient = null
    }

    connect() {
        console.log("Redis is not enabled, skipping.")
        return null
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

        if (redis_use && redisClient === null) {
            console.log(`Attempting to connect to Redis at ${redis_host}:${redis_port}`)
            redisClient = redis.createClient(redis_port, redis_host);

            if (redis_password !== '') {
                redisClient.auth(redis_password)
            }

            redisClient.on("connected", () => {
                console.log('Connected to Redis');
                this.#redisReady = true
            });

            redisClient.on("ready", () => {
                console.log('Redis is ready')
                this.#redisReady = true
            });

            //log error to the console if any occurs
            redisClient.on("error", (err) => {
                this.#redisReady = false
                console.log('Redis error: disabling Redis')
                redisClient.quit()
                redisClient = null
                objCache = new CacheNone()
                console.log(err);
            });
        }
        return redisClient;
    }

    getKey = (key) => new Promise((resolve, reject) => {
        if (redis_use && redisClient !== null && this.#redisReady) {
            redisClient.get(key, (err, data) => {
                if (err) return reject(err);
                return resolve(data);
            });
        } else {
            return null
        }
    });

    setKey = (urlHash, data) => {
        if (redis_use && redisClient !== null && this.#redisReady) {
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

function setObjCache(objCache) {
    this.objCache = objCache
}

module.exports = {
    CacheFactory, objCache, redisClient, setObjCache
};
