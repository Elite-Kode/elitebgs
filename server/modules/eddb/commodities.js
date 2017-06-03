"use strict";

const path = require('path');
const commoditiesModel = require('../../models/commodities');

module.exports.import = () => {
    require('../utilities').csvToJson(path.resolve(__dirname, '../../dumps/listings.csv'))
        .then(json => {
            commoditiesModel.then(model => {
                model.insertMany(json)
                    .then(() => {
                        console.log("Commodities records updated from EDDB");
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