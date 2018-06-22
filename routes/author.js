const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('../config');
const adverseLabel = '售后服务|质量缺陷|操作使用|产品配置|其它';
const technicalLabel = '采购计划|验收管理|使用管理|巡检质控|信息化|其它';

// 首页
router.get('/index', function(req, res, next) {    
    res.render('index', {
        openid: req.session.openId,
        user: req.session.author.wxUser,
        stats: config.stats,
        isNeedWeiXinBindingTips: config.isNeedWeiXinBindingTips,
        disableWeiXinBinding: config.disableWeiXinBinding,
        enableWeiXinBinding: config.enableWeiXinBinding
    });
});

// 修改密码
router.get('/changepwd', function(req, res, next) {
    res.render('changepwd', {
        title: '修改密码',
        userId: req.session.author.wxUser.id,
        mobile: req.session.author.wxUser.mobile,
        checkMobile: config.checkMobile,
        sendCode: config.sendCode,
        resetPassword: config.resetPassword
    });
});

// 通知列表
router.get('/notices', function(req, res, next) {
    res.render('list', {
        title: '通知',
        detail: 'noticedetail',
        holder: req.session.author.wxUser.tenantType === 1 ? '请输入标题关键字/监管机构名称查询' : '请输入标题关键字/监管机构名称查询',
        url: config.noticeList,
        type: req.session.author.wxUser.tenantType,
        loginName: req.session.author.wxUser.loginName + '_notice',
        link: 'addnotice'
    });
});

// 消息列表
router.get('/news', function(req, res, next) {
    res.render('list', {
        title: '消息',
        detail: 'newsdetail',
        holder: req.session.author.wxUser.tenantType === 1 ? '请输入标题关键字/监管机构名称查询' : '请输入标题关键字/监管机构名称查询',
        url: config.newsList,
        type: req.session.author.wxUser.tenantType,
        loginName: req.session.author.wxUser.loginName + '_news',
        link: 'addnews'
    });
});

// 资料列表
router.get('/articles', function(req, res, next) {
    res.render('list', {
        title: '资料',
        detail: 'articledetail',
        holder: req.session.author.wxUser.tenantType === 1 ? '请输入标题关键字/监管机构名称查询' : '请输入标题关键字/监管机构名称查询',
        url: config.articleList,
        type: req.session.author.wxUser.tenantType,
        loginName: req.session.author.wxUser.loginName + '_article',
        link: 'addarticle'
    });
});

// 售后与不良事件列表
router.get('/adverses', function(req, res, next) {
    res.render('list2', {
        title: '售后与不良事件',
        detail: 'adversedetail',
        holder: req.session.author.wxUser.tenantType === 1 ? '请输入标题关键字查询' : '请输入标题关键字/机构名称查询',
        url: config.complaintList,
        label: adverseLabel,
        type: req.session.author.wxUser.tenantType,
        loginName: req.session.author.wxUser.loginName + '_adverse',
        link: 'addadverse'
    });
});

// 技术咨询列表
router.get('/technicals', function(req, res, next) {
    res.render('list2', {
        title: '技术咨询',
        detail: 'technicaldetail',
        holder: req.session.author.wxUser.tenantType === 1 ? '请输入标题关键字查询' : '请输入标题关键字/机构名称查询',
        url: config.consultationList,
        label: technicalLabel,
        type: req.session.author.wxUser.tenantType,
        loginName: req.session.author.wxUser.loginName + '_technical',
        link: 'addtechnical'
    });
});

// 通知详情
router.get('/noticedetail', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('detail', {
        id: id,
        title: '通知详情',
        server: config.server,
        url: config.detail + id,
        url2: 'null',
        link: 'null',
        edit: 'addnotice?id=' + id,
        deleteById: config.deleteById + id,
        deletReply: config.deletReply
    });
});

// 消息详情
router.get('/newsdetail', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('detail', {
        id: id,
        title: '消息详情',
        server: config.server,
        url: config.detail + id,
        url2: 'null',
        link: 'null',
        edit: 'addnews?id=' + id,
        deleteById: config.deleteById + id,
        deletReply: config.deletReply
    });
});

// 资料详情
router.get('/articledetail', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('detail', {
        id: id,
        title: '资料详情',
        server: config.server,
        url: config.detail + id,
        url2: config.replyList2 + id,
        link: 'articlereply',
        edit: 'addarticle?id=' + id,
        deleteById: config.deleteById + id,
        deletReply: config.deletReply
    });
});

// 售后与不良事件详情
router.get('/adversedetail', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('detail2', {
        id: id,
        title: '售后与不良事件详情',
        server: config.server,
        url: config.detail2 + id,
        url2: config.replyList + id,
        label: adverseLabel,
        link: 'adversereply',
        type: req.session.author.wxUser.tenantType,
        deleteById: config.deleteBadConsultById + id
    });
});

