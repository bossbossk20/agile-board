var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./status.controller.js');
router.get('/status', controller.getAllStatus);
router.post('/status', controller.addStatus);
module.exports = router;
