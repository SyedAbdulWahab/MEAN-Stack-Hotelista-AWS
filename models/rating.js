const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


// Rating Model Definition
const ratingSchema = new Schema({
    rating: {type : String, required : true},
    ratedBy: { type: String },
  });
  
  // Export Module/Schema
  module.exports = mongoose.model('Rating', ratingSchema);