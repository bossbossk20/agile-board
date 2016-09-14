var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var router = express.Router();
var controller = require('./version.controller.js');
router.get('/version', controller.getAllVersion);
router.post('/version', controller.addVersion);
router.get('/version/:id', controller.getVersionByProjectId);
module.exports = router;
