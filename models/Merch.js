const mongoose = require('mongoose');

const MerchSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'artist',
  },
  link: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
});

module.exports = Merch = mongoose.model('merch', MerchSchema);
