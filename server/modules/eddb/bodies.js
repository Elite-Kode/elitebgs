"use strict";

const path = require('path');
const bodiesModel = require('../../models/bodies');

module.exports.import = () => {
    require('../utilities').jsonlToJson(path.resolve(__dirname, '../../dumps/bodies.jsonl'))
        .then(json => {
            bodiesModel.then(model => {
                model.insertMany(json)
                    .then(() => {
                        console.log("Bodies records updated from EDDB");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        })
        .catch(err => {
            console.log(err);
        })
}