const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'album'
    }
  ],
  singles: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'single'
  },
  website: {
    type: String
  },
  company: {
    type: String
  },
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    soundcloud: {
      type: String
    }
  }
});

module.exports = Artist = mongoose.model('artist', ArtistSchema);
