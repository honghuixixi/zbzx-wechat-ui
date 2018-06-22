var Util = {
    format: function(dt, fmt) {
        var o = {
            "M+": dt.getMonth() + 1, //月份   
            "d+": dt.getDate(), //日   
            "h+": dt.getHours(), //小时   
            "m+": dt.getMinutes(), //分   
            "s+": dt.getSeconds(), //秒   
            "q+": Math.floor((dt.getMonth() + 3) / 3), //季度   
            "S": dt.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    get: function(url, param, fun) {
        $.ajax({
            type: 'get',
            url: url,
            data: param,
            complete: function(res) {
                var data = res.responseText ? JSON.parse(res.responseText) : { code: 0, msg: '' };
                fun(data);
            }
        });
    },
    post: function(url, param, fun) {
        $.ajax({
            type: 'post',
            url: url,
            data: JSON.stringify(param),
            contentType: 'application/json;charset=UTF-8',
            complete: function(res) {
                var data = res.responseText ? JSON.parse(res.responseText) : { code: 0, msg: '' };
                fun(data);
            }
        });
    },
    post2: function(url, param, fun) {
        $.ajax({
            type: 'post',
            url: url,
            data: param,
            complete: function(res) {
                var data = res.responseText ? JSON.parse(res.responseText) : { code: 0, msg: '' };
                fun(data);
            }
        });
    },
    displayList: function(list, dom, url) {
        $('#empty').hide();
        if (list && list.length > 0) {
            var html = [];
            for (var i = 0, len = list.length; i < len; i++) {
                html.push('<a class="' + (list[i].isRead ? 'row' : 'row tip') + '" href="' + url + '?id=' + list[i].id + '">');
                html.push('<div class="title">' + list[i].title.replace(/ /g, '&nbsp;') + '</div>');
                html.push('<div class="info">');
                html.push('<div class="org">' + list[i].org + '</div>');
                html.push('<div class="time">' + Util.format(new Date(list[i].publishTime), 'yyyy-MM-dd hh:mm') + '</div>');
                html.push('</div>');
                html.push('</a>');
            }
            dom.html(dom.html() + html.join(''));
        } else {
            $('#empty').show();
        }
    },
    displayList2: function(list, dom, url, label) {
        label = label.split('|');
        $('#empty').hide();
        if (list && list.length > 0) {
            var html = [],
                cls = '';
            for (var i = 0, len = list.length; i < len; i++) {
                cls = 'row';
                if (!list[i].isRead) {
                    cls += ' tip';
                }
                if (+list[i].reply === 1) {
                    cls += ' reply';
                } else {
                    cls += ' noreply';
                }
                html.push('<a class="' + cls + '" href="' + url + '?id=' + list[i].id + '">');
                html.push('<div class="title"><span class="label">' + label[list[i].type - 1] + '</span>' + list[i].title.replace(/ /g, '&nbsp;') + '</div>');
                html.push('<div class="info">');
                html.push('<div class="org">' + list[i].org + '</div>');
                html.push('<div class="time">' + Util.format(new Date(list[i].publishTime), 'yyyy-MM-dd hh:mm') + '</div>');
                html.push('</div>');
                html.push('</a>');
            }
            dom.html(dom.html() + html.join(''));
        } else {
            $('#empty').show();
        }
    },
    displayList3: function(list, dom, candel) {
        if (list && list.length > 0) {
            var html = [];
            for (var i = 0, len = list.length; i < len; i++) {
                html.push('<div class="item">');
                html.push('<div class="title"><div>' + list[i].replyName + '</div><div>&nbsp;&nbsp;' + list[i].org + '</div></div>');
                html.push('<div class="con">' + list[i].content + '</div>');
                if(candel){
                    html.push('<div class="time">' + Util.format(new Date(list[i].replyTime), 'yyyy-MM-dd hh:mm') + '<span onclick="delReply(' + list[i].id + ', this)"><i class="iconfont">&#xe609;</i>删除</span></div>');
                }else{
                    html.push('<div class="time">' + Util.format(new Date(list[i].replyTime), 'yyyy-MM-dd hh:mm') + '</div>');
                }                
                html.push('</div>');
            }
            dom.html(dom.html() + html.join(''));
        }
    },
    scrollLoad: function(fun) {
        $(window).scroll(function() {
            var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
            var scrollHeight = $(document).height(); //当前页面的总高度
            var clientHeight = $(this).height(); //当前可视的页面高度
            if (scrollTop + clientHeight >= scrollHeight) { //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++; 
                fun();
            } else if (scrollTop <= 0) {
                //滚动条距离顶部的高度小于等于0 TODO
                //alert("下拉刷新，要在这调用啥方法？");
            }
        });
    },
    getDetail: function(url, fun) {
        Util.get(url, {}, fun);
    },
    isHistoryContain: function(list, val) {
        var result = false;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] === val) {
                result = true;
                break;
            }
        }
        return result;
    },
    removeHis: function (list, val) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i] === val) {
                list.splice(i, 1);
                break;
            }
        }
    },
    showHistory: function(localKey) {
        var his = localStorage.getItem(localKey);
        var html = [];
        if (his) {
            his = JSON.parse(his);
            for (var i = 0, len = his.length; i < len; i++) {
                html.push('<div class="item" onclick="chooseHis(this)">' + his[i] + '</div>');
            }
        }
        $('#hisList').html(html.join(''));
        $('#main').hide();
        $('#history').show();
        window.scrollTo(0, 0);
    },
    search: function(localKey, fun) {
        var kwd = $('#kwd').val();
        $('#main').show();
        $('#history').hide();
        $('#list').empty();
        if (kwd.length > 0) {
            var his = localStorage.getItem(localKey)
            if (his) {
                his = JSON.parse(his);
            } else {
                his = [];
            }
            if (Util.isHistoryContain(his, kwd)) {
                Util.removeHis(his, kwd);
            }
            his = [kwd].concat(his);
            if(his.length > 8){
                his.pop();
            }
            localStorage.setItem(localKey, JSON.stringify(his));
        }
        fun();
    },
    setTitle: function (title) {
        // $("title").html(title);
        var $iframe = $("<iframe style='display:none;' src=''></iframe>"),
            $body = $('body');
        document.title = title;
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 10);
        }).appendTo($body);
    }
};