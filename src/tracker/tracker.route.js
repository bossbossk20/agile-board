var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./tracker.controller.js');
router.get('/tracker', controller.getAllTracker);
router.post('/tracker', controller.addTracker);
module.exports = router;
