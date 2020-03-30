const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/browse', require('./routes/api/browse'));
app.use('/api/songs', require('./routes/api/songs'));
app.use('/api/singles', require('./routes/api/singles'));
app.use('/api/genres', require('./routes/api/genres'));
// app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
