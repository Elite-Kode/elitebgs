"use strict";

const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
    require('../models/systems')
        .then(systems => {
            systems.find({})
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
    require('../models/systems')
        .then(systems => {
            let name = req.params.name;
            systems.find({ name: name })
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