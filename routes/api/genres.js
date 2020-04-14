const express = require('express');
const router = express.Router();

const Genre = require('../../models/Genre');

// @route   GET api/genres
// @desc    Get all genres
// @access  Public
router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/genre/:genreId
// @desc    Get specific genre
// @access  Public
router.get('/:genreId', async (req, res) => {
  try {
    const { genreId } = req.params;
    const genre = await Genre.findById(genreId);
    res.json(genre);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
