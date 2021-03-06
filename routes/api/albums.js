const express = require('express');
const router = express.Router();

const Album = require('../../models/Album');

// @route   GET api/albums
// @desc    Get All Albums
// @access  Public
router.get('/', async (req, res) => {
  try {
    const albums = await Album.find().populate({
      path: 'artist',
      select: 'name',
    });
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums/genre/genreId
// @desc    Get Album By Genre
// @access  Public
router.get('/genre/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const albums = await Album.find({ genres: { _id: genreId } }).populate({
      path: 'artist',
      select: 'name',
    });
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums/:albumId
// @desc    Get a specific album
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

// @route   GET api/albums/search/:text
// @desc    Get Album By Search
// @access  Public
router.get('/search/:text', async (req, res) => {
  try {
    const text = req.params.text;

    const filtered = await Album.find({
      title: { $regex: text, $options: 'i' },
    }).populate({
      path: 'artist',
      select: 'name',
    });

    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/albums
// @desc    Get Albums By Artist
// @access  Public
router.get('/artist/:artistId', async (req, res) => {
  try {
    const artistId = req.params.artistId;

    const albums = await Album.find({ artist: artistId });

    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!!');
  }
});

// @route   GET api/albums/features/featuredId
// @desc    Get Albums By Featured
// @access  Public
router.get('/features/:featuredId', async (req, res) => {
  try {
    const featuredId = req.params.featuredId;

    const albums = await Album.find({ features: featuredId });
    res.json(albums);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
