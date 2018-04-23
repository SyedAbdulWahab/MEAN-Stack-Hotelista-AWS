const User = require('../models/user'); // Import User Model Schema
const Blog = require('../models/blog'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration
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

/* ===============================================================
   CREATE NEW REVIEW
=============================================================== */
router.post('/newBlog', (req, res) => {
  // Check if blog title was provided
  if (!req.body.title) {
    res.json({
      success: false,
      message: 'Review title is required.'
    }); // Return error message
  } else {
    // Check if blog body was provided
    if (!req.body.body) {
      res.json({
        success: false,
        message: 'Review body is required.'
      }); // Return error message
    } else {
      // Check if blog's creator was provided
      if (!req.body.createdBy) {
        res.json({
          success: false,
          message: 'Review creator is required.'
        }); // Return error
      } else {

        const review = {
          reviewer: req.body.title, // Title field
          body: req.body.body, // Body field
          createdBy: req.body.createdBy // CreatedBy field
        }


        var params = {
          TableName: "Review",
          Item: review
        };

        //return doesnt work bcoz of async
        docClient.put(params, function (err, data) {

          if (err) {
            console.log("review::save::error - " + JSON.stringify(err, null, 2));
            res.json({
              success: false,
              message: err.errors.body.message
            }); // Return error message
          } else {
            console.log("review::save::success");
            res.json({
              success: true,
              message: 'Blog saved!'
            }); // Return success message

          }
        });


        // // Create the blog object for insertion into database
        // const blog = new Blog({
        //   title: req.body.title, // Title field
        //   body: req.body.body, // Body field
        //   createdBy: req.body.createdBy // CreatedBy field
        // });
        // // Save blog into database
        // blog.save((err) => {
        //   // Check if error
        //   if (err) {
        //     // Check if error is a validation error
        //     if (err.errors) {
        //       // Check if validation error is in the title field
        //       if (err.errors.title) {
        //         res.json({
        //           success: false,
        //           message: err.errors.title.message
        //         }); // Return error message
        //       } else {
        //         // Check if validation error is in the body field
        //         if (err.errors.body) {
        //           res.json({
        //             success: false,
        //             message: err.errors.body.message
        //           }); // Return error message
        //         } else {
        //           res.json({
        //             success: false,
        //             message: err
        //           }); // Return general error message
        //         }
        //       }
        //     } else {
        //       res.json({
        //         success: false,
        //         message: err
        //       }); // Return general error message
        //     }
        //   } else {
        //     res.json({
        //       success: true,
        //       message: 'Blog saved!'
        //     }); // Return success message
      }

    }
  }
});


//DYNAMO DONE
/* ===============================================================
   GET ALL REVIEWS
=============================================================== */
router.get('/allBlogs', (req, res) => {
  // Search database for all blog posts
  var params = {
    TableName: "Review"
  }

  docClient.scan(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.json({
        success: false,
        message: 'No reviews found.'
      }); // Return error of no users found
    } else {
      console.log(data); // successful response


      res.json({
        success: true,
        blogs: data.Items,
      }); // Return success and users array
    }
  })
});

/* ===============================================================
   GET SINGLE REVIEW
=============================================================== */
router.get('/singleBlog/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({
        success: false,
        message: 'No review ID was provided.'
      }); // Return error message
    } else {

      var params = {
        TableName: "Review",
        Key: {
          "reviewer": req.params.id
        }
      };
      docClient.get(params, function (err, data) {
        if (err) {
          console.log("users::fetchOneByKey::error - " + JSON.stringify(err, null, 2));
          res.json({
            success: false,
            message: err
          }); // Return error
        } else {
          console.log("users::fetchOneByKey::success - " + JSON.stringify(data, null, 2));
          res.json({
            success: true,
            blog: data.Item
          }); // Return success
        }
      })

      // Check if the blog id is found in database
      // Blog.findOne({
      //   _id: req.params.id
      // }, (err, blog) => {
      //   // Check if the id is a valid ID
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: 'Not a valid review id'
      //     }); // Return error message
      //   } else {
      //     // Check if blog was found by id
      //     if (!blog) {
      //       res.json({
      //         success: false,
      //         message: 'Review not found.'
      //       }); // Return error message
      //     } else {
      // Find the current user that is logged in
      // User.findOne({
      //   _id: req.decoded.userId
      // }, (err, user) => {
      //   // Check if error was found
      //   if (err) {
      //     res.json({
      //       success: false,
      //       message: err
      //     }); // Return error
      //   } else {
      //     // Check if username was found in database
      //     if (!user) {
      //       res.json({
      //         success: false,
      //         message: 'Unable to authenticate user'
      //       }); // Return error message
      //     } else {
      //       // Check if the user who requested single blog is the one who created it
      //       if (user.username !== blog.createdBy) {
      //         res.json({
      //           success: false,
      //           message: 'You are not authorized to edit this blog.'
      //         }); // Return authentication reror
      //       } else {

    }
  });

