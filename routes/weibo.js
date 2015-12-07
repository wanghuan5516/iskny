var express = require('express');
var router = express.Router();
var BlogModel = require("../models/blogs");
function handleError(err,next){
    console.log(err);
    next(err);
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    BlogModel.findOne({"$where":"this.type=='weibo'"},null,{sort:{"sort":1,"time":-1}},function(err,data){
        if(err){
            handleError(err,next);
        }else{
            if(data==null){
                data = {};
            }
            res.render('weibo', { title: data.title ,data:data ,pretty:true});
        }
    });
});

module.exports = router;