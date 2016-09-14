var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./priority.controller.js');
router.get('/priority', controller.getAllPriority);
router.post('/priority', controller.addPriority);
module.exports = router;
