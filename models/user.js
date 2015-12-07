/**
 *
 * @type {exports|module.exports}
 */
var mongodb = require('./mongodb');

var Schema = mongodb.mongoose.Schema;
// Schema 结构
var mongooseSchema = new Schema({
    loginname : {type : String, unique : true},
    nickname :  String,
    password : String,
    type      :   String,
    time      : {type : Date, default: Date.now},
    regip     : String,
    state     : String,
    code:String
});

// model
var mongooseModel = mongodb.mongoose.model('user', mongooseSchema);

module.exports = mongooseModel;