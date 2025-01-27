const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");
// const MyModel = require('./models/MyModel');
const cors = require('cors');
// const MusicSchema = require('./models/MyModel')
const MusicModel = require('./models/MyModel');

dotenv.config(); // Load .env variables

const app = express();

// Middleware
app.use(express.json());
console.log('MongoDB URI:', process.env.MONGO_URI);
// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from SonicJam Backend');
});

// Example Schema
const DataSchema = new mongoose.Schema({
    name: String,
    value: String,
  });
  
  const DataModel = mongoose.model('Data', DataSchema);
  


app.use(cors());


app.get('/api/music', async (req, res) => {
  try {
    const music = await MusicModel.find(); // Fetch all records
    console.log('Fetched Music Data:', music); // Add this log
    res.json(music);
  } catch (err) {
    console.error('Error fetching music data:', err);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});


// test route to fetch data
// app.get('/api/data', async (req, res) => {
//     try {
//       const data = await DataModel.find();
//       res.json(data);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       res.status(500).json({ error: 'Failed to fetch data from the database' });
//     }
//   });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



