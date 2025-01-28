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
const allowedOrigins = ['http://localhost:3000', 'https://sonicjam.onrender.com', 'https://sonic-jam-4vqe.vercel.app'];

dotenv.config(); // Load .env variables

const app = express();

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

//app.use(express.json()); oldd
//console.log('MongoDB URI:', process.env.MONGO_URI);

// MongoDB Connection
// mongoose
//     .connect(process.env.MONGO_URI)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('MongoDB connection error:', err)); olldddd-------

console.log('MongoDB URI:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Routes
// app.get('/', (req, res) => {
//     res.send('Hello from SonicJam Backend');
// }); oldssddddd

app.get('/api/music', async (req, res) => {
  try {
    const music = await MusicModel.find(); // Fetch all records
    console.log('Fetched Music Data:', music);
    res.json(music);
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



