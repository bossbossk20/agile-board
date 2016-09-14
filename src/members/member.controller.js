var Model = require('./member.schema.js');
var project = require('./../project/project.schema.js');
var valid = require('./member.valid.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var ip = require('ip');
var fs = require('fs');
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);
module.exports.getMember = function (req, res, next) {
  Model
    .find({})
    .select('-password -__v ')
    .exec((err, results) => {
      res.send(results);
    });
};
module.exports.getMemberByToken = function (req, res, next){
  jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
    if (err) {
      console.log('token error');
    } else if (decoded) {
      Model.find({ _id: decoded._id})
        .select('-__v -isAdmin -password -userStatus -updatedAt')
        .exec((err , results) => {
          console.log(results);
          res.send(results);
        });
    }
  });
}
module.exports.postMember = function (req, res ,next) {
  let error = valid.validation(req);
  if (error == '') {
    Model.findOne({username: req.body.username},
      function (err, result) {
        if (!result) {
          var pass = bcrypt.hashSync(req.body.password, salt);
          var dataModel = {
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            password: pass,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            atCreate: req.body.atCreate,
            atUpdate: req.body.atUpdate,
            userStatus: req.body.userStatus
          };
          var obj = new Model(dataModel);
          obj.save(function (err, obj) {
            if (err) {
              res.status(400).send(
                {
                  success: false, title: 'Register validation',
                  message: req.body.email+' already used. Please use another email',
                  key: 'email'
                }
              );
            } else {
              var token = jwt.sign({ id: obj._id }, 'secret');
              res.send(
                { success: true,
                  token: token,
                  message: 'register done'
                }
              );
            }
          });
        } else {
          return res.status(400).send(
            {
              success: false,
              title: 'Register validation',
              message: 'Duplicate  username',
              key: 'username'
            }
          );
        }
      });
  } else {
    res.status(400).send(
      {
        success: false,
        title: 'Register validation',
        message: error
      }
    );
  }
};
module.exports.activeStatus = function (req, res, next) {
  console.log(req.body._id);
  Model.findOneAndUpdate({_id: req.body._id} , { userStatus: 'active' })
    .exec((err , results) => {
      var token = jwt.sign({ _id: req.body._id } , process.env.register, {expiresIn: '10h'});
      console.log(token);
      console.log(results.email);
      var sendgrid = require('sendgrid')(process.env.sendGrid);
      fs.readFile(__dirname + '/mail.html' , (err , data) => {
        if (err) {
          console.log(err);
        } else {
          sendgrid.send({
            to: results.email,
            from: process.env.emailSender,
            subject: 'Yoohoo',
            html: data.toString('utf-8')
          }, function (err, json) {
            if (err) { return console.error(err); }
            res.send({message : 'accept done'});
          });
        }
      });
    });
};

module.exports.editMember = function (req , res , next) {
  Model.findOneAndUpdate({_id: req.body._id} ,
    {
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      updatedAt: Date.now()
    }
  ).exec((err , results) => {
    if (results) {
      return res.send({ message: 'done' });
    }
    if (err) {
      return res.status(400).send({ title: 'email error', message: 'email already use' });
    }
  });
};
module.exports.editPassword = function (req , res , next) {
  Model.findOneAndUpdate({_id: req.body._id} ,
    {
      password: bcrypt.hashSync(req.body.password, salt),
      updatedAt: Date.now()
    })
    .exec((err , results) => {
      if (results) {
        return res.send({ message: 'done' });
      }
      if (err) {
        return res.status(400).send({ title: 'update error',   message: 'can not update' });
      }
    });
};
module.exports.checkMe = function (req , res , next) {
  jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
    if (err) {
      console.log('token error');
    } else if (decoded) {
      project.find({ createBy: { _id: decoded._id}})
        .populate({path: 'createBy',  select: '-__v -password -userStatus -isAdmin -atCreated -atUpdated' })
        .select('-__v')
        .exec((err , results) => {
          res.send(results);
        });
    }
  });
};
module.exports.inActiveMember = function (req, res) {
  Model.find({userStatus : 'inActive' })
  .select('-__v -password -updatedAt -isAdmin -image -username')
  .exec((err, results)=>{
    if (err) {
       return res.status(400).send({message : err})
    }
    if (results) {
      return res.send(results)
    }
  })
}
module.exports.removeMember = function (req, res) {
  Model.remove ({ _id : req.params.id })
    .exec((err , results)=>{
      if (err) {
          return res.status(400).send({ message : err })
      }
      if (results) {
        return res.send(results);
      }
    })
}
module.exports.forgotPassword = function (req , res) {
  console.log(req.body.email);
  Model.findOne({ email : req.body.email })
  .exec((err, results)=>{
    if (err) {
        return res.status(400).send({message : err});
    }
    if (!results) {
        return res.status(400).send({message : 'not found email'})
    }
    if (results) {
      var tokenForgotPassword = jwt.sign({ _id : results._id }, process.env.forgotPassword );
        var sendgrid = require('sendgrid')(process.env.sendGrid);
        fs.readFile(__dirname + '/resetPassword.html' , (err , data) => {
          if (err) {
            return res.status(400).send({ message : err })
          } else {
            sendgrid.send({
              to: results.email,
              from: process.env.emailSender,
              subject: 'Password Recovery',
              text: 'http://localhost:3000/verify?token='+tokenForgotPassword
            }, function (err, json) {
              if (err) { return console.error(err); }
              res.send({message : 'accept done'});
            });
          }
        });
    }
  })
}
module.exports.changePasswordbyUsername = function (req, res) {
  var pass = bcrypt.hashSync(req.body.password, salt);
  Model.findOneAndUpdate({ username : req.body.username} , { password : pass })
  .exec((err , results)=>{
    if (err) {
      return res.status(400).send(err)
    }
    if (results) {
      return res.send({ message : results})
    }
  })
}
module.exports.checkTokenAndReturnUsername = function (req, res) {
  jwt.verify(req.body.token, process.env.forgotPassword , function(err, decoded) {
    if (err) {
      return res.status(400).send({ message : 'token incorrect' })
    }
    if (decoded) {
        Model.findOne({ _id :  decoded._id }).exec((err, results)=>{
          if (err) {
              return res.status(400).send(err)
          }
          if (results) {
              return res.send({ username : results.username})
          }
        })
    }
  });
}
module.exports.findIdByName = function (req, res) {
  Model.findOne({ name : req.body.name , surname : req.body.surname })
  .select('_id')
  .exec((err, results)=>{
    if (err) {
         return  res.status(400).send({ message : err});
    }
    if (results) {
        return res.send(results);
    }
  })
}
