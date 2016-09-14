var modelName = 'version';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
  name : String ,
  createdAt: {
    type: Date,
    default: Date.now
  },
  finishedAt: {
    type: Date
  },
  releaseVersion: {
    type: String,
    default: ''
  },
  project : {
    type : Schema.ObjectId,
    ref : 'project'
  },
  statusVersion : {
    type : Schema.ObjectId,
    ref : 'statusVersion'
  }
});
module.exports = mongoose.model(modelName, schema);
