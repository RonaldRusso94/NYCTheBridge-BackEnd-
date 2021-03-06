const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artist',
  },
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  songs: [
    {
      songtitle: {
        type: String,
        required: true,
      },
    },
  ],
  features: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artist',
    },
  ],
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'genre',
    },
  ],
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = Album = mongoose.model('album', AlbumSchema);
