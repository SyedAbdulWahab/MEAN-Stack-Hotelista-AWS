/**
 * Module dependencies
 */

var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var http = require('http');
var Schema = mongoose.Schema;


// img path
var imgPath = 'C:/Users/Syed Abdul Wahab/Pictures/bleedo.jpg';

// connect to mongo
mongoose.connect('localhost', 'testing_storeImg');

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  // empty the collection
  A.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');

      // start a demo server
      var server = express();

      server.set('port', process.env.PORT || 3000)
    //   var app = http.createServer(server);
      server.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });
      });

      server.on('close', function () {
        console.error('dropping db');
        mongoose.connection.db.dropDatabase(function () {
          console.error('closing db connection');
          mongoose.connection.close();
        });
      });



      module.exports =  server.listen(server.get('port'), function (err) {
        // var host = app.address().address;
        // var port = app.address().port;
        console.error('server listening on port %d', server.get('port'));
        console.error('press CTRL+C to exit');
      });


      

      process.on('SIGINT', function () {
        server.close();
      });
    });
  });

});