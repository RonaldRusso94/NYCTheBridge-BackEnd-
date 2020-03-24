const mongoose = require('mongoose');

const SingleSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artist'
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = Single = mongoose.model('album', AlbumSchema);
