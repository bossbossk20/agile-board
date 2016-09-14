var statusVersion = require('./statusVersion.schema.js');

module.exports.getAllStatusVersion = function (req, res) {
  statusVersion.find({}).exec((err, results) => {
    if (err) {
      return res.status(400).send({ message: err});
    }
    if (results) {
      res.send(results);
    }
  });
};

module.exports.addStatusVersion = function (req, res) {
  var obj = new statusVersion(req.body);
  obj.save(function (err, obj) {
    if (err) {
      return res.status(400).send({message: err});
    }
    if (obj) {
      return res.send(obj);
    }
  });
};
