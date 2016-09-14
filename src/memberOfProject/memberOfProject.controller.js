var memberOfProjectSchema = require('./memberOfProject.schema.js');
var role = require('./../role/role.schema.js');
module.exports.getProjectMember = function (req , res , next) {
  memberOfProjectSchema.find({})
    .populate({path: 'member',  select: '-__v -isAdmin -userStatus -password -createdAt -updatedAt'})
    .populate({path: 'project',  select: '-__v -createdAt -updatedAt' })
    .populate({path: 'role' , select: '-__v'})
    .exec((err , results) => {
      res.send(results);
    });
};
module.exports.addMembers = function (req, res , next) {
  memberOfProjectSchema.findOne({ project: req.body.project,  member: req.body.member })
    .exec((err , results) => {
      if (err) {
        return res.send(err);
      }
      if (results) {
        return res.send({ title: 'Add member', message: 'already have member in this project'});
      } else {
        role.findOne({ name : req.body.role }).exec((err, role)=>{
          if (!err) {
              var data = {
                member : req.body.member,
                project : req.body.project,
                role : role._id
              }
              var obj = new memberOfProjectSchema(data)
              obj.save(function(err, obj){
                if (err) {
                    return res.status(400).send(err)
                }
                if (obj) {
                    return res.send(obj)
                }
              })
          }
        })
      }
    });
};
module.exports.findProjectbyMember = function (req, res) {
    memberOfProjectSchema.find({ member : req.body.member })
    .populate({path: 'project',  select: '-__v ' })
    .populate({path: 'member', select : '-__v' })
    .exec((err, results)=>{
      if (err) {
          res.status(400).send({ message : err})
      }
      if (results) {
          res.send(results)
      }
    })
}
module.exports.deleteMember = function (req, res) {
  console.log(req.params.id);
  memberOfProjectSchema.remove({ _id : req.params.id })
  .exec((err, results)=>{
    if (err) {
        return res.send({ message : err})
    }
    if (results) {
        return res.send(results)
    }
  })
}
module.exports.updateRole = function (req, res) {
  // console.log(req.body);
  role.findOne({ name : req.body.role}).exec((err, results)=>{
    if (err) {
        return res.status(400).send(err)
    }
    if (results) {
      console.log(results._id , 'roleId');
      memberOfProjectSchema.findOneAndUpdate({ _id : req.body._id},{ role : results._id })
      .exec((err, update)=>{
        if (err) {
          return res.status(400).send(err)
        }
        if (update) {
          return res.send({ message : 'update'})
        }
      })
    }
  })
}
module.exports.findMemberByProject = function (req, res) {
  memberOfProjectSchema.find({ project : req.params.id })
  .populate({path: 'member',  select: 'name surname username image'})
  .select('member')
  .exec((err, results)=>{
    if (err) {
      return res.status(400).send(err)
    }
    if (results) {
      return res.send(results);
    }
  })
}
