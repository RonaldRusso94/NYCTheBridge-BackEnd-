const express = require('express');
const router = express.Router();

// @route   GET api/artist
// @desc    Get artist profile
// @access  Public
router.get('/', (req, res) => res.send('Artist route'));

module.exports = router;
