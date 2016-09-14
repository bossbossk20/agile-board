var priority = require('./priority.schema.js')
module.exports.getAllPriority = function (req, res) {
  priority.find({}).exec((err , results)=>{
    res.send(results);
  })
}
module.exports.addPriority = function (req, res) {
    var obj = new priority(req.body)
    obj.save(function(err, obj){
      if (err) {
          return res.status(400).send({ 'message' : err });
      }
      if (obj) {
          return res.send(obj);
        }
    })
}
