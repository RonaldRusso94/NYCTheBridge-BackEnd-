const express = require('express');
const router = express.Router();

const Artist = require('../../models/Artist');
const Single = require('../../models/Single')
const Album = require('../../models/Album')
const Genre = require('../../models/Genre')

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

// @route   GET api/browse/singles
// @desc    Get all singles
// @access  Public
router.get('/singles', async (req, res) => {
  try {
    // const albums = await Album.find();
    const singles = await Single.find();
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET api/browse/albums
// @desc    Get all albums
// @access  Public
router.get('/albums', async (req, res) => {
  try {
    // const albums = await Album.find();
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   GET api/browse/genres
// @desc    Get all genres
// @access  Public
router.get('/genres', async (req, res) => {
  try {
    // const albums = await Album.find();
    await Genre.find().sort('name').exec((error, items) => {
      if (error) return res.json({ error })
      else return res.json(items)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); // todo

module.exports = router;
