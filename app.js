const express = require("express");
const mongoose = require("mongoose");
const Artist = require("./models/artist");
const Song = require("./models/song");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

//Search function
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



// Landing Page
app.get("/", (req, res) => {
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    // Get all artist from the DB
    Artist.find({name: regex}, function(err, allArtists) {
      if (err) {
        console.log(err);
      } else {
        res.render("landing", { artists: allArtists });
      }
    });
  } else {
    // Get all artist from the DB
    Artist.find({}, function(err, allArtists) {
      if (err) {
        console.log(err);
      } else {
        res.render("landing", { artists: allArtists });
      }
    });
  }
});







// CREATE ROUTE - add new artist to DB
app.post("/artist", (req, res) => {
  const { 
    name
  } = req.body;
  
  const artist = {
    name: name
  };

  console.log("Artist data: ", artist);

  Artist.create(artist, (err, data) => {

    if(err){
      console.log("Res: ", res);
      console.log("Error:", err);
    } else{
      console.log("Res: ", res);
      res.redirect("/");
    }
  });
});

// CREATE ROUTE - add new song to DB
app.post("/song", (req, res) => {
  const {
    name,
    artist,
    image,
    content,
    description,
    category
    } = req.body;

  console.log("REQ: ", req.body);
  
  const song = {
    name: name,
    artist: artist
  };

  console.log("Song data: ", song);

  Song.create(song, (err, data) => {

    if(err){
      console.log("Error:", err);
    } else{
      res.redirect("/");
    }
  });
});










// Songs Page
app.get("/songs", (req, res) => {
  Artist.find({category: 'song'}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("songs", { artists: allArtists });
    }
  });
});

// Videos Page
app.get("/videos", (req, res) => {
  Artist.find({category: 'video'}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("videos", { artists: allArtists });
    }
  });
});

// MixTapes Page
app.get("/mixtapes", (req, res) => {
  Artist.find({category: 'mixtape'}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("mixtapes", { artists: allArtists });
    }
  });
});

// Productions Page
app.get("/productions", (req, res) => {
  Artist.find({category: 'production'}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("productions", { artists: allArtists });
    }
  });
});



// NEW ROUTE - show form to create new artist
app.get("/new", function(req, res) {
  res.render("new.ejs");
});

// NEW ROUTE - show form to create new artist
app.get("/artist", function(req, res) {
  res.render("create_artist.ejs");
});

// NEW ROUTE - show form to create new artist
app.get("/song", function(req, res) {

Artist.find({}, function(err, allArtists) {
    if (err) {
      console.log(err);
    } else {
      res.render("create_song", { artists: allArtists });
    }
  });
});



// SHOW ROUTE - shows more info about one artist
app.get("/artist/:id", function(req, res){
    // Find the artist with provided ID
    Artist.findById(req.params.id, function(err, foundArtist){
        if(err){
            console.log(err);
        } else {
            // Render show template with that song
            res.render("show", {artist: foundArtist});
        }
    });
});



// Server config
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
