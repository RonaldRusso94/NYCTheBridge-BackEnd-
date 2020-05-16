const express = require('express');
const router = express.Router();

const Merch = require('../../models/Merch');

// @route   GET api/merch/artistId
// @desc    Get All Merch
// @access  Public
router.get('/:artistId', async (req, res) => {
  try {
    const artistId = req.params.artistId;

    try {
      const merch = await Merch.find({ artist: artistId });
      res.json(merch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
