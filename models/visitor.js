/**
 * Created by 伟强 on 2015/3/12.
 */
var mongodb = require('./mongodb');

var Schema = mongodb.mongoose.Schema;
// Schema 结构
var mongooseSchema = new Schema({
    ip : {type : String, default : ''},
    name  : {type : String, default : ''},
    remark  : {type : String, default : ''},
    time     : {type : Date, default: Date.now}
});

// model
var mongooseModel = mongodb.mongoose.model('visitor', mongooseSchema);

module.exports = mongooseModel;