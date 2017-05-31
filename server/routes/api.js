const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('api works');
});

module.exports = router;