var express = require('express');
var router = express.Router();
var path = require('path');
var utils = require("../utils");

/* GET home page. */
router.get('/', function(req, res, next) {
  utils.handleFrontList(req, res, next,{ title: '慢生活，分享生活点滴' });
});

module.exports = router;
