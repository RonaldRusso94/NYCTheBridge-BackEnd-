const mongoose = require('mongoose');

const SingleSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "artist"
  }, // right now questionable, techincally only need the name of the artist
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: new Date
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "song"
    }
  ]
});

module.exports = Single = mongoose.model('single', SingleSchema);
