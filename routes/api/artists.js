const express = require('express');
const router = express.Router();

const Artist = require('../../models/Artist');

// @route   GET api/artist
// @desc    Get all artist
// @access  Public
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/artist/:artistId
// @desc    Get specific artist
// @access  Public
router.get('/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const artist = await Artist.findById(artistId);
    res.json(artist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
