const express = require("express");
const router = express.Router();

const Genre = require("../../models/Genre");

// @route   GET api/singles/:singleId
// @desc    Get a specific single
// @access  Public

router.get("/:singleId", async (req, res) => {
  try {
    const { singleId } = req.params;
    const singles = await Single.findById(singleId)
      .populate("songs")
      .populate("artist");
    res.json(singles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/genres/
// @desc    Creates a new genre
// @access  Private
router.post("/", (req, res) => {
  const { name } = req.body;
  try {
    const genre = new Genre({
      name
    });
    genre.save().then(g => res.json(g));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
