"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/factions')
        .then(factions => {
            let query = new Object;

            if (req.query.allegiance) {
                query.allegiance_id = req.query.allegiance;
            }
            if (req.query.government) {
                query.government_id = req.query.government;
            }
            if (req.query.state) {
                query.state_id = req.query.state;
            }
            if (req.query.playerfaction) {
                query.is_player_faction = req.query.playerfaction;
            }
            if (req.query.homesystem) {
                query.home_system_id = req.query.homesystem;
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
    require('../models/factions')
        .then(factions => {
            factions.find({ name: name })
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