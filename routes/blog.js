var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require("../utils");
var BlogModel = require("../models/blogs");
/* GET home page. */
router.get('/', function(req, res, next) {
    utils.handleFrontList(req, res, next,"life");
});
var async = require("async");
router.get('/:id', function(req, res, next) {
    var id = req.params["id"];
    if(id){

        BlogModel.findOne({_id:id},function(err,data){
            if(err){
                handleError(err,next);
            }else{
                var time = data.time;
                var type = data.type;
                var fields = "_id title";
                async.series({
                    "next":function(callback){
                    	var query = BlogModel
                    	.find({time:{
                            "$gt": time
                        },type:type})
                    	.select(fields)
                    	.sort("time");
                        query.findOne(callback);
                    },
                    "prev":function(callback){
                        var query = BlogModel
                    	.find({time:{
                            "$lt": time
                        },type:type})
                    	.select(fields)
                    	.sort("-time");
                        query.findOne(callback);
                    }
                },function(err,results){
                    if(err){handleError(err, next);return;}
                    res.render('blog', { title: data.title ,
                        prev:results["prev"],
                        next:results["next"],
                        data:data });
                });
            }
        });
    }

});
function handleError(err,next){
    console.log(err);
    next(err);
}

module.exports = router;
