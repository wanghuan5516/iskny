var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('cate', { title: '网站分类导航' });
});

module.exports = router;

