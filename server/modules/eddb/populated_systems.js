"use strict";

const populatedSystemsModel = require('../../models/populated_systems');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        populatedSystemsModel.then(model => {
            model.insertMany(require('../../dumps/systems_populated.json'))
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
}