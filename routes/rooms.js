const User = require('../models/user'); // Import User Model Schema
const Room = require('../models/room'); // Import Room Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
const Rating = require('../models/rating');
var AWS = require("aws-sdk");
var awsConfig = {
  "region": "us-west-2",
  "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
  "accessKeyId": "AKIAJDMWJ3P63NDAYSWA",
  "secretAccessKey": "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"
};
AWS.config.update(awsConfig);

var docClient = new AWS.DynamoDB.DocumentClient();


module.exports = (router) => {

  //DYNAMO DONE
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
                available: req.body.available,

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

                  var dynamoRoom = {
                    title: room.title, // Title field
                    body: room.body,
                    price: room.price, // Body field
                    isBooked: false,
                    roomType: room.roomType,
                    available: room.available,
                    image: req.body.image
                  }



                  var params = {
                    TableName: "Room",
                    Item: dynamoRoom
                  };

                  //return doesnt work bcoz of async
                  docClient.put(params, function (err, data) {

                    if (err) {
                      console.log("room::save::error - " + JSON.stringify(err, null, 2));
                      res.json({
                        success: false,
                        message: err
                      }); // Return general error message
                    } else {
                      console.log("room::save::success");
                      res.json({
                        success: true,
                        message: 'Room saved!'
                      }); // Return success message
                    }
                  });



                }
              });
            }
          }
        }
      }
    }
  });

  //DYNAMO DONE
  router.post('/newRating', (req, res) => {

    if (!req.body.score) {
      res.json({
        success: false,
        message: 'Rating is required.'
      }); // Return error message
    } else {

      // User.findOne({
      //   username: req.decoded.userId
      // }, (err, user) => {
      //   // Check if error was found
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: err
      //     }); // Return error message
      //   } else {
      //     // Check if user was found in the database
      //     if (!user) {
      //       res.json({
      //         success: false,
      //         message: 'Unable to authenticate user.'
      //       }); // Return error message
      //     } else {

      const rating = new Rating({
        rating: req.body.score,
        ratedBy: req.body.ratedBy
      });

      rating.save((err) => {
        // Check if error
        if (err) {

          res.json({
            success: false,
            message: err
          }); // Return general error message


        } else {

          var dynamoRating = {
            ratedBy: req.body.ratedBy,
            rating: req.body.score
          }

          var params = {
            TableName: "Rating",
            Item: dynamoRating
          }

          docClient.put(params, function (err, data) {

            if (err) {
              console.log("room::save::error - " + JSON.stringify(err, null, 2));
              res.json({
                success: false,
                message: err
              }); // Return general error message
            } else {
              console.log("room::save::success");
              res.json({
                success: true,
                message: 'Rating saved!'
              }); // Return success message
            }
          });
        }
      });
    }
  });


  //DYNAMO DONE
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

          var params = {
            TableName: "Room"
          }

          docClient.scan(params, function (err, data) {
            if (err) {
              console.log(err, err.stack); // an error occurred
              res.json({
                success: false,
                message: 'No rooms found.'
              }); // Return error of no users found
            } else {
              console.log(data); // successful response
              res.json({
                success: true,
                rooms: data.Items,
              }); // Return success and users array
            }
          })

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

          var params = {
            TableName: "User"
          }

          docClient.scan(params, function (err, data) {
            if (err) {
              console.log(err, err.stack); // an error occurred
              res.json({
                success: false,
                message: 'No users found.'
              }); // Return error of no users found
            } else {
              console.log(data); // successful response

              res.json({
                success: true,
                users: data.Items,
              }); // Return success and users array
            }
          })
        }
      }
    }).sort({
      '_id': -1
    }); // Sort users from newest to oldest
  });

  //DYNAMO DONE
  /* ===============================================================
     GET SINGLE ROOM
  =============================================================== */
  router.get('/singleRoom/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No room title was provided.'
      }); // Return error message
    } else {
      // Check if the room id is found in database
      // Room.findOne({
      //   title: req.params.id
      // }, (err, room) => {
      //   // Check if the id is a valid ID
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: 'Not a valid room id'
      //     }); // Return error message
      //   } else {
      //     // Check if room was found by id
      //     if (!room) {
      //       res.json({
      //         success: false,
      //         message: 'Room not found.'
      //       }); // Return error message
      //     } else {


      var params = {
        TableName: "Room",
        Key: {
          "title": req.params.id
        }
      };
      docClient.get(params, function (err, data) {
        if (err) {
          console.log("room::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
          res.json({
            success: false,
            message: 'Room not found.'
          }); // Return error message
        } else {
          console.log("room::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
          res.json({
            success: true,
            room: data.Item
          }); // Return success
        }
      })



    }
    // });
    // }
    // }
  });
  //     });
  //   }
  // });

  //DYNAMO DONE
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
        username: req.params.id
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
            var params = {
              TableName: "User",
              Key: {
                "username": req.params.id
              }
            };
            docClient.get(params, function (err, data) {
              if (err) {
                console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
                res.json({
                  success: false,
                  message: 'User not found.'
                }); // Return error message
              } else {
                console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
                res.json({
                  success: true,
                  user: user
                }); // Return success
              }
            })
          }
        }
      });
    }
  });

  /* ===============================================================
     UPDATE ROOM POST
  =============================================================== */
  router.put('/updateRoom', (req, res) => {
    // Check if id was provided
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'No room id provided'
      }); // Return error message
    } else {
      // Check if id exists in database
      // Room.findOne({
      //   _id: req.body._id
      // }, (err, room) => {
      //   // Check if id is a valid ID
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: 'Not a valid room id'
      //     }); // Return error message
      //   } else {
      //     // Check if id was found in the database
      //     if (!room) {
      //       res.json({
      //         success: false,
      //         message: 'Room id was not found.'
      //       }); // Return error message
      //     } else {
      //       // room.title = req.body.title; // Save latest room title
      //       room.body = req.body.body; // Save latest body
      //       room.price = req.body.price; // Save latest body
      //       room.available = req.body.available;
      //       room.roomType = req.body.roomType;
      //       room.save((err) => {
      //         if (err) {
      //           if (err.errors) {
      //             res.json({
      //               success: false,
      //               message: 'Please ensure form is filled out properly'
      //             });
      //           } else {
      //             res.json({
      //               success: false,
      //               message: err
      //             }); // Return error message
      //           }
      //         } else {
      var params = {
        TableName: "Room",
        Key: {
          "title": req.body.title
        },
        UpdateExpression: "set body = :b, price=:p, available=:a, roomType=:rt, image =:im",
        ExpressionAttributeValues: {
          ":b": req.body.body,
          ":p": req.body.price,
          ":a": req.body.available,
          ":rt": req.body.roomType,
          ":im": req.body.image

        },
        ReturnValues: "UPDATED_NEW"
      };

      console.log("Updating Room...");
      docClient.update(params, function (err, data) {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));

          res.json({
            success: false,
            message: err
          }); // Return error message
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          res.json({
            success: true,
            message: 'Room Updated!'
          }); // Return success message
        }
      });
    }
  });
  //       }
  //     });
  //   }
  // });

  /* ===============================================================
     DELETE ROOM
  =============================================================== */
  router.delete('/deleteRoom/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No title provided'
      }); // Return error message
    } else {
      // Check if id is found in database
      // Room.findOne({
      //   _id: req.params.id
      // }, (err, room) => {
      //   // Check if error was found
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: 'Invalid id'
      //     }); // Return error message
      //   } else {
      //     // Check if room was found in database
      //     if (!room) {
      //       res.json({
      //         success: false,
      //         messasge: 'Room was not found'
      //       }); // Return error message
      //     } else {
      //       room.remove((err) => {
      //         if (err) {
      //           res.json({
      //             success: false,
      //             message: err
      //           }); // Return error message
      //         } else {

      var params = {
        Key: {
          "title": req.params.id
        },
        TableName: "Room"
      }

      docClient.delete(params, function (err, data) {
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
      })

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
      // User.findOne({
      //   _id: req.params.id
      // }, (err, user) => {
      //   // Check if error was found
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: 'Invalid id'
      //     }); // Return error message
      //   } else {
      //     // Check if user was found in database
      //     if (!user) {
      //       res.json({
      //         success: false,
      //         messasge: 'User was not found'
      //       }); // Return error message
      //     } else {
      //       user.remove((err) => {
      //         if (err) {
      //           res.json({
      //             success: false,
      //             message: err
      //           }); // Return error message
      //         } else {

      var params = {
        Key: {
          "username": req.params.id
        },
        TableName: "User"
      }

      docClient.delete(params, function (err, data) {
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
      })
    }
  });


  //     });
  //   }
  // });

  /* ===============================================================
     BOOK ROOM
  =============================================================== */
  router.put('/bookRoom', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.title) {
      res.json({
        success: false,
        message: 'No title was provided.'
      }); // Return error message
    } else {
      // Search the database with id

      var params = {
        TableName: "Room",
        Key: {
          "title": req.body.title
        },
        UpdateExpression: "set isBooked = :ib, bookedBy=:bb",
        ExpressionAttributeValues: {
          ":ib": true,
          ":bb": req.body.username,
        },
        ReturnValues: "UPDATED_NEW"
      };

      console.log("Booking Room...");
      docClient.update(params, function (err, data) {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));

          res.json({
            success: false,
            message: err
          }); // Return error message
        } else {
          console.log("Room Booking succeeded:", JSON.stringify(data, null, 2));
          res.json({
            success: true,
            message: 'Room Booked!'
          }); // Return success message
        }
      });

    }
  });

  return router;
};