const mongoose = require("mongoose");

socialSchema = new mongoose.Schema({
  soundcloud: String,
  scName: String,
  instagram: String,
  igName: String,
  twitter: String,
  twName: String
});
module.exports = mongoose.model("Socials", socialSchema);
