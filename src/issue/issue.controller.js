var issue = require('./issue.schema.js');
var valid = require('./issue.valid.js');
var status = require('./../status/status.schema.js');
var priority = require('./../priority/priority.schema.js');
var tracker = require('./../tracker/tracker.schema.js');
var point = require('./../point/point.schema.js');
var member = require('./../members/member.schema.js');
var jwt = require('jsonwebtoken');
module.exports.getAllIssue = function (req, res) {
  tracker.findOne({ name : 'bug'}).exec((err, results)=>{
    if (err) {
      return res.status(400).send(err)
    }
    if (results) {
      // res.send({ tracker_id: results._id })
      issue.find({ tracker : results._id })
        .populate({ path: 'assignTo', select: 'username name surname image'})
        .populate({ path: 'createBy', select: 'username name surname image' })
        .populate({ path: 'priority', select: '-__v'})
        .populate({ path: 'point',  select: '-__v'})
        .populate({ path: 'tracker', select: '-__v'})
        .populate({ path: 'status', select: '-__v'})
        .populate({ path: 'subTask.sub', select: '-__v' })
        .populate({ path: 'project', select: '-__v'})
        .exec((err, results) => {
          if (err) {
            res.send({message: err});
          }
          if (results) {
            res.send(results);
          }
        });
    }
  })
};
module.exports.addIssue = function (req, res) {
  let error = valid.validation(req);
  if (error == '') {
    var data = {};
    status.findOne({ name: req.body.status }).exec((err, status) => {
      if (status) {
        data.status = status._id;
        priority.findOne({ name: req.body.priority }).exec((err, priority) => {
          if (priority) {
            data.priority = priority._id;
            tracker.findOne({ name: req.body.tracker }).exec((err, tracker) => {
              if (tracker) {
                data.tracker = tracker._id;
                point.findOne({ name: req.body.point}).exec((err, point) => {
                  data.point = point._id;
                  console.log(data , data);
                  jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
                    if (err) {
                      res.send({message: 'user error'});
                    } else if (decoded) {
                      data.createBy = decoded._id;
                      data.name = req.body.name;
                      data.description = req.body.description;
                      data.timeEstimate = req.body.timeEstimate;
                      data.version = req.body.version;
                      data.assignTo = req.body.assignTo;
                      data.project = req.body.project;
                      data.dueDate = req.body.dueDate;
                      console.log(data);
                      var obj = new issue(data);
                      obj.save(function (err, obj) {
                        if (err) {
                          res.send({ message: err });
                        }
                        if (obj) {
                          res.send(obj);
                        }
                      });
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  }else {
    res.send({message: error});
  }
};

module.exports.addTask = function (req, res) {
  // var parrentTask  = req.body._id
  // var sub_task = []
  // console.log(parrentTask,' : parrentTask')
  // var data = {}
  //   if (req.body.status == 'new') {
  //       data.status = '5778ec0da57852145a05d2aa'
  //     }else if (req.body.status == 'in progress') {
  //         data.status = '5778ec1fa57852145a05d2ab'
  //     }else if (req.body.status == 'resolved') {
  //         data.status = '5778ec31a57852145a05d2ac'
  //     }else if (req.body.status == 'feedback') {
  //         data.status = '5778ec37a57852145a05d2ad'
  //     }else if (req.body.status == 'closed') {
  //         data.status = '5778ec45a57852145a05d2ae'
  //   }else  {
  //       return res.send({ message : 'not found your status'})
  //   }
  // if (req.body.tracker == 'bug') {
  //     data.tracker = '5778ed14a57852145a05d2b4'
  //   }else if (req.body.tracker == 'user story') {
  //     data.tracker = '5778ed1ea57852145a05d2b5'
  //   }else if (req.body.tracker == 'task') {
  //     data.tracker = '5778ed25a57852145a05d2b6'
  //   }
  // else {
  //   return res.send({ message : 'not found your tracker'})
  // }
  // if (req.body.point == 1) {
  //     data.point = '5778eb5aa57852145a05d2a5'
  //   }else if (req.body.point == 2) {
  //     data.point = '5778eb5ea57852145a05d2a6'
  //   }else if (req.body.point == 3) {
  //     data.point = '5778eb61a57852145a05d2a7'
  //   }else if (req.body.point == 5) {
  //     data.point  = '5778eb65a57852145a05d2a8'
  //   }else if (req.body.point == 8) {
  //     data.point = '5778eb6ba57852145a05d2a9'
  // }else {
  //     return res.send({ message : 'not found your point' })
  // }
  // if (req.body.priority  == 'low') {
  //     data.priority = '5778ec7ea57852145a05d2af'
  //   }else if (req.body.priority == 'normal') {
  //     data.priority = '5778eca4a57852145a05d2b0'
  //   }else if (req.body.priority == 'high') {
  //     data.priority = '5778ecb0a57852145a05d2b1'
  //   }else if (req.body.priority == 'urgent') {
  //     data.priority = '5778ecbaa57852145a05d2b2'
  //   }else if (req.body.priority == 'immediate') {
  //     data.priority = '5778ecc3a57852145a05d2b3'
  // }else {
  //     return res.send({message : 'not found your priority'})
  // }
  // jwt.verify(req.headers.authorization.substr(7), process.env.secret, function (err, decoded) {
  //   if (err) {
  //     res.send({message : 'user error'})
  //   } else if (decoded) {
  //     data.createBy  = decoded._id
  //     data.name = req.body.name
  //     data.description = req.body.description
  //     data.timeEstimate = req.body.timeEstimate
  //     data.version = req.body.version
  //     data.assignTo  = req.body.assignTo
  //     var obj = new issue(data)
  //     obj.save(function (err, obj){
  //       if (err) {
  //         return res.status(400).send({message : err})
  //       }
  //       if (obj) {
  //         issue.findOne({ _id  : parrentTask })
  //         .exec((err, results)=>{
  //           if (err) {
  //             return res.status(400).send({message : err})
  //           }
  //           if (results) {
  //             if (results.subTask.length==0) {
  //                 console.log('parrent no subTask')
  //             }else{
  //                console.log(results.subTask.length,' : subtaskLength')
  //                sub_task = results.subTask
  //             }
  //             sub_task.push({ sub : obj._id})
  //             issue.findOneAndUpdate({ _id : parrentTask } , { subTask : sub_task })
  //             .exec((err, update)=>{
  //               if (err) {
  //                 return  res.status(400).send({message : err})
  //               }
  //               if (update) {
  //                 return res.send({update : update , task : obj , arraySubtask : sub_task })
  //               }
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // })
};
module.exports.findIssueByIssueId = function (req, res) {
  issue.findOne({ issue_id: req.body.id})
    .populate({ path: 'createBy', select: 'name surname image'})
    .populate({ path: 'assignTo', select: 'name surname image'})
    .populate({ path: 'priority', select: '-__v'})
    .populate({ path: 'point',  select: '-__v'})
    .populate({ path: 'status', select: '-__v'})
    .exec((err, results) => {
      if (err) {
        return res.status(400).send({ message: err});
      }
      if (results) {
        return res.send(results);
      }
    });
};

module.exports.deleteIssue = function (req, res) {
  console.log(req.params.id);
  issue.remove({ _id: req.params.id })
    .exec((err, results) => {
      if (err) {
        return res.status(400).send({ message: err});
      }
      if (results) {
        return res.send(results);
      }
    });
};
module.exports.deleteMutipleIssue = function (req, res) {
  issue.remove({ _id: { $in: req.body.issue }})
    .exec((err, results) => {
      if (err) {
        return res.status(400).send({ message: err});
      }
      if (results) {
        return res.send({ message: 'deleted'});
      }
    });
};
module.exports.editIssue = function (req, res) {
  status.findOne({ name: req.body.status}).exec((err, statusResult) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    if (statusResult) {
      priority.findOne({ name: req.body.priority}).exec((err, priorityResult) => {
        if (err) {
          return res.status(400).send({ message: err});
        }
        if (priorityResult) {
          issue.findOneAndUpdate({issue_id: req.body.issue_id} ,
            { name: req.body.name,
              status: statusResult._id,
              priority: priorityResult._id,
              assignTo: req.body.assignTo,
              description: req.body.description,
              startDate: req.body.startDate,
              dueDate: req.body.dueDate,
              updatedAt: Date.now()
            })
            .exec((err, results) => {
              if (err) {
                res.status.send({ message: err });
              }
              if (results) {
                res.send(results);
              }
            });
        }
      });
    }
  });
};

module.exports.addBacklog = function (req, res) {
  var backlog = {};
  priority.findOne({ name: req.body.priority}).exec((err, priorityResult) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (priorityResult) {
      backlog.priority = priorityResult._id;
      status.findOne({ name: req.body.status}).exec((err, statusResult) => {
        if (err) {
          return res.status(400).send(err);
        }
        if (statusResult) {
          backlog.status = statusResult._id;
          tracker.findOne({ name: req.body.tracker}).exec((err, trackerResult) => {
            if (err) {
              return res.status(400).send(err);
            }
            if (trackerResult) {
              backlog.tracker = trackerResult._id;
              point.findOne({ value : req.body.point}).exec((err,pointResults)=>{
                if (err) {
                  return res.status(400).send(err)
                }
                if (pointResults) {
                  backlog.point = pointResults._id;
                  member.findOne({username : req.body.assignTo}).exec((err, memberResult)=>{
                    if (err) {
                      return res.status(400).send(err)
                    }
                    if (memberResult) {
                     backlog.assignTo = memberResult._id;
                     backlog.project = req.body.project
                     backlog.name = req.body.name
                     backlog.description = req.body.description
                     var obj = new issue(backlog)
                     obj.save(function(err, obj){
                       if (err) {
                         console.log(err);
                        return res.status(400).send(err);
                       }
                      else if (!err) {
                        return res.send({message : 'add backlog done'})
                      }
                     })
                    }
                  })
                }
              })
            }
          });
        }
      });
    }
  });
};
module.exports.getBacklog = function (req, res) {
  tracker.findOne({ name : 'user story' }).exec((err, results)=>{
    if (err) {
      return res.status(400).send(err)
    }
    if (results) {
      issue.find({ tracker : results._id , project : req.params.id})
      .populate({ path: 'assignTo', select: 'username name surname image'})
      .populate({ path: 'createBy', select: 'username name surname image' })
      .populate({ path: 'priority', select: '-__v'})
      .populate({ path: 'point',  select: '-__v'})
      .populate({ path: 'tracker', select: '-__v'})
      .populate({ path: 'status', select: '-__v'})
      .populate({ path: 'subTask.sub', select: '-__v' })
      .populate({ path: 'project', select: '-__v'})
      .exec((err, trackerResults)=>{
        if (err) {
          return res.status(400).send(err)
        }
        if (trackerResults) {
          return res.send(trackerResults);
        }
      })
    }
  })
}
