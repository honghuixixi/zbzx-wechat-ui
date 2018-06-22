const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const proxy = require('http-proxy-middleware');

const index = require('./routes/index');
const users = require('./routes/users');
const author = require('./routes/author');

const config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', (require('ejs')).__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 启用session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 过期时间设置(单位毫秒)
    }
}));

// 登录检测
app.use(function(req, res, next) {
    if (req.session.author) {
        next();
    } else {        
        var arr = req.url.split('/');
        if(arr.length > 2 && (arr[1] === 'api' || arr[1] === 'author')){
        	res.redirect(config.author);
        }else{
        	next();
        }
    }
});
// 路由
app.use('/', index);
app.use('/author', author);
app.use('/users', users);

// 数据请求代理
const apiProxy = proxy('/api', {
    target: config.server,
    changeOrigin: true,
    pathRewrite: {  
        '^/zuul': '/zuul',     
        '^/api2': '/api',
        '^/api': '/api'
    },
    onProxyReq: function(proxyReq, req, res) {
        if (req.session.author) {
            proxyReq.setHeader('X-AEK56-Token', req.session.author.token);
        }
    }
});
app.use(apiProxy);
const apiProxy2 = proxy('/zuul', {
    target: config.server,
    changeOrigin: true,
    pathRewrite: {  
        '^/zuul': '/zuul', 
    }
});
app.use(apiProxy2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;