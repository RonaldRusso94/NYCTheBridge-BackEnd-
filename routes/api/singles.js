const express = require('express');
const router = express.Router();

const Single = require('../../models/Single');

// @route   GET api/browse/singles
// @desc    Get all singles
// @access  Public
router.get('/', async (req, res) => {
  try {
    // const albums = await Album.find();
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
      .populate('songs')
      .populate('artist');
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// MOVE TO AUTH ROUTE AND ADD AUTH
// @route   POST api/singles/
// @desc    Creates a new single
// @access  Private
router.post('/', (req, res) => {
  const { artist, title, songs } = req.body;
  try {
    const single = new Single({
      artist,
      title,
      songs,
    });
    single.save().then((s) => res.json(s));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
