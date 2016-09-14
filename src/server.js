var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cors = require('cors');
var fileUpload = require('express-fileupload');
require('dotenv').config();
var lwip = require('lwip');
var ip = require('ip');
var Strategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var fs = require('fs');
var app = module.exports = express();
mongoose.connect('mongodb://localhost/project_menagement_agile' , function (err) {
  if (err) {
    console.log(err);
  }
});
app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var User = require('./members/member.schema');

var route = require('./route');

app.use('/' , route());

app.post('/upload', function (req, res) {
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
  console.log(req.files);
  jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
    if (err) {
      console.log('token error');
    } else if (decoded) {
      console.log(decoded._id);
      User.findOne({_id: decoded._id}).exec((err, results) => {
        if (err) {
          return res.send({ message: err});
        }
        if (results) {
          console.log(results);
          sampleFile = req.files.file;
          imgLength = sampleFile.name.length;
          var dotPicture = sampleFile.name.substr(imgLength - 4, imgLength);
          sampleFile.mv(__dirname + '/../public/uploads/' + results.username + dotPicture, function (err) {
            if (err) {
              res.status(400).send(err);
            } else {
              User.findOneAndUpdate({username: results.username} ,
                {image: 'http://' + ip.address() + ':' + server.address().port + '/uploads/' + results.username + dotPicture})
                .exec((err, results) => {
                  if (err) {
                    return res.status(400).send({'message': err });
                  }
                  if (results) {
                    lwip.open(__dirname + '/../public/uploads/' + results.username + dotPicture, function (err, image) {
                      if (err) throw err;
                      image.resize(200, 200, function (err, rzdImg) {
                        rzdImg.writeFile(__dirname + '/../public/uploads/' + results.username + dotPicture, function (err) {
                          if (err) {
                            res.status(400).send({message : err})
                          }else {
                            res.send({ image : 'http://localhost:4000/uploads/'+ results.username + dotPicture });
                          }
                        });
                      });
                    });
                  }
                });
            }
          });
        }
      });
    }
  });
});
passport.use(new Strategy(
  function (token, cb) {
    jwt.verify(token, process.env.secret, function (err, decoded) {
      if (err) {
        console.log(cb);
        return cb(null, false);
      }
      if (!err) {
        User.findOne({_id: decoded._id}, function (err, user) {
          if (err) { return cb(null, false); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    });
  })
);

var server = app.listen(4000, function () {
  console.log('running at  ' + ip.address() + ' :  ' + server.address().port);
});
module.exports.server = server;
