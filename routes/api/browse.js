const express = require('express');
const router = express.Router();

const Artist = require('../../models/Artist');

// @route   GET api/browse/artist
// @desc    Get all artist
// @access  Public
router.get('/artist', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
