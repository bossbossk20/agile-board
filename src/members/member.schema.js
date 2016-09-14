(function () {
  'use strict';
  var modelName = 'members';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var schema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    image : {
      type: String,
      default : 'http://localhost:4000/uploads/user.png'
    },
    name: String,
    surname: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,  default: false
    },
    userStatus: {
      type: String,  default: 'inActive'
    },
    createdAt: {
      type: Date,  default: Date.now
    },
    updatedAt: {
      type: Date,  default: Date.now
    }

  });
  module.exports = mongoose.model(modelName, schema);
})();
