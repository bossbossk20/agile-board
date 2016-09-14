var Joi = require('joi');
var schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().email().required()
});
module.exports.validation = function (req) {
  let mes = '';
  Joi.validate(req.body , schema, function (err, value) {
    if (err) {
      mes = err.details[0].message;
    }else {
    }
  });
  return mes;
};