// /* ===============================================================
//    UPDATE BLOG POST
// =============================================================== */
// router.put('/updateBlog', (req, res) => {
//   // Check if id was provided
//   if (!req.body._id) {
//     res.json({
//       success: false,
//       message: 'No blog id provided'
//     }); // Return error message
//   } else {
//     // Check if id exists in database
//     Blog.findOne({
//       _id: req.body._id
//     }, (err, blog) => {
//       // Check if id is a valid ID
//       if (err) {
//         res.json({
//           success: false,
//           message: 'Not a valid blog id'
//         }); // Return error message
//       } else {
//         // Check if id was found in the database
//         if (!blog) {
//           res.json({
//             success: false,
//             message: 'Blog id was not found.'
//           }); // Return error message
//         } else {
//           // Check who user is that is requesting blog update
//           User.findOne({
//             _id: req.decoded.userId
//           }, (err, user) => {
//             // Check if error was found
//             if (err) {
//               res.json({
//                 success: false,
//                 message: err
//               }); // Return error message
//             } else {
//               // Check if user was found in the database
//               if (!user) {
//                 res.json({
//                   success: false,
//                   message: 'Unable to authenticate user.'
//                 }); // Return error message
//               } else {
//                 // Check if user logged in the the one requesting to update blog post
//                 if (user.username !== blog.createdBy) {
//                   res.json({
//                     success: false,
//                     message: 'You are not authorized to edit this blog post.'
//                   }); // Return error message
//                 } else {
//                   blog.title = req.body.title; // Save latest blog title
//                   blog.body = req.body.body; // Save latest body
//                   blog.save((err) => {
//                     if (err) {
//                       if (err.errors) {
//                         res.json({
//                           success: false,
//                           message: 'Please ensure form is filled out properly'
//                         });
//                       } else {
//                         res.json({
//                           success: false,
//                           message: err
//                         }); // Return error message
//                       }
//                     } else {
//                       res.json({
//                         success: true,
//                         message: 'Blog Updated!'
//                       }); // Return success message
//                     }
//                   });
//                 }
//               }
//             }
//           });
//         }
//       }
//     });
//   }
// });

/* ===============================================================
   DELETE REVIEW
=============================================================== */
router.delete('/deleteBlog/:id', (req, res) => {
  // Check if ID was provided in parameters
  if (!req.params.id) {
    res.json({
      success: false,
      message: 'No id provided'
    }); // Return error message
  } else {
    // Check if id is found in database
    // Blog.findOne({
    //   _id: req.params.id
    // }, (err, blog) => {
    //   // Check if error was found
    //   if (err) {
    //     res.json({
    //       success: false,
    //       message: 'Invalid id'
    //     }); // Return error message
    //   } else {
    //     // Check if blog was found in database
    //     if (!blog) {
    //       res.json({
    //         success: false,
    //         message: 'Review was not found'
    //       }); // Return error message
    //     } else {
    //       // Get info on user who is attempting to delete post
    //       // User.findOne({ _id: req.decoded.userId }, (err, user) => {
    //       //   // Check if error was found
    //       //   if (err) {
    //       //     res.json({ success: false, message: err }); // Return error message
    //       //   } else {
    //       //     // Check if user's id was found in database
    //       //     if (!user) {
    //       //       res.json({ success: false, message: 'Unable to authenticate user.' }); // Return error message
    //       //     } else {
    //       //       // Check if user attempting to delete blog is the same user who originally posted the blog
    //       //       if (user.username !== blog.createdBy) {
    //       //         res.json({ success: false, message: 'You are not authorized to delete this blog post' }); // Return error message
    //       //       } else {
    //       // Remove the blog from database
    //       blog.remove((err) => {
    //         if (err) {
    //           res.json({
    //             success: false,
    //             message: err
    //           }); // Return error message
    //         } else {

    var params = {
      Key: {
        "reviewer": req.params.id
      },
      TableName: "Review"
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
          message: 'Review deleted!'
        }); // Return success message
      }
    })

  }
});

return router;
}