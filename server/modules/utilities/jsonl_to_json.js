"use strict";

const fs = require('fs-extra');
const ndjson = require('ndjson');

module.exports = path => {
    return new Promise((resolve, reject) => {
        let jsonArray = [];
        fs.createReadStream(path)
            .pipe(ndjson.parse())
            .on('data', json => {
                jsonArray.push(json);
            })
            .on('end', () => {
                resolve(jsonArray);
            })
            .on('error', error => {
                reject(error);
            })
    })
}