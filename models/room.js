/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Validate Function to check blog title length
let titleLengthChecker = (title) => {
    // Check if blog title exists
    if (!title) {
      return false; // Return error
    } else {
      // Check the length of title
      if (title.length < 5 || title.length > 50) {
        return false; // Return error if not within proper length
      } else {
        return true; // Return as valid title
      }
    }
  };
  
  // Validate Function to check if valid title format
  let alphaNumericTitleChecker = (title) => {
    // Check if title exists
    if (!title) {
      return false; // Return error
    } else {
      // Regular expression to test for a valid title
      const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
      return regExp.test(title); // Return regular expression test results (true or false)
    }
  };
  
  // Array of Title Validators
  const titleValidators = [
    // First Title Validator
    {
      validator: titleLengthChecker,
      message: 'Title must be more than 5 characters but no more than 50'
    },
    // Second Title Validator
    {
      validator: alphaNumericTitleChecker,
      message: 'Title must be alphanumeric'
    }
  ];

  // Validate Function to check comment length
let commentLengthChecker = (comment) => {
    // Check if comment exists
    if (!comment[0]) {
      return false; // Return error
    } else {
      // Check comment length
      if (comment[0].length < 1 || comment[0].length > 200) {
        return false; // Return error if comment length requirement is not met
      } else {
        return true; // Return comment as valid
      }
    }
  };
  
  // Array of Comment validators
  const commentValidators = [
    // First comment validator
    {
      validator: commentLengthChecker,
      message: 'Comments may not exceed 200 characters.'
    }
  ];

// Room Model Definition
const roomSchema = new Schema({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String},
    img: { type: String },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: String },
    price: {type: Number, required: true},
    roomType: {type: String, required: true},
    available: {type: Boolean, required: true}
    // comments: [{
    //   comment: { type: String, validate: commentValidators },
    //   commentator: { type: String }
    // }]
  }, {timestamps: true});
  
  // Export Module/Schema
  module.exports = mongoose.model('Room', roomSchema);
  
