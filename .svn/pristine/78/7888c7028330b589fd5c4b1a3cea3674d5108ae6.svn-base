var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require("../utils");

/* GET home page. */
router.get('/', function(req, res, next) {
    utils.handleFrontList(req, res, next,{
        title: '碎言碎语，我的个人状态',
        _view:"doing",
        pageSize:5 ,
        conditions:{type:"doing"},
        sort:[["time",-1]]});
});

module.exports = router;
