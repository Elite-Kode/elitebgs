"use strict";

const stationsModel = require('../../models/stations');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        stationsModel.then(model => {
            model.insertMany(require('../../dumps/stations.json'))
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
}