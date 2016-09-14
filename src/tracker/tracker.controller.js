var tracker = require('./tracker.schema.js');
module.exports.getAllTracker = function (req, res) {
    tracker.find({}).exec((err , results)=>{
      res.send(results);
    })
}
module.exports.addTracker = function (req,res) {
  var obj = new tracker(req.body)
  obj.save(function(err, obj){
    if (err) {
        return res.status(400).send({ 'message' : err });
    }
    if (obj) {
        return res.send(obj);
      }
  })
}
