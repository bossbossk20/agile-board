(function () {
  'use strict';
  var express = require('express');
  var passport = require('passport');
  var Strategy = require('passport-http-bearer').Strategy;
  var router = express.Router();
  var controller = require('./project.controller.js');
  router.get('/projects', controller.getAllproject);
  router.post('/projects', passport.authenticate('bearer', { session: false }) , controller.createProject);
  router.delete('/project/:id', controller.delectProject);
  router.put('/projects', passport.authenticate('bearer', { session: false }) , controller.editProject);
  router.post('/projectId', passport.authenticate('bearer', { session: false }) , controller.getIdByProjectName);
  router.get('/projects/:name' , controller.findOneProject);
  module.exports = router;
})();
