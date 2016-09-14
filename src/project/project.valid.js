var Joi = require('joi');
var schema = Joi.object().keys({
  name: Joi.string().required(),
  createBy: Joi.required(),
  description : Joi.string().allow('')
});
module.exports.validation = function (req) {
  let mes = '';
  Joi.validate(req.body , schema, function (err, value) {
    if (err) {
      mes = err.details[0].message;
    } else {
    }
  });
  return mes;
};
