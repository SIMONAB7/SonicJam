const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const MusicModel = require('./models/MyModel'); //mongoDB model for music entries

dotenv.config(); //load environment variables
console.log('MongoDB URI:', process.env.MONGO_URI);
//connect to MongoDB and seed the music database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');

    //debugging: ensure model is imported correcly
    console.log('MusicModel:', MusicModel);

    //read the JSON file 
    const data = JSON.parse(fs.readFileSync('./transformed_guitarDB.json', 'utf-8'));

    //insert the data into the Music collection
    return MusicModel.insertMany(data);
  })
  .then(() => {
    console.log('Data seeded successfully!');
    mongoose.connection.close(); //close the connection after seeding
  })
  .catch((err) => {
    console.error('Error:', err);
    mongoose.connection.close();//ensure connection is closed even on error
  });

  
