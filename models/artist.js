const mongoose = require("mongoose");

artistSchema = new mongoose.Schema({
  name: String,
});


module.exports = mongoose.model("Artist", artistSchema);
