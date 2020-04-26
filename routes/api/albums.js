const express = require('express');
const router = express.Router();

const Album = require('../../models/Album');

// @route   GET api/albums
// @desc    Get all albums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums/:albumId
// @desc    Gets a specific album
// @access  Public
router.get('/:albumId', async (req, res) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId)
      .populate('artist')
      .populate({
        path: 'features',
        populate: { path: 'artists' },
      });
    res.json(album);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
