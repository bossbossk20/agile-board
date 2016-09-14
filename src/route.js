var express  = require('express');
var router = express.Router();
module.exports = function () {
  var login = require('./login/login.route.js');
  router.use('/', login);

  var project = require('./project/project.route.js');
  router.use('/api', project);

  var membersProject = require('./memberOfProject/memberOfProject.route.js');
  router.use('/api', membersProject);

  var status = require('./status/status.route.js');
  router.use('/api', status);

  var priority = require('./priority/priority.route.js');
  router.use('/api', priority);

  var tracker = require('./tracker/tracker.route.js');
  router.use('/api', tracker);

  var point = require('./point/point.route.js');
  router.use('/api', point);

  var issue = require('./issue/issue.route.js');
  router.use('/api', issue);

  var statusVersion = require('./statusVersion/statusVersion.route.js');
  router.use('/api', statusVersion);

  var role = require('./role/role.route.js');
  router.use('/api' , role);

  var version = require('./version/version.route.js');
  router.use('/api', version);

  var members = require('./members/member.route.js');
  router.use('/api', members);

  return router;
}
