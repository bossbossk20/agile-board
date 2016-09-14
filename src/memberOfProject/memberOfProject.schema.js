(function () {
  'use strict';
  var modelName = 'memberOfProject';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var schema = new Schema({
    member: {
      type: Schema.ObjectId,
      ref: 'members'
    },
    project: {
      type: Schema.ObjectId,
      ref: 'projects'
    },
    role: {
      type: Schema.ObjectId,
      ref: 'role'
    }
  });
  module.exports = mongoose.model(modelName, schema);
})();
