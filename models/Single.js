const mongoose = require('mongoose');

const SingleSchema = new mongoose.Schema({
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
  video: {
    type: Boolean,
    required: true,
  },
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'genre',
    },
  ],
  features: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artist',
    },
  ],

  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = Single = mongoose.model('single', SingleSchema);
