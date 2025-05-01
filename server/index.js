require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const MusicModel = require('./models/MyModel'); // music data schema
//routes and middleware
const authRoutes = require('../routes/auth');
const authMiddleware = require('../middleware/authMiddleware');
const videoRoutes = require('../routes/videos');
const postRoutes = require('../routes/post');

const app = express();

// CORS Configuration for local and deployed verion
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://sonicjam.onrender.com', 
    'https://sonic-jam-4vqe.vercel.app'
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//serve static uploads and set headers in order to prevent CORB (cross-origin read blocking)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Fix CORB Blocking
    res.setHeader('Access-Control-Allow-Origin', '*');//new
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');//new
  }
}));

//parse JSON bodies
app.use(express.json());

//ensure MongoDB connects before routes load
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    //ensure connection is fully ready
    console.log("--- Waiting for Mongoose to be ready...");
    while (mongoose.connection.readyState !== 1) {
      console.log(`Mongoose state: ${mongoose.connection.readyState}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log("Mongoose is Ready!");
    startServer();
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

function startServer() {
  //api routes mount
  app.use('/api/auth', authRoutes);
  app.use('/api/videos', videoRoutes);
  app.use('/api/posts', postRoutes);

  //endpoint check (working)
  app.get('/api/test', (req, res) => {
    res.json({ msg: "API is working!" });
  });

  // Music API Route to return songs from the database
  app.get('/api/music', async (req, res) => {
    try {
      const music = await MusicModel.find();

      //remove duplicated songs / display only unique songs
      const uniqueSongs = Object.values(
        music.reduce((acc, song) => {
          const key = `${song.title}-${song.artist}-${song.key}`;
          if (!acc[key] || acc[key].ratings < song.ratings) {
            acc[key] = song;
          }
          return acc;
        }, {})
      );

      console.log('Filtered Music Data: Completed', uniqueSongs);
      res.json(uniqueSongs);
    } catch (err) {
      console.error('Error fetching music data:', err);
      res.status(500).json({ error: 'Failed to fetch music data' });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
connectDB();

