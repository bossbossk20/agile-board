var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
var schema = Joi.object().keys({
  name: Joi.string().required(),
  description : Joi.string().allow(''),
  timeEstimate : Joi.number().allow(''),
  uploadFile : Joi.string().allow(''),
  point : Joi.string(),
  tracker : Joi.string(),
  status : Joi.string(),
  assignTo : Joi.objectId(),
  createBy : Joi.objectId(),
  priority : Joi.string(),
  version : Joi.objectId(),
  project : Joi.objectId(),
  dueDate : Joi.string()
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
