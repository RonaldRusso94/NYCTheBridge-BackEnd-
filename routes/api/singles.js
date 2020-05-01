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

    // const filtered = await Artist.find({
    //   name: { $regex: text, $options: 'i' },
    // });

    res.json(filtered);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
