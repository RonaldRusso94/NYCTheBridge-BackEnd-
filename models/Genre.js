const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = Genre = mongoose.model('genre', GenreSchema);
