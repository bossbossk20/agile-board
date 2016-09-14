var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./statusVersion.controller.js');
router.get('/statusVersion', controller.getAllStatusVersion);
router.post('/statusVersion', controller.addStatusVersion);

module.exports = router;
