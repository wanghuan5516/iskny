var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require("../utils");

/* GET home page. */
router.get('/', function(req, res, next) {
  utils.handleFrontList(req, res, next,{ title: '学无止境，想学或者推荐的有意思的东西' });
});

module.exports = router;
