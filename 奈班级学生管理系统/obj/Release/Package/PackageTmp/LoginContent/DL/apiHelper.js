/**
 * 产生标准化的service函数
 * @param {*} methodUrl 格式如:'GET /user/bind/wechat/openweb/:id' 或 '/user/bind/wechat/openweb/:id'
 * @param {*} options { }
 */
(function () {
    var EduBoss = EduBoss || {};
    window.ApiHelper = EduBoss.commonUtils || {};
    EduBoss.microschoolServiceAddress = getMicroschoolServiceAddress(window.location.href.substring(0, window.location.href.indexOf("/eduboss/")) + '/eduboss/');
    window.microschoolServiceAddress = EduBoss.microschoolServiceAddress;
    $.extend(window.ApiHelper, {
        apiGen: function apiGen(methodUrl, options) {
            var url = methodUrl;
            var method = 'get';
            var extOptions = options || {};
            var host = extOptions.host || EduBoss.microschoolServiceAddress,
                body = extOptions.body || {},
                successCallback = extOptions.success,
                errorCallback = extOptions.error,
                failCallback = extOptions.fail,
                noErrorMsg = extOptions.noErrorMsg || false,
                noSuccessMsg = extOptions.noSuccessMsg || false;
            var opt = {};
            var paramsArray = methodUrl.split(' ');
            if (paramsArray.length === 2) {
                method = paramsArray[0].toLowerCase(); // GET > get; POST => post
                url = paramsArray[1];
            }
            if (extOptions.body || method === 'post') {
                opt.contentType = extOptions.contentType || "application/json;charset=utf-8";
            } else if (extOptions.body && method === 'get') {
                url = url + objectToString(body);
            }
            // var accessToken = $.cookie ? $.cookie('access_token') : '';
            // if (Util.checkAccessTokenIsExpired(accessToken)) return;

            return $.ajax($.extend({
                type: method,
                url: host + url,
                noloading: extOptions.noloading || false,
                // headers: Util ? Util.createHeadersForJWT(accessToken) : {},
                data: (extOptions.body && method != 'get') ? JSON.stringify(body) : body,
                // async: args !== 1,  // 只有一个入参时为同步请求
                success: function (res) {
                    if (res.resultCode === 0) {
                        if (method !== 'get' && !noSuccessMsg) {
                            if (Util && Util.showAlert) {
                                Util.showAlert(res.resultMessage || '操作成功');
                            }
                        }
                    } else if (!noErrorMsg && res.resultMessage) {
                        alert(res.resultMessage);
                    }
                    successCallback && successCallback(res);
                },
                error: function (err) {
                    if (!noErrorMsg && err) {
                        alert(err.resultMessage || err.message || err.responseJSON.error || err.responseJSON.resultMessage || '未知错误');
                    }
                    errorCallback && errorCallback(err);
                },
                fail: function (err) {
                    if (!noErrorMsg && err) {
                        alert(err.resultMessage || err.message || err.responseJSON.error || err.responseJSON.resultMessage || '未知错误');
                    }
                    failCallback && failCallback(err);
                }
            }, opt));
        },
        urlGen: function urlGen(api, options) {
            var url = '';
            var extOptions = options || {};
            var host = extOptions.host || EduBoss.microschoolServiceAddress,
                body = extOptions.body || {};

            if (extOptions.body) {
                url = host + api + objectToString(body);
            }
            return url;
        }
    });

    function getMicroschoolServiceAddress(href) {
        var curHost = href.split("/eduboss/")[0];
        var protocol = /^https:/i.test(href) ? 'https:' : 'http:';
        var env = getEnv(curHost);

        var microschoolServiceAddress = protocol + '//wecom-microschool.xuebangsoft.net/xb-app-wecom-microschool';
        if (env.test) {
            microschoolServiceAddress = 'https://wecom-microschool-uat.xuebangsoft.net/xb-app-wecom-microschool';//'http://test.frp.crsyzd.com/xb-app-wecom-microschool';//http://microschoolsat.frpx.wirein.net/xb-app-wecom-microschool'; //'http://localhost:9010/xb-app-wecom-microschool';
        } else if (env.uat) {
            microschoolServiceAddress = protocol + '//wecom-microschool-uat.xuebangsoft.net/xb-app-wecom-microschool';
        } else if (env.pre) {
            microschoolServiceAddress = protocol + '//wecom-microschool-pre.xuebangsoft.net/xb-app-wecom-microschool';
        } else if (env.prd) {
            microschoolServiceAddress = protocol + '//wecom-microschool.xuebangsoft.net/xb-app-wecom-microschool';
        } else {
            console.warn('域名有误，无法生成 microschoolServiceAddress');
            microschoolServiceAddress = '';
        }
        return microschoolServiceAddress;
    };

    function getEnv(href) {
        var isUat = /uat3\./i.test(href);
        var isPre = /pre3\./i.test(href);
        var isTest = /localhost|wxxxtsat|192\.168/i.test(href);
        // var isPrd = /xuebangsoft\.net/i.test(href);
        var isPrd = !(!isUat && !isPre && isTest);
        return { test: isTest, uat: isUat, pre: isPre, prd: isPrd };
    }

    /**
     * 将对象转为带 = 的字符串
     * 比如 { a:1, b:2 } 转为 a=1&b=2
     */
    function objectToString(obj, concat) {
        // $.param 在 3.0 版本前会把空格转 + 号，因此废弃
        // if (jQuery && jQuery.param) {
        //     return jQuery.param(obj);
        // }
        concat = concat || '&';
        var result = [];
        for (var key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            var value = obj[key];
            if (value == undefined) value = '';
            result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
        result = result.join(concat);
        return result;
    }

})();
