"use strict";

const stationsModel = require('../../models/stations');

module.exports.import = () => {
    stationsModel.then(model => {
        model.insertMany(require('../../dumps/stations.json'))
            .then(() => {
                console.log("Stations records updated from EDDB");
            })
            .catch((err) => {
                console.log(err);
            });
    });
}