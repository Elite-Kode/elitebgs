"use strict";

const path = require('path');
const systemsModel = require('../../models/systems');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        require('../utilities').csvToJson(path.resolve(__dirname, '../../dumps/systems.csv'))
            .then(json => {
                systemsModel.then(model => {
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