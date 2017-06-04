"use strict";

const path = require('path');
const bodiesModel = require('../../models/bodies');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        require('../utilities').jsonlToJson(path.resolve(__dirname, '../../dumps/bodies.jsonl'))
            .then(json => {
                bodiesModel.then(model => {
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