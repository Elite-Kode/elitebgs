"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/stations')
        .then(stations => {
            let query = new Object;

            if (req.query.controllingfaction) {
                query.controlling_minor_faction_id = req.query.controllingfaction;
            }
            if (req.query.allegiance) {
                query.allegiance_id = req.query.allegiance;
            }
            if (req.query.government) {
                query.government_id = req.query.government;
            }
            if (req.query.planetary) {
                query.is_planetary = req.query.planetary;
            }
            factions.find(query)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/name/:name', (req, res) => {
    require('../models/stations')
        .then(stations => {
            let name = req.params.name;
            stations.find({ name: name })
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

module.exports = router;