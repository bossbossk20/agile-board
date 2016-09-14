var version = require('./version.schema.js');
module.exports.getAllVersion = function (req, res) {
  version.find({}).exec((err, results) => {
    if (err) {
      return res.status(400).send({message: err});
    }
    if (results) {
      return res.send(results);
    }
  });
};

module.exports.addVersion = function (req, res) {
  var obj = new version(req.body);
  obj.save(function (err, version) {
    if (err) {
      return res.status(400).send({ message: err });
    }
    if (version) {
      return res.send(version);
    }
  });
};

module.exports.getVersionByProjectId = function (req, res) {
  version.find({ project : req.params.id }).exec((err, results)=>{
    if (err) {
      return res.status(400).send(err)
    }
    if (results) {
      return res.send(results)
    }
  })
}
