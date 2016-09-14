status = require('./status.schema.js')
module.exports.getAllStatus = function (req, res) {
  status.find({}).exec((err , results)=>{
    if (err) {
        res.status(400).send({message : err});
    }
    if (results) {
        res.send(results);
    }
  })
}
module.exports.addStatus = function (req,res) {
  var obj = new status(req.body)
  obj.save(function(err, obj){
    if (err) {
        return res.status(400).send({ 'message' : err });
    }
    if (obj) {
        return res.send(obj);
      }
  })
}
