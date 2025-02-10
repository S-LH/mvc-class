var global_verifyCode_interval = null;  //验证码定时器
var global_verifyCode_password = null;//验证码定时器，密码
var baseHref = location.href.split("/eduboss/")[0] + '/eduboss/';
var isHasLoadSecord = false;
var serviceApi = {
    getVerifyCode: baseHref + "CommonAction/sendVerifyCodeV12313123587.do",
    quickSaveInstitutionManage: baseHref + "InstitutionManageController/quickSaveInstitutionManage.do",
    checkPhoneInUse: baseHref + "CommonAction/checkPhoneInUse.do",//校验手机是否存在于系统中并可用
    sendSimpleVarifyCode: baseHref + "CommonAction/sendSimpleVarifyCode.do", //发送验证码接口
    checkPhoneVarifyCode: baseHref + "CommonAction/checkPhoneVarifyCode.do",//校验验证码接口
    getUserSimpleInfoByContact: baseHref + "CommonAction/getUserSimpleInfoByContact.do",//根据手机号码获取选择要重置的用户信息列表
    resetPassword: baseHref + "SystemAction/resetPassword.do",//重置密码并且发送短信接口
    external: baseHref + 'web/WxCorpWebController/scanLogin/external.do',
    tenantPublicInfo: baseHref + 'web/TenantPublicController/info.do',
    path: baseHref + 'web/WxCorpWebController/scanLogin/path.do',
    loginCallBackCodes: baseHref + 'CommonAction/loginCallBackCodes.do',
}
var applyToTryId;
var secondDomainFlag = location.href.indexOf('http://www.xuebangsoft.net') !== 0;//为true代表非 www.xuebangsoft.net,是二级域名或测试环境
$('#j_username_face').attr('placeholder', secondDomainFlag ? '请输入您的手机号码或账号' : '请输入您的手机号码');
$(document).ajaxComplete(function (e, xhr, options, exception) {
    options.noloading || endLoading();
    if (xhr.responseJSON && xhr.responseJSON.resultCode > 0 && xhr.status == 200 && xhr.readyState == 4) {
        var message = xhr.responseJSON.resultMessage ? xhr.responseJSON.resultMessage : "未知错误";
        alert(xhr.responseJSON.resultMessage);
    }
})
$(document).ajaxSend(function (a, b, c) {
    c.noloading || beginLoading();
});
$(document).ajaxError(function (e, xhr, options, exception) {
    if (xhr.responseText || xhr.responseJSON) { //有可能请求被abort了，所以没有返回
        if (xhr.responseText.indexOf("j_spring_cas_security_check") > 0) {//如果返回的是登录界面，说明session已过期，直接把整个页面跳出到登录页面
            window.top.location.href = "/eduboss/login.jsp";
        } else {
            var message = xhr.responseJSON ? xhr.responseJSON.resultMessage : "未知错误";
            alert(message);
        }
    }
    endLoading();
});
//苹果需要应用苹方字体
if (!/windows|win32/i.test(navigator.userAgent)) {
    $('body').addClass('apple')
}

// xp系统不能用思源字体 加上360
var is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
function _mime(option, value) {
    var mimeTypes = navigator.mimeTypes;
    for (var mt in mimeTypes) {
        if (mimeTypes[mt][option] == value) {
            return true;
        }
    }
    return false;
}
if (navigator.userAgent.indexOf("Windows NT 5") > -1 || is360) {
    $('body').addClass('xp');
}
/*
 * 修改全局alert
*/
window.alert = window.top.alert = function (content, title) {
    if (window.top.$('#MsgBoxBack').find('.MessageBoxButtonSection button:visible').length > 0) return;
    window.top.$.SmartMessageBox({
        title: title || "温馨提示",
        content: content,
        buttons: '[确定]'
    });
}

//清掉保存在缓存中的学员数据
localStorage['editContractMulti_StuInfo'] = '';

