(function () {
  'use strict';
  var express = require('express');
  var passport = require('passport');
  var Strategy = require('passport-http-bearer').Strategy;
  var router = express.Router();
  var controller = require('./memberOfProject.controller.js');
  router.get('/projectMembers', controller.getProjectMember);
  router.post('/projectMembers', controller.addMembers);
  router.post('/findProjectbyMember', controller.findProjectbyMember);
  router.delete('/projectMembers/:id',controller.deleteMember);
  router.get('/projectMember/:id', controller.findMemberByProject);
  router.post('/updateRole', controller.updateRole);
  module.exports = router;
})();
