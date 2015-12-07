var express = require('express');
var router = express.Router();
var utils = require('../utils');
var formidable = require('formidable'),
    path = require('path');
var form = new formidable.IncomingForm();

/* GET home page. */
router.get('/', function(req, res,next) {
  utils.handleFrontList(req,res,next,{ title: '首页',
      _view:"index",
      pageSize:5 })
});

router.post("/upload/:type",function(req,res){
    var type = "pic"
    if(req.params.type){
        type = req.params.type;
    }
   require("../fileupload").parse(req,res,type);

});
var ueditor = require("ueditor");
router.get("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        var foo = req.ueditor;
        var date = new Date();
        var imgname = req.ueditor.filename;

        var img_url = '/upload/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/upload/ueditor/';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {

        res.setHeader('Content-Type', 'application/json');
        res.redirect('/plugins/ueditor/ueditor.config.js')
    }}));
module.exports = router;