// 表单校验
(function () {
    $('#userVerifyCodeRow').hide();
    //非chrome,Safari浏览器禁止登陆
    // if (!/Chrome|CriOS|Safari|AppleWebKit/g.test(navigator.userAgent)) {
    //     var form = document.getElementById('section-form');
    //     $(form).html($('#ieTips').removeClass('hidden'));
    //     $('#gooleContent').show();
    //     $('.login-panel').css({ height: 481 });
    //     return;
    // }
    $("button").click(function () {
        $("p").slideToggle();
    });
    $.fn.description = function (msg) {
        var _this = this;
        $(_this).data('jquery-plugin-description', msg);
        $(_this).mouseover(function () {
            var offset = $(this).offset();
            var $description = $('<div class="jquery-plugin-description">' + $(this).data('jquery-plugin-description') + '</div>');
            $(this).after($description);
            var tmpTop = offset.top - $description.height(),
                tmpLeft = offset.left - $description.width() / 2 + $(this).width() / 2;
            if ($(_this).parents('.zx-login-panel').length > 0) {
                var panel = $(_this).parents('.zx-login-panel'),
                    tmpOffset = panel.offset();
                tmpTop = offset.top - tmpOffset.top - $description.height() + 7;
                tmpLeft = offset.left - tmpOffset.left - $description.width() / 2 + 10;
            }
            $description.css({
                top: tmpTop,
                left: tmpLeft
            })
        }).mouseleave(function () {
            $('.jquery-plugin-description').remove();
        });
    }

    $("#login-form").validate({
        rules: {
            'username': {
                required: true
            },
            'password': {
                required: true,
                minlength: 3,
                maxlength: 20
            }
        },
        // 中文提示
        messages: {
            'username': {
                required: secondDomainFlag ? '请输入您的手机号码或账号' : '请输入您的手机号码'
            },
            'password': {
                required: '请输入您的密码',
                minlength: '密码最少3位',
                maxlength: '密码最多20位'
            }
        },
        errorPlacement: errorPlacement,
        unhighlight: function (element, errorClass, validClass) {
            $(element).nextAll('.error').remove();
        }
    });

    // 错误提示换成中文
    var $errorMessage = $("#errorMessage");
    var errorMessage = $errorMessage.attr('data-message') || '';
    if (errorMessage && errorMessage !== 'null') {
        if (errorMessage.length < 18) {
            $errorMessage.text("登录失败：" + errorMessage);
        } else {
            alert(errorMessage);
        }
    }

    // 这里有一个很奇怪的渲染问题，会导致表单位置错误，暂时先间隔0.1秒再弹出提示
    if ($errorMessage.text()) {
        if ($errorMessage.text() == "登录失败：系统存在相同的手机+密码组合，请修改成另一个密码") {
            setTimeout(function () {
                errorPlacement($errorMessage, $('#j_username_face'), "error-msg2");
            }, 100);
        } else {
            setTimeout(function () {
                errorPlacement($errorMessage, $('#j_username_face'));
            }, 100);
        }
    }

    // $('.field-icon').eq(0).description('用户名');
    // $('.field-icon').eq(1).description('密码');

    // 机构登陆hack
    (function () {
        var logoUrl = "<%=logoUrl%>";
        var oldUserName = $("#j_username").val();
        if (oldUserName) {
            var oldUserNameAr = oldUserName.split("#");
            $("#j_username_face").val(oldUserNameAr[0]);
        }
    })();

    //login.jsp参数判断
    (function () {
        var urlParams = $("#requestParamsStrReturn").val();
        if (!!urlParams) {
            if (urlParams.indexOf("reg=1") >= 0) {  //手机快速注册
                var arrayList = urlParams.split(",");
                for (var i = 0; i < arrayList.length; i++) {
                    var param = arrayList[i];
                    if (param.indexOf("mobile") >= 0) {
                        var phoneParam = param.split("=");
                        if (!!phoneParam[1] && phoneParam[1] != "null") {
                            $("#phone").val(phoneParam[1]);
                            getVerifyCode1();
                        }
                    }
                    if (param.indexOf("institutionName") >= 0) {
                        var nameParam = param.split("=");
                        if (!!nameParam[1] && nameParam[1] != "null") {
                            $("#name").val(nameParam[1]);
                        }
                    }
                    if (param.indexOf("contactPerson") >= 0) {
                        var contactPersonParam = param.split("=");
                        if (!!contactPersonParam[1] && phoneParam[1] != "null") {
                            $("#contactPerson").val(contactPersonParam[1]);
                        }

                    }
                }
            } else if (urlParams.indexOf("loginKey") >= 0) {  //手机注册后快速登陆
                $("body").hide();
                var keyValue = urlParams.split("=");
                var params = Base64.decode(keyValue[1]);  //account=13668936695&password=123456
                var account = params.split("&")[0];
                account = account.split("=")[1];
                var password = params.split("&")[1];
                password = password.split("=")[1];
                $("#j_username_face").val(account);
                $("#j_password").val(password);
                $(function () {
                    $("#login-form").submit();
                })
            }

        }
    })();

    /**
     * 重要用户验证码登陆
     */
    $('#login-form').submit(function () {
        $("#j_password").attr({ readonly: 'readonly' });  //点登陆后禁止浏览器自动填充密码,onfocus时移除readonly属性（若不加readonly属性，登陆失败时浏览器会自动重新填充密码，cookie中有多个账密时可能会填充其他账密）
        var username = $('#j_username_face').val();
        var password = $('#j_password').val();
        var institutionId = $('#institutionId').val();
        var userVerifyCode = getVerifyCode();
        var allowSubmit = true;

        if (!username || !password) return;
        $.ajax({
            url: baseHref + 'web/UserLoginWebController/isNeedLoginVerifyCode.do',
            type: 'post',
            async: false,
            data: {
                username: username,
                password: password,
                institutionId: institutionId
            },
            success: function (res) {
                if (res.resultCode === 0) {
                    if (!res.data.needVerifyCode) { // 不需要验证码
                        $('#verify-code').hide();
                    } else { // 需要验证码
                        if ($('#verify-code').is(':hidden')) {
                            // 显示验证码输入框
                            $('#verify-code').show();
                            $("#section-form").hide();
                            allowSubmit = false;
                            $('#verifyBtn').click();
                        } else {
                            // 校验验证码
                            if (userVerifyCode.length === 0) {
                                alert('您是该机构的重要用户，请输入验证码之后再尝试登录');
                                allowSubmit = false;
                                return;
                            }
                            if (checkUserVerifyCode()) {
                                allowSubmit = true;
                            } else {
                                alert('验证码错误');
                                allowSubmit = false;
                                return;
                            }
                        }
                    }
                } else {
                    allowSubmit = false;
                    if (res.resultMessage.length) {
                        alert(res.resultMessage);
                    }
                }
            },
            error: function (res) {
                $errorMessage.text(res.responseJSON.resultMessage);
                errorPlacement($errorMessage, $('#j_username_face'));
                allowSubmit = false;
            }
        });
        return allowSubmit;
    });

    /**
     * 发送登陆验证码
     */
    $('#verifyBtn').click(function () {
        var _this = $(this);
        // 不允许重复发送
        if (_this.attr('disabled') === 'disabled') {
            return;
        }
        // 60秒倒计时
        _this.attr("disabled", true);
        var time = 60;  //60秒
        var interval = setInterval(function () {
            time = time - 1;
            if (time == 0) {
                _this.val("获取验证码");
                _this.attr("disabled", false);
                clearInterval(interval);
            } else {
                _this.val("重新获取(" + time + ")");
            }
        }, 1000);
        // 发送验证码
        $.ajax({
            url: baseHref + 'web/UserLoginWebController/sendUserVerifyCode.do',
            type: 'post',
            async: false,
            data: {
                username: $('#j_username_face').val(),
                password: $('#j_password').val(),
                institutionId: $('#institutionId').val()
            },
            success: function (res) {
                // alert('验证码发送成功');
                if (res.resultCode == 0) {
                    var account = $('#j_username_face').val();
                    var lastNum = account.substring(account.length - 3);
                    $("#sendVerifyCodeTip").text('系统已发送验证码到手机（' + account.slice(0, 3) + '***' + lastNum + '）');
                } else if (res.resultCode == 1) {
                    $('#verify-code').hide();
                    $("#login-fail").show();
                } else {
                    res.resultMessage.length && alert(res.resultMessage);
                }

            },
            error: function (res) {
                alert(res.responseJSON.resultMessage);
            }
        });
    });
})();

