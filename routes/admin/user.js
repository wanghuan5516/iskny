/**
 * Created by 伟强 on 2015/3/15.
 */
var BlogModel = require("../../models/user");
var utils = require("../../utils");
var setResultInfo = utils.setResultInfo;
var showResultInfo = utils.showResultInfo;
var loginAuthCheck = utils.adminLoginAuthCheck;
//loginAuthCheck = function(req, res, next){next();};
var pageSize = global.pageSize;
var getInt = utils.getInt;

module.exports = function(router){
    /* GET blogs page. */
    router.get('/users',loginAuthCheck, function(req, res, next) {
        var data = {};
        data.title = "用户管理";
        var body = req.body;
        var page = getInt(req.query.page,1);

        var fields = "_id loginname type nickname state createtime regip";
        var conditions=utils.makeConditions(req.query);
        BlogModel.find(conditions)
            .count(function(err,totals){//想办法解决多层回调
            var pager = utils.pager(totals,page,pageSize,req.query.pageCount);
            showResultInfo(req, data);
            BlogModel.find(conditions)
                .select(fields)
                .skip(pager.begin)
                .limit(pager.pageSize)
                .sort("-_id")
                .exec(function (err, datas) {
                    if (err) {
                        handleError(err, next);
                    } else {
                        data.datas = datas;
                        data.conditions = conditions;
                        data.pageUrl = utils.pageUrl(req);
                        data.pager = pager;
                        res.render('admin/users', data);
                    }
                });
        });//结果集合大小

    });

    router.get('/user',loginAuthCheck, function(req, res, next) {
        res.render('admin/user', { title: '添加用户'});
    });
    router.post('/user',loginAuthCheck, function(req, res, next) {
        var blog = getPostBlog(req);
        new BlogModel(blog).save(function(err){
            if(err){
                handleError(err,next);
            }else{
                setResultInfo(req,"添加成功");
                res.redirect("/admin/users");
            }

        });
//    res.render('admin/blog', { title: '添加文章'});
    });
    router.get('/user/:id/delete',loginAuthCheck, function(req, res, next) {
        var blog;
        var id = req.params["id"];
        if(id){
            BlogModel.findByIdAndRemove(id,function(err,data){
                if(err){
                    handleError(err,next);
                }else{
                    setResultInfo(req,"删除成功");
                    res.redirect("/admin/users");
                }
            });
        }else{
            next();
        }

    });
    router.get('/user/:id',loginAuthCheck, function(req, res, next) {
        var blog;
        var id = req.params["id"];
        if(id){
            BlogModel.findOne({_id:id},function(err,data){
                if(err){
                    handleError(err,next);
                }else{
                    showResultInfo(req,data);
                    res.render('admin/user', { title: '用户管理' ,data:data});
                }
            });
        }

    });
    router.post('/user/:id',loginAuthCheck, function(req, res, next) {
        var blog = getPostBlog(req);
        var id = req.params["id"];

        if(id){
            BlogModel.findByIdAndUpdate(id,blog,function(err,data){
                if(err){
                    handleError(err,next);
                }else{
                    setResultInfo(req,"修改成功");
                    res.redirect("/admin/users");
                }
            });
        }

    });

    function getPostBlog(req){
        var body = req.body;
        var blog = {
            type:'后台添加',
            loginname:body.loginname,
            nickname:body.nickname,
            password:body.password
        };
        if(blog.type=="doing"||blog.title=="碎言碎语"){
            blog.type=="doing";
            blog.title=="碎言碎语";
        }
        return blog;
    }
    function handleError(err,next){
        console.log(err);
        next(err);
    }
};

