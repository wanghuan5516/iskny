var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('about', { title: '关于我',username:req.session.username });
});

module.exports = router;
