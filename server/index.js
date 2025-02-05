const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const username = encodeURIComponent("<username>");
const password = encodeURIComponent("<password>");
// const MyModel = require('./models/MyModel');
// const MusicSchema = require('./models/MyModel')
const MusicModel = require('./models/MyModel');

dotenv.config(); // Load .env variables

const app = express();

const allowedOrigins = ['http://localhost:3000', //local
 'https://sonicjam.onrender.com', //render backend
 'https://sonic-jam-4vqe.vercel.app']; //vercel front


// //--------

// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });
// //-----testing

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());

console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


// app.get('/api/music', async (req, res) => {
//   try {
//     const music = await MusicModel.find(); // Fetch all records
//     console.log('Fetched Music Data:', music);
//     res.json(music);
//   } catch (err) {
//     console.error('Error fetching music data:', err);
//     res.status(500).json({ error: 'Failed to fetch music data' });
//   }
// });

app.get('/api/music', async (req, res) => {
  try {
    // Fetch all records
    const music = await MusicModel.find();

    // Filter out duplicate songs (keep highest rated version for each title, artist, and key)
    const uniqueSongs = Object.values(
      music.reduce((acc, song) => {
        const key = `${song.title}-${song.artist}-${song.key}`;
        if (!acc[key] || acc[key].ratings < song.ratings) {
          acc[key] = song;
        }
        return acc;
      }, {})
    );

    console.log('Filtered Music Data:', uniqueSongs);
    res.json(uniqueSongs);
  } catch (err) {
    console.error('Error fetching music data:', err);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});


// Example Schema
const DataSchema = new mongoose.Schema({
    name: String,
    value: String,
  });
  
  const DataModel = mongoose.model('Data', DataSchema);
  


app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle any other routes and serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
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

//Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



