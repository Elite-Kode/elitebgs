"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/bodies')
        .then(bodies => {
            let query = new Object;

            if (req.query.ringtype) {
                query.ring_type_id = req.query.ringtype;
            }
            if (req.query.system) {
                query.system_id = req.query.system;
            }
            if (req.query.bodygroup) {
                query.group_id = req.query.bodygroup;
            }
            if (req.query.distancearrival) {
                query.distance_to_arrival = req.query.distancearrival;
            }
            if (req.query.landable) {
                query.is_landable = req.query.landable;
            }
            bodies.find(query)
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
    require('../models/bodies')
        .then(bodies => {
            let name = req.params.name;
            bodies.find({ name: name })
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