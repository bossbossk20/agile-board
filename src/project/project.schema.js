(function () {
  'use strict';
  var modelName = 'projects';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var schema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    createBy: {
      type: Schema.ObjectId,
      ref: 'members'
    },
    // public : Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  module.exports = mongoose.model(modelName, schema);
})();
