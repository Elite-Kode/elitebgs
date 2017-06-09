"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/populated_systems')
        .then(populatedSystem => {
            populatedSystem.find({})
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
    require('../models/populated_systems')
        .then(populatedSystem => {
            let name = req.params.name;
            populatedSystem.find({ name: name })
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