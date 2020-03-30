const express = require("express");
const router = express.Router();

const Song = require("../../models/Song");

// @route   GET api/songs
// @desc    Get all songs
// @access  Public
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find()
    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.post("/", (req, res) => {
    const { id, title } = req.body
  try {
   const song = new Song({
       id,
       title
   })
   song.save(s => {
       res.json({ song })
   })
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
