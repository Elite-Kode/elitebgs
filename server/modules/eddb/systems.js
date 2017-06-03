"use strict";

const path = require('path');
const systemsModel = require('../../models/systems');

module.exports.import = () => {
    require('../utilities').csvToJson(path.resolve(__dirname, '../../dumps/systems.csv'))
        .then(json => {
            systemsModel.then(model => {
                model.insertMany(json)
                    .then(() => {
                        console.log("Systems records updated from EDDB");
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