var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var modelUser = require('./../members/member.schema.js');
var valid = require('./login.valid.js');
module.exports.isLogin = function (req , res , next) {
  console.log(req.body.token);
  jwt.verify(req.body.token, process.env.secret, function (err, decoded) {
    if (err) {
      console.log('token error');
      res.status(401).send({message: 'token error' ,title : 'Authentication'});
    }
    else if (decoded) {
      console.log(decoded);
      res.send({message: 'done'});
    }
  });
};

module.exports.loginProcess = function (req , res , next) {
  let error = valid.validation(req);
  if (error == '') {
    modelUser.findOne({'username': req.body.username},
      function (err, user) {
        console.log(user);
        if (err) {
          return res.status(500).send()
        }
        if (!user) {
          console.log('err');
          return res.status(400).send({ title : 'Authentication', message: 'not found user' });
        }
        if (user.userStatus == 'inActive') {
          return res.status(400).send({ title : 'Authentication',  message: 'wait for accept by admin'});
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          console.log('err');
          return res.status(400).send({title : 'Authentication' ,  message: 'password not match' });
        } else {
          console.log('done login');
          var token = jwt.sign({_id: user.id  } , process.env.secret, {expiresIn: '7d'});
          res.send({success: true,  token: token, username : user.username  , _id : user._id , image : user.image ,isAdmin : user.isAdmin });
        }
      }
    )
  }else{
    res.status(400).send({message : error})
  }
};
