"use strict";

const populatedSystemsModel = require('../../models/populated_systems');

module.exports.import = () => {
    populatedSystemsModel.then(model => {
        model.insertMany(require('../../dumps/systems_populated.json'))
            .then(() => {
                console.log("Populated systems records updated from EDDB");
            })
            .catch((err) => {
                console.log(err);
            });
    });
}