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
const Single = require('../../models/Single');
const Merch = require('../../models/Merch');

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
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/artist
// @desc    Create artist
// @access  Private
router.post(
  '/artist',
  [
    auth,
    [
      check('name', 'Artist name is required').notEmpty(),
      check('img', 'Image is required').notEmpty(),
      check('headerimg', 'Header image is required').notEmpty(),
      check('gallery', 'Gallery images are required').isArray({
        max: 3,
        min: 3,
      }),
      check('bio', 'Artist bio is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      img,
      headerimg,
      gallery,
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
    artistFields.img = img;
    artistFields.headerimg = headerimg;
    artistFields.bio = bio;
    if (website) artistFields.website = website;
    if (company) artistFields.company = company;

    // Build Img Gallery Array
    artistFields.gallery = [];
    gallery.forEach((x) => artistFields.gallery.push({ img: x.img }));

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

// @route   PUT api/admin/artist/:id
// @desc    Update artist
// @access  Private
router.put(
  '/artist/:id',
  [
    auth,
    [
      check('name', 'Artist name is required').notEmpty(),
      check('img', 'Image is required').notEmpty(),
      check('headerimg', 'Header image is required').notEmpty(),
      check('gallery', 'Gallery images are required').isArray({
        max: 3,
        min: 3,
      }),
      check('bio', 'Artist bio is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      img,
      headerimg,
      gallery,
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
    artistFields.img = img;
    artistFields.headerimg = headerimg;
    artistFields.bio = bio;
    if (website) artistFields.website = website;
    if (company) artistFields.company = company;

    // Build Img Gallery Array
    artistFields.gallery = [];
    gallery.forEach((x) => artistFields.gallery.push({ img: x.img }));

    // Build social object
    artistFields.social = {};
    if (youtube) artistFields.social.youtube = youtube;
    if (twitter) artistFields.social.twitter = twitter;
    if (facebook) artistFields.social.facebook = facebook;
    if (instagram) artistFields.social.instagram = instagram;
    if (soundcloud) artistFields.social.soundcloud = soundcloud;

    let artist = await Artist.findOne({ _id: req.params.id });

    try {
      if (artist) {
        // Update
        artist = await Artist.findOneAndUpdate(
          { _id: req.params.id },
          { $set: artistFields },
          { new: true }
        );
        return res.json(artist);
      } else {
        res.status(404).send('Artist not found');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/admin/artist/:id
// @desc    Delete artist, albums, and singles
// @access  Private
router.delete('/artist/:id', auth, async (req, res) => {
  try {
    // Remove Singles
    await Single.deleteMany({ artist: req.params.id });

    // Remove Albums
    await Album.deleteMany({ artist: req.params.id });

    // Remove Artist
    await Artist.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: 'Artist deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/artist/:artistId/album
// @desc    Create album
// @access  Private
router.post(
  '/artist/:artistId/album',
  [
    auth,
    [
      check('title', 'Album title is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('genres', 'Genre is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if artist exist
    const artist = await Artist.findById(req.params.artistId).select('id');

    if (artist === null) {
      return res.status(404).send('Artist not found');
    }

    const { title, img, songs, genres, features, url } = req.body;

    const albumFields = {};
    albumFields.artist = artist;
    albumFields.img = img;
    albumFields.title = title;
    albumFields.url = url;

    // Build song array
    albumFields.songs = [];
    if (songs) {
      songs.forEach((song) =>
        albumFields.songs.push({ songtitle: song.songtitle })
      );
    }

    // Build genre array
    albumFields.genres = [];
    if (genres) {
      genres.forEach((genre) => {
        albumFields.genres.push({ _id: genre._id });
      });
    }

    // Build feature array
    albumFields.features = [];
    let promises = [];

    features.forEach((feature) => {
      const doesArtistExist = Artist.exists({ _id: feature._id });
      console.log('doesartistexist', doesArtistExist);

      promises.push(doesArtistExist);
    });

    let status = 200;
    await Promise.all(promises)
      .then((results) => {
        let i = 0;
        for (const feature of results) {
          if (feature == false) {
            console.log('err');
          }
          if (feature == true) albumFields.features.push(features[i]._id);
          else {
            status = 404;
          }
          i++;
        }
        console.log('result', results);
        console.log('albumFields', albumFields.features);
      })
      .catch((err) => {
        console.log(err);
      });

    albumFields.features.map((feature, index) => {
      for (let i = index + 1; i < albumFields.features.length; i++) {
        if (feature == albumFields.features[i]) {
          console.log('duplicates found');
          status = 500;
        }
      }
    });

    if (status == 500) res.status(500).send('Featured Artist is duplicate');
    else if (status == 404)
      res.status(404).send('Featured Artist Does Not Exist');
    else {
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
  }
);

// @route   PUT api/admin/artist/:artistId/album/:albumId
// @desc    Update album
// @access  Private
router.put(
  '/artist/:artistId/album/:albumId',
  [
    auth,
    [
      check('title', 'Album title is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('genres', 'Genre is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get album by ID
    let album = await Album.findById(req.params.albumId);

    const { title, img, songs, genres, features, url } = req.body;

    const albumFields = {};
    albumFields.img = img;
    albumFields.title = title;
    albumFields.url = url;

    // Build song array
    albumFields.songs = [];
    if (songs) {
      songs.forEach((song) =>
        albumFields.songs.push({ songtitle: song.songtitle })
      );
    }

    // Build genres array
    albumFields.genres = [];
    if (genres) {
      genres.forEach((genre) => {
        albumFields.genres.push({ _id: genre._id });
      });
    }

    // Build feature array
    albumFields.features = [];
    if (features) {
      features.forEach((feature) =>
        albumFields.features.push({ _id: feature._id })
      );
    }

    try {
      // Update
      if (req.params.artistId === album.artist.toString()) {
        album = await Album.findOneAndUpdate(
          { _id: req.params.albumId },
          { $set: albumFields },
          { new: true }
        );
        res.json(album);
      } else {
        res.status(500).send('Album was not created by artist');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/admin/artist/:artistId/album/:albumId
// @desc    Delete album
// @access  Private
router.delete('/artist/:artistId/album/:albumId', auth, async (req, res) => {
  // Get album by ID
  let album = await Album.findById(req.params.albumId);

  try {
    // Delete with checks
    if (req.params.artistId === album.artist.toString()) {
      await Album.findOneAndRemove({ _id: req.params.albumId });
      res.json({ msg: 'Album deleted' });
    } else {
      res.status(500).send('Artist does not match album');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!!');
  }
});

// @route   POST api/admin/genres
// @desc    Create genre
// @access  Private
router.post(
  '/genre',
  [
    auth,
    [
      check('genre', 'Genre name is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { genre, img } = req.body;

    const genreFields = {};

    genreFields.genre = genre;
    genreFields.img = img;

    try {
      // Create
      let genre = new Genre(genreFields);

      await genre.save();

      res.json(genre);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/admin/artist/:artistId/single
// @desc    Create single
// @access  Private
router.post(
  '/artist/:artistId/single',
  [
    auth,
    [
      check('title', 'Single title is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('genres', 'Genre title is required').not().isEmpty(),
      check('video', 'Video is not defined').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if artist exist
    const artist = await Artist.findById(req.params.artistId).select('id');

    if (artist === null) {
      return res.status(404).send('Artist not found');
    }

    const { title, img, genres, video, features, url } = req.body;

    const singleFields = {};
    singleFields.artist = artist;
    singleFields.title = title;
    singleFields.img = img;
    singleFields.url = url;
    singleFields.video = video;

    // Build genre field
    singleFields.genres = [];
    if (genres) {
      genres.forEach((genre) => {
        singleFields.genres.push({ _id: genre._id });
      });
    }

    // Build feature array
    singleFields.features = [];
    if (features) {
      features.forEach((feature) =>
        singleFields.features.push({ _id: feature._id })
      );
    }

    try {
      // Create
      let single = new Single(singleFields);

      await single.save();

      res.json(single);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/admin/artist/:artistId/single/:singleId
// @desc    Update single
// @access  Private
router.put(
  '/artist/:artistId/single/:singleId',
  [
    auth,
    [
      check('title', 'Single title is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('genres', 'Genre title is required').not().isEmpty(),
      check('video', 'Video is not defined').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, img, genres, video, features, url } = req.body;

    const singleFields = {};
    singleFields.title = title;
    singleFields.video = video;
    singleFields.img = img;
    singleFields.url = url;

    // Build genre field
    singleFields.genres = [];
    if (genres) {
      genres.forEach((genre) => {
        singleFields.genres.push({ _id: genre._id });
      });
    }

    // Build feature array
    singleFields.features = [];
    if (features) {
      features.forEach((feature) =>
        singleFields.features.push({ _id: feature._id })
      );
    }

    // Get single by ID
    let single = await Single.findById(req.params.singleId);

    try {
      // Update with checks
      if (req.params.artistId === single.artist.toString()) {
        single = await Single.findOneAndUpdate(
          { _id: req.params.singleId },
          { $set: singleFields },
          { new: true }
        );
        res.json(single);
      } else {
        res.status(404).send('Single was not created by artist');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/admin/artist/:artistId/single/:singleId
// @desc    DELETE single
// @access  Private
router.delete('/artist/:artistId/single/:singleId', auth, async (req, res) => {
  // Get single by ID
  let single = await Single.findById(req.params.singleId);

  try {
    // Delete with checks
    if (req.params.artistId === single.artist.toString()) {
      await Single.findOneAndRemove({ _id: req.params.singleId });
      res.json({ msg: 'Single deleted' });
    } else {
      res.status(500).send('Artist does not match single');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/admin/merch/:artistId
// @desc    Create Artist Merch
// @access  Private
router.post(
  '/merch/:artistId',
  [
    auth,
    [
      check('link', 'Link is required').not().isEmpty(),
      check('img', 'Image is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if artist exist
    const artist = await Artist.findById(req.params.artistId).select('id');

    if (artist === null) {
      return res.status(404).send('Artist not found');
    }

    const { link, img } = req.body;

    const merchFields = {};
    merchFields.artist = artist;
    merchFields.link = link;
    merchFields.img = img;

    try {
      // Create
      let merch = new Merch(merchFields);

      await merch.save();

      res.json(merch);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