/**
 * 获取4位验证码
 */
function getVerifyCode() {
    var inputs = $("#verifyCodeInput input");
    var userVerifyCode = '';
    for (var i = 0; i < inputs.length; i++) {
        var code = $(inputs[i]).val();
        userVerifyCode = userVerifyCode + code;
    }
    return userVerifyCode;
}

/**
 * 校验登陆验证码
 * @returns {boolean}
 */
function checkUserVerifyCode() {
    var username = $('#j_username_face').val();
    var password = $('#j_password').val();
    var institutionId = $('#institutionId').val();

    var userVerifyCode = getVerifyCode();//$('#userVerifyCode').val();
    var isValid = false;
    $.ajax({
        url: baseHref + 'web/UserLoginWebController/checkUserVerifyCode.do',
        type: 'post',
        async: false,
        data: {
            username: username,
            password: password,
            institutionId: institutionId,
            verifyCode: userVerifyCode
        },
        success: function (res) {
            if (res.resultCode === 0) {
                if (res.data.pass) {
                    isValid = true;
                }
            }
        }
    });
    return isValid;
}

function beginLoading(txt) {
    var option = { opacity: 0.5, fontColor: "#fff", content: '<li style="padding:10px;background-color:#000;"><i class="fa fa-gear fa-lg fa-spin"></i>' + (txt ? txt : ' 加载中...') + '</li>' };
    var div = $('<div class="eduboos-loadmask" style="width: 100%;height: 100%;z-index: 10000;background-color: ' + option.backgroundColor + '; opacity: ' + (option.opacity ? option.opacity : 0) + ';position: fixed;left: 0;top: 0;"><div style="position: fixed;left: 50%;top: 50%;list-style: none; color: ' + option.fontColor + ';">' + (option.content ? option.content : '') + '</div></div>');
    div.appendTo('body');
};

