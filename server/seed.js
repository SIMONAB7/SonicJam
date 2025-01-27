// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// // const DataSchema = new mongoose.Schema({
// //   name: String,
// //   value: String,
// // }); 

// const MusicSchema = new mongoose.Schema({
//   title: String, // Song Name
//   artist: String, // Artist
//   ratings: Number, // Song Rating
//   hits: Number, // Song Hits
//   pageType: String, // Page Type (Chords/Tab)
//   difficulty: String, // Difficulty
//   key: String, // Key of the song
//   capo: String, // Capo position
//   tuning: String // Tuning of the guitar
// });


// // const DataModel = mongoose.model('Data', DataSchema);

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//     return DataModel.insertMany([
//       { name: 'Test 1', value: 'Hello from SonicJam!' },
//       { name: 'Test 2', value: 'More data from SonicJam!' },
//     ]);
//   })
//   .then(() => {
//     console.log('Sample data added!');
//     mongoose.connection.close();
//   })
//   .catch((err) => console.error(err));


const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const MusicModel = require('./models/MyModel'); // Ensure this path is correct
// const MusicModel = require('./transformed_guitarDB.json'); // Update the path if your model is in a different file

dotenv.config(); // Load environment variables
console.log('MongoDB URI:', process.env.MONGO_URI);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Debugging step: Check if MusicModel is loaded
    console.log('MusicModel:', MusicModel);

    // Read the JSON file
    const data = JSON.parse(fs.readFileSync('./transformed_guitarDB.json', 'utf-8'));

    // Insert the data into the Music collection
    return MusicModel.insertMany(data);
  })
  .then(() => {
    console.log('Data seeded successfully!');
    mongoose.connection.close(); // Close the connection after seeding
  })
  .catch((err) => {
    console.error('Error:', err);
    mongoose.connection.close();
  });

  
