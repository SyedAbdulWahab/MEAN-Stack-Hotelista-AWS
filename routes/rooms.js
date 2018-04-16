const User = require('../models/user'); // Import User Model Schema
const Room = require('../models/room'); // Import Room Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const Rating = require('../models/rating');

module.exports = (router) => {

  /* ===============================================================
     CREATE NEW ROOM
  =============================================================== */
  router.post('/newRoom', (req, res) => {
    // Check if room title was provided
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'Room title is required.'
      }); // Return error message
    } else {
      // Check if room price was provided
      if (!req.body.price) {
        res.json({
          success: false,
          message: 'Room price is required.'
        }); // Return error message
      } else {

        if (!req.body.body) {
          res.json({
            success: false,
            message: 'Room body is required.'
          }); // Return error message
        } else {

          if (!req.body.roomType) {
            res.json({
              success: false,
              message: 'Room Type is required.'
            }); // Return error message
          } else {

            if (req.body.available != true && req.body.available != false) {
              res.json({
                success: false,
                message: 'Room availability is required.'
              }); // Return error message
            } else {

              // Create the room object for insertion into database
              const room = new Room({
                title: req.body.title, // Title field
                body: req.body.body,
                price: req.body.price, // Body field
                isBooked: false,
                roomType: req.body.roomType,
                available: req.body.available
              });
              // Save room into database
              room.save((err) => {
                // Check if error
                if (err) {
                  // Check if error is a validation error
                  if (err.errors) {
                    // Check if validation error is in the title field
                    if (err.errors.title) {
                      res.json({
                        success: false,
                        message: err.errors.title.message
                      }); // Return error message
                    } else {
                      res.json({
                        success: false,
                        message: err
                      }); // Return general error message
                    }
                  }
                } else {
                  res.json({
                    success: true,
                    message: 'Room saved!'
                  }); // Return success message
                }
              });
            }
          }
        }
      }
    }
  });


  router.post('/newRating', (req, res) => {

    if (!req.body.score) {
      res.json({
        success: false,
        message: 'Rating is required.'
      }); // Return error message
    } else {

      User.findOne({
        _id: req.decoded.userId
      }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({
            success: false,
            message: err
          }); // Return error message
        } else {
          // Check if user was found in the database
          if (!user) {
            res.json({
              success: false,
              message: 'Unable to authenticate user.'
            }); // Return error message
          } else {

            const rating = new Rating({
              rating: req.body.score,
              ratedBy: user.username
            });

            rating.save((err) => {
              // Check if error
              if (err) {

                res.json({
                  success: false,
                  message: err
                }); // Return general error message


              } else {
                res.json({
                  success: true,
                  message: 'Rating saved!'
                }); // Return success message
              }
            });

          }
        }
      });

    }
  });



  /* ===============================================================
     GET ALL ROOMS
  =============================================================== */
  router.get('/allRooms', (req, res) => {
    // Search database for all room posts
    Room.find({}, (err, rooms) => {
      // Check if error was found or not
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error message
      } else {
        // Check if rooms were found in database
        if (!rooms) {
          res.json({
            success: false,
            message: 'No rooms found.'
          }); // Return error of no rooms found
        } else {
          res.json({
            success: true,
            rooms: rooms
          }); // Return success and rooms array
        }
      }
    }).sort({
      '_id': -1
    }); // Sort rooms from newest to oldest
  });

  /* ===============================================================
     GET ALL USERS
  =============================================================== */
  router.get('/allUsers', (req, res) => {
    // Search database for all user posts
    User.find({}, (err, users) => {
      // Check if error was found or not
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error message
      } else {
        // Check if users were found in database
        if (!users) {
          res.json({
            success: false,
            message: 'No users found.'
          }); // Return error of no users found
        } else {
          res.json({
            success: true,
            users: users
          }); // Return success and users array
        }
      }
    }).sort({
      '_id': -1
    }); // Sort users from newest to oldest
  });

  /* ===============================================================
     GET SINGLE ROOM
  =============================================================== */
  router.get('/singleRoom/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No room ID was provided.'
      }); // Return error message
    } else {
      // Check if the room id is found in database
      Room.findOne({
        _id: req.params.id
      }, (err, room) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid room id'
          }); // Return error message
        } else {
          // Check if room was found by id
          if (!room) {
            res.json({
              success: false,
              message: 'Room not found.'
            }); // Return error message
          } else {
            res.json({
              success: true,
              room: room
            }); // Return success
          }
        }
        // });
        // }
        // }
      });
    }
  });

  /* ===============================================================
     GET SINGLE USER
  =============================================================== */
  router.get('/singleUser/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No user ID was provided.'
      }); // Return error message
    } else {
      // Check if the user id is found in database
      User.findOne({
        _id: req.params.id
      }, (err, user) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid user id'
          }); // Return error message
        } else {
          // Check if user was found by id
          if (!user) {
            res.json({
              success: false,
              message: 'User not found.'
            }); // Return error message
          } else {
            res.json({
              success: true,
              user: user
            }); // Return success
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE BLOG POST
  =============================================================== */
  router.put('/updateRoom', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({
        success: false,
        message: 'No room id provided'
      }); // Return error message
    } else {
      // Check if id exists in database
      Room.findOne({
        _id: req.body._id
      }, (err, room) => {
        // Check if id is a valid ID
        if (err) {
          res.json({
            success: false,
            message: 'Not a valid room id'
          }); // Return error message
        } else {
          // Check if id was found in the database
          if (!room) {
            res.json({
              success: false,
              message: 'Room id was not found.'
            }); // Return error message
          } else {
            room.title = req.body.title; // Save latest room title
            room.body = req.body.body; // Save latest body
            room.price = req.body.price; // Save latest body
            room.available = req.body.available;
            room.roomType = req.body.roomType;
            room.save((err) => {
              if (err) {
                if (err.errors) {
                  res.json({
                    success: false,
                    message: 'Please ensure form is filled out properly'
                  });
                } else {
                  res.json({
                    success: false,
                    message: err
                  }); // Return error message
                }
              } else {
                res.json({
                  success: true,
                  message: 'Room Updated!'
                }); // Return success message
              }
            });
          }
        }
      });
      // });
    }
  });

  /* ===============================================================
     DELETE ROOM
  =============================================================== */
  router.delete('/deleteRoom/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No id provided'
      }); // Return error message
    } else {
      // Check if id is found in database
      Room.findOne({
        _id: req.params.id
      }, (err, room) => {
        // Check if error was found
        if (err) {
          res.json({
            success: false,
            message: 'Invalid id'
          }); // Return error message
        } else {
          // Check if room was found in database
          if (!room) {
            res.json({
              success: false,
              messasge: 'Room was not found'
            }); // Return error message
          } else {
            room.remove((err) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                }); // Return error message
              } else {
                res.json({
                  success: true,
                  message: 'Room deleted!'
                }); // Return success message
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     DELETE USER
  =============================================================== */
  router.delete('/deleteUser/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No id provided'
      }); // Return error message
    } else {
      // Check if id is found in database
      User.findOne({
        _id: req.params.id
      }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({
            success: false,
            message: 'Invalid id'
          }); // Return error message
        } else {
          // Check if user was found in database
          if (!user) {
            res.json({
              success: false,
              messasge: 'User was not found'
            }); // Return error message
          } else {
            user.remove((err) => {
              if (err) {
                res.json({
                  success: false,
                  message: err
                }); // Return error message
              } else {
                res.json({
                  success: true,
                  message: 'User deleted!'
                }); // Return success message
              }
            });
          }
        }
      });
    }
  });

  /* ===============================================================
     BOOK ROOM
  =============================================================== */
  router.put('/bookRoom', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({
        success: false,
        message: 'No id was provided.'
      }); // Return error message
    } else {
      // Search the database with id
      Room.findOne({
        _id: req.body.id
      }, (err, room) => {
        // Check if error was encountered
        if (err) {
          res.json({
            success: false,
            message: 'Invalid room id'
          }); // Return error message
        } else {
          // Check if id matched the id of a room post in the database
          if (!room) {
            res.json({
              success: false,
              message: 'That room was not found.'
            }); // Return error message
          } else {
            // Get data from user that is signed in
            User.findOne({
              _id: req.decoded.userId
            }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({
                  success: false,
                  message: 'Something went wrong.'
                }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({
                    success: false,
                    message: 'Could not authenticate user.'
                  }); // Return error message
                } else {
                  room.isBooked = true; // book room
                  room.bookedBy = user.username; // Add booker's username
                  // Save blog post
                  room.save((err) => {
                    if (err) {
                      res.json({
                        success: false,
                        message: 'Something went wrong.'
                      }); // Return error message
                    } else {
                      res.json({
                        success: true,
                        message: 'Room booked!'
                      }); // Return success message
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  });

  return router;
};