function endLoading() {
    $('.eduboos-loadmask:eq(0)').remove();
}


/**
 * 把带 = 的字符串转对象
 * 比如 a=1&b=2 转为 { a:1, b:2 }
 * 例子应用可见下方 Util.getUrlParameters();
 */
function stringToObject(str, divide) {
    if (!str || typeof str !== 'string') return {};
    divide = divide || '&';
    var arr = str.split(divide);
    return arr.reduce(function (re, item) {
        if (!item) return re;
        var mark = item.indexOf('=');
        mark = mark < 0 ? item.length : mark;
        var key = item.slice(0, mark), value = item.slice(mark + 1);
        if (!key) return re;
        if (['null', 'undefined', ''].some(function (x) { return x === value })) value = undefined;
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        re[key] = value;
        return re;
    }, {});
}

/**
 * 获取本页链接中的数据
 */
function getUrlParameters(name) {
    var params = stringToObject(location.href.split('?')[1], /[#?&]/);
    return name ? params[name] : params;
}

/**
 * to showConfirm
 * @param title
 * @param content  
 * @param callback_CANCEL ： 点击取消的回调函数
 * @param callback_OK ： 点击确认的回调函数
 */
function showConfirm(title, content, callback_CANCEL, callback_OK) {
    var confirm_modal = '<div id="alert-confirm" class="alert-confirm"><div class="confirm-shade"></div><section class="confirm-table"><header class="confirm-head">'
        + (title ? title : '请选择') + '</header><div class="confirm-content">'
        + content + '</div><footer class="confirm-foot"><button id="confirm-cancel" class="btn btn-default">取消</button><button id="confirm-yes" class="btn btn-primary">确定</button></footer></section></div>';
    $('body').append(confirm_modal);

    $('#confirm-cancel').click(function () {
        $('#alert-confirm').detach();
        if (callback_CANCEL && typeof callback_CANCEL == "function")
            callback_CANCEL(false);
    });
    $('#confirm-yes').click(function () {
        $('#alert-confirm').detach();
        if (callback_OK && typeof callback_OK == "function")
            callback_OK(true);
    });
};

function dataInstead(institutionId) {
    $("#j_username").val($("#j_username_face").val());
    if (institutionId) {
        $("#j_username").val($("#j_username").val() + "#" + institutionId);
    }
}

function errorPlacement(error, element, errorClass) {
    var offset = $(element).position();
    var left = offset.left;
    if (!errorClass) {
        errorClass = "error-msg";
        left = offset.left;
    }
    $(element).nextAll('.error').remove();
    var $description = $('<label class="error ' + errorClass + '" for="' + element.attr('name') + '" style="display: inline;">' + error.text() + '</label>');
    element.after($description);
    var tmpTop = offset.top - $description.height(),//登录页错误提示遮住了输入区域
        tmpLeft = left;
    if ($(element).parents('.zx-login-panel').length > 0) {
        var panel = $(element).parents('.zx-login-panel'),
            tmpOffset = panel.offset();
        tmpTop = offset.top - tmpOffset.top - $description.height() + 7;
        tmpLeft = offset.left - tmpOffset.left + $(element).width() / 2;
    }
    $description.css({
        top: tmpTop,
        left: tmpLeft
    })
}

//验证码确定
function goOpenInstitution() {


}
//获取验证码
function getVerifyCode1() {
    var flag = true;
    flag = inputCheck($("#phone"), "手机号码不可为空！");
    if (!!flag) {

        $.get(serviceApi.getVerifyCode, {
            phoneNumber: $("#phone").val()
        }, function (data) {

            if (data.resultCode == "1") {
                alert(data.resultMessage);
                return;
            }
            $("#getVerifyCode").attr("disabled", true);
            var time = 60;  //60秒
            var interval = setInterval(function () {
                time = time - 1;
                if (time == 0) {
                    $("#getVerifyCode").val("获取验证码");
                    $("#getVerifyCode").attr("disabled", false);
                    clearInterval(interval);
                } else {
                    $("#getVerifyCode").val("重新获取(" + time + ")");
                }
            }, 1000);
            global_verifyCode_interval = interval;
        });
    }
}

function inputCheck($el, tips) {
    var retFlag = true;
    if (!$el.val() || $el.val() == null) {
        retFlag = false;
        $el.attr('placeholder', tips).addClass('error');
        if ($el.val() == null) {
            $(".multiselectDiv button.multiselect").addClass('error');
        }
        setTimeout(function () {
            $el.removeClass('error');
            $el.attr('placeholder', $el.attr('data-placeholder'));
            if ($el.val() == null) {
                $(".multiselectDiv button.multiselect").removeClass('error');
            }
        }, 1000);
    } else if ($el.prop('type') == 'number' && !(/^[0-9]*$/.test($el.val()))) {
        retFlag = false;
        $el.attr('placeholder', '请填写正确数字').addClass('error');
        setTimeout(function () {
            $el.removeClass('error');
            $el.attr('placeholder', $el.attr('data-placeholder'));
        }, 1000);
    }
    return retFlag;
}


$('#password-form').on('change input', '#phonePass', function () {
    var getVerifyCodePass = $('#getVerifyCodePass');
    if (this.value && this.value.length == 11) {
        getVerifyCodePass.removeClass('disabled');
    } else {
        getVerifyCodePass.addClass('disabled');
    }
})


//选城市
$("#provinceAndCity").click(function (e) {
    SelCity(this, e);
})


//切换显示
function changeDisplay(type) {
    $(".panelTitle").show(0);

    if (type == "institution-form") {
        // $("#verify-form").hide();
        $("#institution-form").show();
        $("#login-form").hide();
        $("#jiaoxueyiIcon").show();
    } else if (type == "login-form") {
        // $("#verify-form").hide();
        $("#institution-form").hide();
        $("#login-form").show();
        $("#jiaoxueyiIcon").hide();
        $('#thirdDiv').hide(0);
        //input clean
        // $("#verify-form").find("input.inputPseudo").each(function(){
        //     $(this).val("");
        // });
        $("#institution-form").find("input[type='text']").each(function () {
            $(this).val("");
        });

        //清理定时器
        $("#getVerifyCode").val("获取验证码");
        clearInterval(global_verifyCode_interval);
    }
    $("#secondDiv").hide();
}
//修改密码时的切换显示
$("#forgetPassword").bind('click', function () {
    $("#login-form").hide();
    $("#password-form").show();
});

//忘记密码-返回登录页
$('#returnToLogin').click(function () {
    $("#password-form").hide();
    $("#login-form").show();
})

//登录失败-返回登录页
$("#backToLoginForFail").click(function () {
    $("#login-fail").hide();
    $("#section-form").show();
})

//点击获取验证码按钮而获取验证码
function resetPaeeword() {
    if ($("#phonePass").hasClass('error')) return;
    var flag = true;
    flag = inputCheck($("#phonePass"), "请填写电话号码！");
    if (!!flag) {
        checkPhoneInUse();
    }
}
//校验手机是否存在于系统中并可用并发送验证码
function checkPhoneInUse() {
    $.get(serviceApi.checkPhoneInUse, {
        phoneNumber: $("#phonePass").val()
    }, function (data) {
        if (data.resultCode != "0") {

            alert("此号码系统内无记录");
            return;
        }
        $.get(serviceApi.sendSimpleVarifyCode, {
            phoneNumber: $("#phonePass").val(),
            institutionId: $("#institutionId").val()
        }, function (data) {

            if (data.resultCode != "0") {
                alert("验证码发送失败，请重新获取");
                return;
            }
            $("#getVerifyCodePass").prop("disabled", true);
            var time = 60;  //60秒
            var interval = setInterval(function () {
                time = time - 1;
                if (time == 0) {
                    // $("#getVerifyCodePass").css("background-color", "#6ed4dc");
                    $("#getVerifyCodePass").val("获取验证码");
                    $("#getVerifyCodePass").attr("disabled", false);
                    clearInterval(interval);
                } else {
                    // $("#getVerifyCodePass").css("background-color","#BBBBBB");
                    $("#getVerifyCodePass").val("重新获取(" + time + ")");
                }
            }, 1000);
            global_verifyCode_password = interval;
        });
    });
}
//点击重置密码时验证码的验证
function getNewPassword() {
    //清除定时器
    var flag = true;
    flag = inputCheck($("#phonePass"), "请填写电话号码！");
    flag = inputCheck($("#verifyCodePass"), "验证码不能为空！");
    if (!!flag) {

        checkPhoneVarifyCode();
    }
}
//验证码验证
function checkPhoneVarifyCode() {
    $.get(serviceApi.checkPhoneVarifyCode, {
        phoneNumber: $("#phonePass").val(),
        verifyCode: $("#verifyCodePass").val()
    }, function (data) {
        if (data.resultCode === 0) {
            $.get(serviceApi.getUserSimpleInfoByContact, {
                phoneNumber: $("#phonePass").val()
            }, function (data) {
                if (data.length == 1) {
                    resetPassword(data[0].userId);
                }
                if (data.length > 1) {
                    var result = "";
                    $(data).each(function (i, item) {
                        result += '<li data-userId="' + item.userId + '"><div><p>' + item.institutionName + '</p><p>' + item.account + '</p></div><span><i class="fa fa-check"></i></span></li>';
                    });
                    $("#userList").show();
                    $("#userList>ul").html(result);
                    $("#userList>ul>li:first").addClass("current");
                }
            });
        }
    });
}
//重置密码并发送短信接口
function resetPassword(id) {
    $.post(serviceApi.resetPassword, {
        userId: id
    }, function (data) {
        if (data.resultCode == 0) {
            $("#checktrue").show();
            setTimeout(function () {
                location.reload();
            }, 2500)
        }
    });
}

//保存到桌面
function saveToDesktop() {
    var browser = navigator.userAgent.toLowerCase();

    if (window.external && browser.indexOf('chrome') != -1) {
        alert('第一步，点击浏览器右上角的[自定义及控制]，点击[更多工具]-[添加到桌面]；<br>'
            + '第二步，在添加到桌面的弹窗中，点击[添加]即可。', '保存到桌面');
    }
}

function getTenantPublicInfo() {
    var params = {
        institutionId: $("#institutionId").val()
    };

    $.get(serviceApi.tenantPublicInfo, params, function (res) {
        if (res.config) {
            var data = res.config;
            if (data && data.systemIcon) {
                window.document.querySelector('head link[rel="icon"]').href = data.systemIcon;
                window.document.querySelector('head link[rel="shortcut icon"]').href = data.systemIcon;
            }
        }
    })
}

getTenantPublicInfo();

//加入收藏夹
function addFavorite() {
    var browser = navigator.userAgent.toLowerCase();

    if (window.external && browser.indexOf('chrome') != -1) {
        alert('同时按下Ctrl(键盘左下方)+D，把Boss校长添加到浏览器收藏夹。', '添加收藏夹');
    }
}
$(document).on('click', '#userList>ul>li', function () {
    $(this).addClass("current").siblings().removeClass("current");
}).on('click', '#comfirm', function () {
    var UserId = $("#userList>ul>li.current").attr('data-userId');
    $("#userList").hide();
    resetPassword(UserId);
})


// 第三方登录 -- start --- #18627
// 获取是否有权限
function getThirdPathJurisdiction() {
    var params = { institutionId: $("#institutionId").val() };
    var show = false;
    $.get(serviceApi.external, params, function (res) {
        if (res.resultCode === 0) {
            var data = res.data;
            if (data == true) {
                show = true;
                if (show) {
                    // 有权限，调整视图
                    $('#thirdPartyLoginSection').css({ display: 'flex' });
                    $('.mainBg .ratio').css({ 'min-height': '580px' });
                }
            }
        }
    });
    if (microschoolService && microschoolService.getMicroschoolBindingInfo) {
        microschoolService.getMicroschoolBindingInfo({ institutionId: $("#institutionId").val() }, {
            noloading: true,
            success: function (res) {
                if (res.resultCode === 0) {
                    var data = res.data;
                    if (data) {
                        if (data.enableScanLogin) {
                            show = true;
                        }
                    }
                    if (show) {
                        // 有权限，调整视图
                        $('#thirdPartyLoginSection').css({ display: 'flex' });
                        $('.mainBg .ratio').css({ 'min-height': '580px' });
                    }
                }
            },
        });
    }
}

// 第三方登录 --  企微
$('#enterPriseWechatItem').on('click', function () {
    window.location.replace(serviceApi.path);
})

getThirdPathJurisdiction();

// 第三方登录错误信息回调回显

var thirdCbState,
    errorMessageString;

// 从hash获取第三方回调的状态码
function getHashThirdState() {
    var hashArray = location.hash.split('/');
    if (hashArray.length > 1) {
        thirdCbState = hashArray[1];
    }
}

getHashThirdState();

// 通过状态码获取需要提示的中文
if (thirdCbState) {
    $.get(serviceApi.loginCallBackCodes, null, function (res) {
        if (res.resultCode == 0) {
            var errorData = res.data;
            if (errorData.hasOwnProperty(thirdCbState)) {
                errorMessageString = errorData[thirdCbState];

                if (thirdCbState && errorMessageString) {
                    alert(errorMessageString);
                    // 更新hash，不会刷新页面
                    location.hash = /#jincai/.test(location.href) ? '#jincai' : '';
                }
            }
        }
    })
}

// 第三方登录 -- end ---

// 针对金材教育的登录页定制 #11041
var $body = $(window.top.document);
if (location.host === 'erp.kmjcedu.com' || /#jincai/.test(location.href)) {
    // 有部分元素是后来渲染的，所以还有段代码在 login.css 的 .isJinCai 之后
    window.top.document.title = '金材教育 - 登录';
    $body.find('html').addClass('isJinCai');
    $body.find('.mainBg').css('height', '550px');
    $body.find('.mainBg').css('background-size', 'cover');
    $body.find('.mainBg').css('background-image', 'url(/eduboss/images/jincai-login-page/05.png)');
    $body.find('.logo img').attr('src', '/eduboss/images/jincai-login-page/02.png');
    $body.find('.loginLogo').attr('src', '/eduboss/images/jincai-login-page/03.png');
    $body.find('.login-panel > :not(.top)').css('filter', 'hue-rotate(175deg)');
    $body.find('.footer, .noBgButton, .btnGroup').css('display', 'none');
    $body.find('body').css('background', 'url("/eduboss/images/jincai-login-page/04.png") 50% 100% / 90% auto repeat-x, linear-gradient(rgba(0,0,0,0) 40%, #F3EFE6 10%), url("/eduboss/images/jincai-login-page/01.jpg") center top / 100% repeat-y');
    if (window.top.innerWidth < 1300) {
        $body.find('body').css('background', 'url("/eduboss/images/jincai-login-page/04.png") 50% 110% / 1000px auto repeat-x, linear-gradient(rgba(0,0,0,0) 40%, #F3EFE6 10%), url("/eduboss/images/jincai-login-page/01.jpg") center top / 100% repeat-y');
    }
    $body.find('#forgetPassword').remove();
    $body.find('.login-panel .top').css('margin', '-6em auto 8em');
    $body.find('.panelTitle').text('教师登录');
    $body.find('#safeTips').remove();
    var $head = $(window.top.document.head);
    $head.find('[rel*="icon"]').attr('href', '/eduboss/images/jincai-login-page/jincai.ico');
}
$body.find('body').removeClass('hide');

// #20936：www登录页面的免费体验按钮干掉，源代码：['boss', 'www']
if (['boss'].every(function (bottomDomain) { // 底级域名是自建机构需要隐藏【免费体验】
    return bottomDomain !== window.location.host.split('.')[0]
})) {
    $('.noBgButton').hide();
    $('.loginLine').closest('span').remove();
}