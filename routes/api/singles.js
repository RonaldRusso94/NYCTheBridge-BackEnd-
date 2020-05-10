const express = require('express');
const router = express.Router();

const Single = require('../../models/Single');

// @route   GET api/browse/singles
// @desc    Get all singles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const singles = await Single.find();
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/singles/:singleId
// @desc    Get a specific single
// @access  Public
router.get('/:singleId', async (req, res) => {
  try {
    const { singleId } = req.params;
    const singles = await Single.findById(singleId)
      .populate('artist')
      .populate({
        path: 'features',
        populate: { path: 'artists' },
      });
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/singles/search/:text
// @desc    Search all singles
// @access  Public
router.get('/search/:text', async (req, res) => {
  try {
    const text = req.params.text;

    const filtered = await Single.find({
      title: { $regex: text, $options: 'i' },
    });

    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/browse/singles
// @desc    Get Singles By Artist
// @access  Public
router.get('/artist/:artistId', async (req, res) => {
  try {
    const artistId = req.params.artistId;

    const singles = await Single.find({ artist: artistId });
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/browse/singles
// @desc    Get Singles By Featured
// @access  Public
router.get('/features/:featuredId', async (req, res) => {
  try {
    const featuredId = req.params.featuredId;

    const singles = await Single.find({ features: featuredId });
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
