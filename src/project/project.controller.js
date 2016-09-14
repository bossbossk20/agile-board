var project = require('./project.schema.js');
var valid = require('./project.valid.js');
var jwt = require('jsonwebtoken');
var memberOfProject = require('./../memberOfProject/memberOfProject.schema.js');
var lwip = require('lwip');
var role = require('./../role/role.schema.js');
module.exports.getAllproject = function (req, res, next) {
  project.find({})
    .populate({path: 'createBy',  select: '-__v -password -userStatus -isAdmin -atCreate -atUpdate' })
    .select('-__v')
    .exec((err, results) => {
      res.send(results);
    });
}
module.exports.getIdByProjectName = function (req, res) {
    project.findOne({ name : req.body.name })
    .exec((err,results)=>{
        if (err) {
            return res.status(400).send(err);
        }
        if (results) {
            return res.send(results._id);
        }
    })
}
module.exports.createProject = function (req , res , next) {
  var errorValid = valid.validation(req);
  if (errorValid != '') {
    return res.send({ title: 'valid project',  message: errorValid});
  } else {

    var obj = new project(req.body);
    obj.save(function (err, obj) {
      if (err) {
        return res.status(400).send({  title: 'Add Project ', message: 'duplicate project name'});
      } else {
        jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
          if (err) {
            console.log('token error');
          } else if (decoded) {
              role.findOne({ name : 'manager' }).exec((err, roleResult)=>{
                if (err) {
                  return res.status(400).send(err)
                }
                if (roleResult) {
                  var member = {
                    project : obj._id ,
                    member : decoded._id,
                    role : roleResult._id
                  }
                  var addMember = new memberOfProject(member);
                    addMember.save(function(err, addMember){
                      if (err) {
                        return res.status(400).send(err)
                      }
                      if (addMember) {
                        return res.send({ message : 'added member project'})
                      }
                    })
                }
              })
          }
        });
      }
    });
  }
}
module.exports.delectProject = function (req , res) {
  project.remove({ _id: req.params.id}, function (err) {
    if (!err) {
      memberOfProject.remove({ project : req.params.id}).exec((err, results)=>{
        if (err) {
          return res.status(400).send(err)
        }
        if (results) {
            res.send({ message : 'remove done'})
        }
      })
      // res.send({message: 'done'});

    } else {
      res.status(400);
    }
  });
}
module.exports.editProject = function (req , res , next) {
  console.log(req.body);
  project.findOneAndUpdate({_id: req.body._id} ,
    {
      name: req.body.name,
      description: req.body.description,
      updatedAt: Date.now()
    })
    .exec((err , results) => {
      if (results) {
        return res.send({message: 'update done'});
      }
      if (err) {
        // console.log(err);
        return res.send({ success: false,   message: 'can not update' });
      }
    });
}
module.exports.findOneProject = function (req, res) {
  project.findOne({ name : req.params.name}).exec((err , results) => {
    if (err) {
      return res.status(400).send({ message : err})
    }
    if (!results) {
      res.status(400).send({ message : 'not found'})
    }
    if (results) {
      res.send(results);
    }
  });
}
