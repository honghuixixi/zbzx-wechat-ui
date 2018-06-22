const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config');

function setRandom() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function getDeviceId() {
    return (setRandom() + setRandom() + "-" + setRandom() + "-" + setRandom() + "-" + setRandom() + "-" + setRandom() + setRandom() + setRandom());
}


function ajax(type, url, param, successHandler, errorHandler) {
    request({
            "method": type,
            "url": url,
            "baseUrl": config.server,
            "json": true,
            "body": param
        },
        (error, response, body) => {
            if (error) {
                errorHandler(error);
            } else {
                successHandler(body);
            }
        });
}


// 登录
router.post('/login', function(req, res, next) {
    if(!req.session.openId){
        res.redirect(config.author);
    }
    req.body.deviceId = getDeviceId();
    req.body.openId = req.session.openId;
    req.session.name = req.body.username;
  
    ajax('POST', config.login, req.body, function(body) {
        if ((body.code + '') === '200') {
            req.session.author = body;
            req.session.loginError = null;
            req.session.name = null;
            req.session.homeCount = 1;
            res.redirect('/author/index');
        } else {
            req.session.loginError = body.msg;
            res.redirect('/?openId=' + req.session.openId);
        }
    }, function(error) {
        req.session.loginError = error.errno;
        res.redirect('/?openId=' + req.session.openId);
    });

});

// 退出
router.get('/logout', function(req, res, next) {
	req.session.name = null;
    req.session.author = null;
    req.session.loginError = null;
    req.session.openId = null;
    res.redirect(config.author);
});

router.post('/bindRecive', function(req, res, next) {
    req.session.author.wxUser.isRcvMsg = true;
    res.json({code: 200, msg: 'ok'});
});

router.post('/unbindRecive', function(req, res, next) {
    req.session.author.wxUser.isRcvMsg = false;
    res.json({code: 200, msg: 'ok'});
});

router.get('/getHomeount', function(req, res, next) {
    req.session.homeCount = req.session.homeCount + 1;
    res.json({code: 200, msg: 'ok', data: req.session.homeCount});
});


module.exports = router;