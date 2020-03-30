const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: new Date
  }
});

module.exports = Genre = mongoose.model("genre", GenreSchema);
