const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');

const app = express();
app.use(cors());

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/artists', require('./routes/api/artists'));
app.use('/api/albums', require('./routes/api/albums'));
app.use('/api/singles', require('./routes/api/singles'));
app.use('/api/genres', require('./routes/api/genres'));
app.use('/api/merch', require('./routes/api/merch'));
// app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
