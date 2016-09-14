point = require('./point.schema.js');
module.exports.getAllPoint = function (req, res) {
  point.find({}).exec((err, results)=>{
    if (err) {
      res.status(400).send({message : err})
    }
    if (results) {
      res.send(results)
    }
  })
}

module.exports.addPoint = function (req, res) {
  var obj = new point(req.body)
  obj.save(function(err , obj){
    if (err) {
        res.send({message : err })
    }
    if (obj) {
        res.send(obj)
    }
  })
}
