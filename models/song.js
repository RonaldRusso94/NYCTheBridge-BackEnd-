const mongoose = require("mongoose");

schema = new mongoose.Schema({
  name: String,
  artist: {
  	type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
   }
});


module.exports = mongoose.model("Song", schema);
