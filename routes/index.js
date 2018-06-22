var express = require('express');
var router = express.Router();
const config = require('../config');

// 登录
router.get('/', function(req, res, next) {
	req.session.openId = req.query.openId;
  res.render('login', {err: req.session.loginError || '', name: req.session.name, checkLoginName: config.checkLoginName});
});

// 忘记密码
router.get('/forgetpwd', function(req, res, next) {
  res.render('resetpwd', {
		title: '忘记密码', 
		checkMobile: config.checkMobile,
  	sendCode: config.sendCode
  });
});

module.exports = router;
