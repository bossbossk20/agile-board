var role = require('./role.schema.js')
module.exports.getAllRole = function (req, res) {
  role.find({}).exec((err , results)=>{
    res.send(results);
  })
}
module.exports.addRole = function (req, res) {
    var obj = new role(req.body)
    obj.save(function(err, obj){
      if (err) {
          return res.status(400).send({ 'message' : err });
      }
      if (obj) {
          return res.send(obj);
        }
    })
}
