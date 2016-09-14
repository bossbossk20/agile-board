var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./point.controller.js');
router.get('/point', controller.getAllPoint);
router.post('/point', controller.addPoint);
module.exports = router;
