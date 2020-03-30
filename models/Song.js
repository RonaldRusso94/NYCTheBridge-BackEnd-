const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artist"
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date
  }
});

module.exports = Song = mongoose.model("song", SongSchema);
