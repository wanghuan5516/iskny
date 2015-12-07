/**
 * Created by Administrator on 2015/10/24.
 */
var async = require("async");
var BlogModel = require("../models/blogs");
/**
 * ����ǰN�����ݷ���global��ҳ��ʹ��,�Ҳ಩��
 * @param req
 * @param res
 * @param next
 */
var rightblog = function (req,res,next) {
    var conditions = {};
    var fields = "_id title";
    var sort = "-time";
    conditions["$where"] = "this.type!='ixuejiao'";
    if(!global.cache_blog||!global.cache_blog.new){
        async.series({
            "new":function(cb){//��ѯ���
                BlogModel.find(conditions)
                    .select(fields)
                    .limit(10)
                    .sort("-time")
                    .exec(cb);
            },
            "hot":function(cb){//��ѯ���
                BlogModel.find(conditions)
                    .select(fields)
                    .limit(5)
                    .sort("-clicks")
                    .exec(cb);
            }},function(err,result){
            if(err){next(err);return;}
            var news = result["new"];
            var hots = result["hot"];

            var cache_blog  = global.cache_blog||{};
            cache_blog["new"] = result["new"];
            cache_blog["hot"] = result["hot"];
            res.locals.cache_blog = cache_blog;
            global.cache_blog = cache_blog;
            next();
        });
    }else{
        res.locals.cache_blog = global.cache_blog;
        next();
    }
};

var bottomblog = function (req,res,next) {
    var conditions = {};
    var fields = "_id title";
    var sort = "-time";
    conditions["$where"] = "this.type!='ixuejiao'";
    if(!global.cache_blog||!global.cache_blog.bottom){
        async.series({
            "bottom":function(cb){//��ѯ���
                BlogModel.find(conditions)
                    .select(fields)
                    .limit(6)
                    .exec(cb);
            }},function(err,result){
            if(err){next(err);return;}

            var cache_blog = global.cache_blog||{};
            cache_blog["bottom"] = result["bottom"];
            res.locals.cache_blog = cache_blog;
            global.cache_blog = cache_blog;
            next();
        });
    }else{
        res.locals.cache_blog = global.cache_blog
        next();
    }
};
var minite = 3;//����ʱ��,����
setInterval(function () {
    global.cache_blog = null;//�建�氡
    console.log("cache_blog cleared");
},minite * 60 * 1000);
exports.rightblog = rightblog;
exports.bottomblog = bottomblog;