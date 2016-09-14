(function () {
  'use strict';
  var express = require('express');
  var router = express.Router();
  // app.use(cors());
  var controller = require('./login.controller.js');
  router.post('/login', controller.loginProcess);
  router.post('/stillLogin', controller.isLogin);
  module.exports = router;
})();
