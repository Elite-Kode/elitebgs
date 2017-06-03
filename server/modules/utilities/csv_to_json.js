"use strict";

const fs = require('fs-extra');
const csvtojson = require('csvtojson');

module.exports = path => {
    return new Promise((resolve, reject) => {
        let jsonArray = [];
        csvtojson()
            .fromStream(fs.createReadStream(path))
            .on('json', json => {
                jsonArray.push(json);
            })
            .on('done', (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(jsonArray);
                }
            })
    })
}