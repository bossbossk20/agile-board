var modelName = 'priority';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name : String ,
    value : String
})
module.exports = mongoose.model(modelName, schema);
