var modelName = 'issue';
var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence');
var Schema = mongoose.Schema;
var schema = new Schema({
    name : {
      type : String ,
      required : true
    },
    createdAt : {
      type : Date ,
      default : Date.now
    },
    updateAt : {
      type : Date ,
      default : Date.now
    },
    description : String,
    timeEstimate : {
      type : Number,
      default : ''
    },
    uploadFile : {
      type : String ,
      default : ''
    },
    subTask : [
      {
        sub : {
          type : Schema.ObjectId,
          ref : 'issue',
          default : null
        }
      }
    ],
    point : {
      type  : Schema.ObjectId,
      ref : 'point'
    },
    tracker : {
      type : Schema.ObjectId,
      ref : 'tracker'
    },
    status : {
      type : Schema.ObjectId,
      ref : 'status'
    },
    assignTo : {
      type : Schema.ObjectId,
      ref: 'members'
    },
    createBy : {
      type : Schema.ObjectId,
      ref : 'members'
    },
    priority : {
      type : Schema.ObjectId,
      ref : 'priority'
    },
    version : {
      type : Schema.ObjectId,
      ref : 'version',
      default : null
    },project: {
      type: Schema.ObjectId,
      ref: 'projects'
    },startDate : {
      type : Date ,
      default : Date.now
    },dueDate : {
      type : Date ,
      default : ''
    }
});
schema.plugin(AutoIncrement, {inc_field: 'issue_id'});
module.exports = mongoose.model(modelName, schema);