// 技术咨询详情
router.get('/technicaldetail', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('detail2', {
        id: id,
        title: '技术咨询详情',
        server: config.server,
        url: config.detail3 + id,
        url2: config.replyList + id,
        label: technicalLabel,
        link: 'techinalreply',
        type: req.session.author.wxUser.tenantType,
        deleteById: config.deleteBadConsultById + id
    });
});

// 新建通知
router.get('/addnotice', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('publish', {
        title: '通知',
        title2: id < 1 ? '发布通知' : '编辑通知',
        tenantId: req.session.author.wxUser.tenantId,
        orgurl: config.selectWxTenant,
        addUrl: config.newNotice,
        isEdit: req.query.id ? true : false,
        getContentReturn: config.getContentReturn + id,
        id: id,
        editUrl: config.editNotice,
        upload: config.server + config.upload,
        server: config.server,
        getJsSdkConfigInfo: config.getJsSdkConfigInfo,
        uploadWeiXinImage: config.uploadWeiXinImage
    });
});

// 新建消息
router.get('/addnews', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('publish', {
        title: '消息',
        title2: id < 1 ? '发布消息' : '编辑消息',
        tenantId: req.session.author.wxUser.tenantId,
        orgurl: config.selectWxTenant,
        addUrl: config.newNews,
        isEdit: req.query.id ? true : false,
        getContentReturn: config.getContentReturn + id,
        id: id,
        editUrl: config.editNews,
        upload: config.server + config.upload,
        server: config.server,
        getJsSdkConfigInfo: config.getJsSdkConfigInfo,
        uploadWeiXinImage: config.uploadWeiXinImage
    });
});

// 新建资料
router.get('/addarticle', function(req, res, next) {
    const id = req.query.id || 0;
    res.render('publish', {
        title: '资料',
        title2: id < 1 ? '发布资料' : '编辑资料',
        tenantId: req.session.author.wxUser.tenantId,
        orgurl: config.selectWxTenant,
        addUrl: config.newArticle,
        isEdit: req.query.id ? true : false,
        getContentReturn: config.getContentReturn + id,
        id: id,
        editUrl: config.editArticle,
        upload: config.server + config.upload,
        server: config.server,
        getJsSdkConfigInfo: config.getJsSdkConfigInfo,
        uploadWeiXinImage: config.uploadWeiXinImage
    });
});

// 新建售后与不良事件
router.get('/addadverse', function(req, res, next) {
    res.render('ask', {
        title: '投诉',
        label: adverseLabel,
        url: config.newBadAsk,
        upload: config.server + config.upload,
        server: config.server,
        getJsSdkConfigInfo: config.getJsSdkConfigInfo,
        uploadWeiXinImage: config.uploadWeiXinImage
    });
});

// 新建技术咨询
router.get('/addtechnical', function(req, res, next) {
    res.render('ask', {
        title: '咨询',
        label: technicalLabel,
        url: config.newConsult,
        upload: config.server + config.upload,
        server: config.server,
        getJsSdkConfigInfo: config.getJsSdkConfigInfo,
        uploadWeiXinImage: config.uploadWeiXinImage
    });
});


// 资料回复
router.get('/articlereply', function(req, res, next) {
    res.render('reply', { title: '资料', url: config.addArticleReply, id: (req.query.id || 0) });
});

// 售后与不良事件回复
router.get('/adversereply', function(req, res, next) {
    res.render('reply', { title: '售后与不良事件', url: config.addBadAskReply, id: (req.query.id || 0) });
});

// 技术咨询回复
router.get('/techinalreply', function(req, res, next) {
    res.render('reply', { title: '技术咨询', url: config.addBadAskReply, id: (req.query.id || 0) });
});


// 编辑通知
router.get('/editnotice', function(req, res, next) {
    res.render('editnotice', { id: req.query.id || 0 });
});

// 编辑消息
router.get('/editnews', function(req, res, next) {
    res.render('editnews', { id: req.query.id || 0 });
});

// 编辑资料
router.get('/editarticle', function(req, res, next) {
    res.render('editarticle', { id: req.query.id || 0 });
});

// 编辑售后与不良事件
router.get('/editadverse', function(req, res, next) {
    res.render('editadverse', { id: req.query.id || 0 });
});

// 编辑技术咨询
router.get('/edittechnical', function(req, res, next) {
    res.render('edittechnical', { id: req.query.id || 0 });
});

// 通知搜索
router.get('/noticehistory', function(req, res, next) {
    res.render('noticehistory');
});

// 消息搜索
router.get('/newshistory', function(req, res, next) {
    res.render('newshistory');
});

// 资料搜索
router.get('/articlehistory', function(req, res, next) {
    res.render('articlehistory');
});

// 售后与不良事件搜索
router.get('/adversehistory', function(req, res, next) {
    res.render('adversehistory');
});

// 技术咨询搜索
router.get('/technicalhistory', function(req, res, next) {
    res.render('technicalhistory');
});

// pdf预览（pdfobject）
router.get('/pdf', function(req, res, next) {
    res.render('pdf', {file: req.query.file});
});

// pdf预览（pdfjs）
router.get('/pdfjs', function(req, res, next) {
    res.render('viewer');
});

module.exports = router;