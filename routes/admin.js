var express = require('express');
var router = express.Router();
var fs = require("fs");
var utils = require("../utils");
var setResultInfo = utils.setResultInfo;
var showResultInfo = utils.showResultInfo;
var loginAuthCheck = utils.adminLoginAuthCheck;;

/* GET login page. */
router.get('/login', function(req, res, next) {
    var data = {title: '管理后台登录'};
    showResultInfo(req,data);
    res.render('admin/login', data);
});
router.post('/login', function(req, res, next) {
    var username=req.body.username;
    var pass=req.body.password;
    if(username=="iskny"&&pass==""){
        req.session.username = username;
        var toUrl = req.session.toUrl||"/admin";
        delete req.session.toUrl;
        res.redirect(toUrl);
    }else{
        setResultInfo(req,"用户名或密码错误");
        res.redirect("/admin/login");
    }

});
/* GET home page. */
router.get('/',loginAuthCheck,function(req, res, next) {
	console.log("admin:"+req.PATH);
  res.render('admin/index', { title: '管理后台首页' });
});


router.loginAuthCheck = loginAuthCheck;
require("./admin/blogs")(router);
require("./admin/user")(router);

module.exports = router;