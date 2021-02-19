const { Router } = require('express');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('server is up and running');
})

module.exports = router;