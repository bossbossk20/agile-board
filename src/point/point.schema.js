var modelName = 'point';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name : String,
    value : Number
})
module.exports = mongoose.model(modelName, schema);
