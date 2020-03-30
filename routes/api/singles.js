const express = require("express");
const router = express.Router();

const Single = require("../../models/Single");

// @route   GET api/singles/:singleId
// @desc    Get a specific single
// @access  Public

router.get("/:singleId", async (req, res) => {
  try {
    const { singleId } = req.params;
    const singles = await Single.findById(singleId).populate('songs').populate('artist');
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/singles/
// @desc    Creates a new single
// @access  Private
router.post("/", (req, res) => {
  const { artist, title, songs } = req.body;
  try {
    const single = new Single({
      artist,
      title,
      songs
    });
    single.save(s => {
      res.json({ single });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
