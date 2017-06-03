"use strict";

const factionsModel = require('../../models/factions');

module.exports.import = () => {
    factionsModel.then(model => {
        model.insertMany(require('../../dumps/factions.json'))
            .then(() => {
                console.log("Factions records updated from EDDB");
            })
            .catch((err) => {
                console.log(err);
            });
    });
}