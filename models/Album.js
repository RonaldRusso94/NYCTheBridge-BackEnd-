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
  songs: [
    {
      songtitle: {
        type: String,
        required: true,
      },
    },
  ],
  genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'genre' }],
  date: {
    type: Date,
  },
});

module.exports = Album = mongoose.model('album', AlbumSchema);
