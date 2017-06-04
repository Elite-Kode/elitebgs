"use strict";

const factionsModel = require('../../models/factions');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        factionsModel.then(model => {
            model.insertMany(require('../../dumps/factions.json'))
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
}