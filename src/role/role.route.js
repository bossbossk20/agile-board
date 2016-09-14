var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./role.controller.js');
router.get('/role', controller.getAllRole);
router.post('/role', controller.addRole);
module.exports = router;
