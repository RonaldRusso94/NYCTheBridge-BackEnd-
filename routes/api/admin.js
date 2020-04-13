const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Admin = require('../../models/Admin');
const Artist = require('../../models/Artist');
const Album = require('../../models/Album');

// @route   POST api/admin
// @desc    Authenticate admin & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if admin exists
      let admin = await Admin.findOne({ email });

      if (!admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        admin: {
          id: admin.id,
        },
      };
      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/admin/register
// @desc    Register admin
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if admin exists
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Admin already exists' }] });
      }

      admin = new Admin({
        name,
        email,
        password,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      const payload = {
        admin: {
          id: admin.id,
        },
      };
      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/admin/auth
// @desc    Get Admin by token
// @access  Private
router.get('/auth', auth, async (req, res) => {
  try {
    const admin = await await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/artist
// @desc    Create artist
// @access  private
router.post(
  '/artist',
  [
    auth,
    [
      check('name', 'Artist name is required').not().isEmpty(),
      check('bio', 'Artist bio is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      bio,
      website,
      company,
      youtube,
      twitter,
      facebook,
      instagram,
      soundcloud,
    } = req.body;

    const artistFields = {};

    artistFields.name = name;
    artistFields.bio = bio;
    if (website) artistFields.website = website;
    if (company) artistFields.company = company;

    // Build social object
    artistFields.social = {};
    if (youtube) artistFields.social.youtube = youtube;
    if (twitter) artistFields.social.twitter = twitter;
    if (facebook) artistFields.social.facebook = facebook;
    if (instagram) artistFields.social.instagram = instagram;
    if (soundcloud) artistFields.social.soundcloud = soundcloud;

    try {
      // Create
      let artist = new Artist(artistFields);

      await artist.save();

      res.json(artist);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/admin/album
// @desc    Create album
// @access  Private
router.post(
  '/artist/:id/album',
  [auth, [check('title', 'Album title is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artist = await Artist.findById(req.params.id).select('id');

    const { title, songs } = req.body;

    const albumFields = {};
    albumFields.artist = artist;
    albumFields.title = title;
    albumFields.artist = artist;

    // Build song array
    albumFields.songs = [];
    if (songs) {
      songs.forEach((song) =>
        albumFields.songs.push({ songtitle: song.songtitle })
      );
    }

    try {
      // Create
      let album = new Album(albumFields);

      await album.save();

      res.json(album);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
