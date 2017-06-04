"use strict";

const path = require('path');
const commoditiesModel = require('../../models/commodities');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        require('../utilities').csvToJson(path.resolve(__dirname, '../../dumps/listings.csv'))
            .then(json => {
                commoditiesModel.then(model => {
                    model.insertMany(json)
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            })
            .catch(err => {
                reject(err);
            })
    })
}