const express = require('express');
const router = express.Router();

const Artist = require('../../models/Artist');

// @route   GET api/artists
// @desc    Get all artists
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

// @route   GET api/artists/search/:text
// @desc    Search all artists
// @access  Public
router.get('/search/:text', async (req, res) => {
  try {
    const text = req.params.text; //this is the way to access the text params

    let text2 = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== '+') text2.push(text[i]);
      else text2.push(' ');
    }
    text2 = text2.join('');

    // const filtered = await Artist.find({ name: text2 });

    const filtered = await Artist.find({
      name: { $regex: text, $options: 'i' },
    });
    console.log('text', text2);
    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/artists/:artistId
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
