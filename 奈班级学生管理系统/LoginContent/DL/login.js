var global_verifyCode_interval = null;  //��֤�붨ʱ��
var global_verifyCode_password = null;//��֤�붨ʱ��������
var baseHref = location.href.split("/eduboss/")[0] + '/eduboss/';
var isHasLoadSecord = false;
var serviceApi = {
    getVerifyCode: baseHref + "CommonAction/sendVerifyCodeV12313123587.do",
    quickSaveInstitutionManage: baseHref + "InstitutionManageController/quickSaveInstitutionManage.do",
    checkPhoneInUse: baseHref + "CommonAction/checkPhoneInUse.do",//У���ֻ��Ƿ������ϵͳ�в�����
    sendSimpleVarifyCode: baseHref + "CommonAction/sendSimpleVarifyCode.do", //������֤��ӿ�
    checkPhoneVarifyCode: baseHref + "CommonAction/checkPhoneVarifyCode.do",//У����֤��ӿ�
    getUserSimpleInfoByContact: baseHref + "CommonAction/getUserSimpleInfoByContact.do",//�����ֻ������ȡѡ��Ҫ���õ��û���Ϣ�б�
    resetPassword: baseHref + "SystemAction/resetPassword.do",//�������벢�ҷ��Ͷ��Žӿ�
    external: baseHref + 'web/WxCorpWebController/scanLogin/external.do',
    tenantPublicInfo: baseHref + 'web/TenantPublicController/info.do',
    path: baseHref + 'web/WxCorpWebController/scanLogin/path.do',
    loginCallBackCodes: baseHref + 'CommonAction/loginCallBackCodes.do',
}
var applyToTryId;
var secondDomainFlag = location.href.indexOf('http://www.xuebangsoft.net') !== 0;//Ϊtrue����� www.xuebangsoft.net,�Ƕ�����������Ի���
$('#j_username_face').attr('placeholder', secondDomainFlag ? '�����������ֻ�������˺�' : '�����������ֻ�����');
$(document).ajaxComplete(function (e, xhr, options, exception) {
    options.noloading || endLoading();
    if (xhr.responseJSON && xhr.responseJSON.resultCode > 0 && xhr.status == 200 && xhr.readyState == 4) {
        var message = xhr.responseJSON.resultMessage ? xhr.responseJSON.resultMessage : "δ֪����";
        alert(xhr.responseJSON.resultMessage);
    }
})
$(document).ajaxSend(function (a, b, c) {
    c.noloading || beginLoading();
});
$(document).ajaxError(function (e, xhr, options, exception) {
    if (xhr.responseText || xhr.responseJSON) { //�п�������abort�ˣ�����û�з���
        if (xhr.responseText.indexOf("j_spring_cas_security_check") > 0) {//������ص��ǵ�¼���棬˵��session�ѹ��ڣ�ֱ�Ӱ�����ҳ����������¼ҳ��
            window.top.location.href = "/eduboss/login.jsp";
        } else {
            var message = xhr.responseJSON ? xhr.responseJSON.resultMessage : "δ֪����";
            alert(message);
        }
    }
    endLoading();
});
//ƻ����ҪӦ��ƻ������
if (!/windows|win32/i.test(navigator.userAgent)) {
    $('body').addClass('apple')
}

// xpϵͳ������˼Դ���� ����360
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
 * �޸�ȫ��alert
*/
window.alert = window.top.alert = function (content, title) {
    if (window.top.$('#MsgBoxBack').find('.MessageBoxButtonSection button:visible').length > 0) return;
    window.top.$.SmartMessageBox({
        title: title || "��ܰ��ʾ",
        content: content,
        buttons: '[ȷ��]'
    });
}

//��������ڻ����е�ѧԱ����
localStorage['editContractMulti_StuInfo'] = '';

// ��У��
(function () {
    $('#userVerifyCodeRow').hide();
    //��chrome,Safari�������ֹ��½
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
        // ������ʾ
        messages: {
            'username': {
                required: secondDomainFlag ? '�����������ֻ�������˺�' : '�����������ֻ�����'
            },
            'password': {
                required: '��������������',
                minlength: '��������3λ',
                maxlength: '�������20λ'
            }
        },
        errorPlacement: errorPlacement,
        unhighlight: function (element, errorClass, validClass) {
            $(element).nextAll('.error').remove();
        }
    });

    // ������ʾ��������
    var $errorMessage = $("#errorMessage");
    var errorMessage = $errorMessage.attr('data-message') || '';
    if (errorMessage && errorMessage !== 'null') {
        if (errorMessage.length < 18) {
            $errorMessage.text("��¼ʧ�ܣ�" + errorMessage);
        } else {
            alert(errorMessage);
        }
    }

    // ������һ������ֵ���Ⱦ���⣬�ᵼ�±�λ�ô�����ʱ�ȼ��0.1���ٵ�����ʾ
    if ($errorMessage.text()) {
        if ($errorMessage.text() == "��¼ʧ�ܣ�ϵͳ������ͬ���ֻ�+������ϣ����޸ĳ���һ������") {
            setTimeout(function () {
                errorPlacement($errorMessage, $('#j_username_face'), "error-msg2");
            }, 100);
        } else {
            setTimeout(function () {
                errorPlacement($errorMessage, $('#j_username_face'));
            }, 100);
        }
    }

    // $('.field-icon').eq(0).description('�û���');
    // $('.field-icon').eq(1).description('����');

    // ������½hack
    (function () {
        var logoUrl = "<%=logoUrl%>";
        var oldUserName = $("#j_username").val();
        if (oldUserName) {
            var oldUserNameAr = oldUserName.split("#");
            $("#j_username_face").val(oldUserNameAr[0]);
        }
    })();

    //login.jsp�����ж�
    (function () {
        var urlParams = $("#requestParamsStrReturn").val();
        if (!!urlParams) {
            if (urlParams.indexOf("reg=1") >= 0) {  //�ֻ�����ע��
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
            } else if (urlParams.indexOf("loginKey") >= 0) {  //�ֻ�ע�����ٵ�½
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
     * ��Ҫ�û���֤���½
     */
    $('#login-form').submit(function () {
        $("#j_password").attr({ readonly: 'readonly' });  //���½���ֹ������Զ��������,onfocusʱ�Ƴ�readonly���ԣ�������readonly���ԣ���½ʧ��ʱ��������Զ�����������룬cookie���ж������ʱ���ܻ�����������ܣ�
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
                    if (!res.data.needVerifyCode) { // ����Ҫ��֤��
                        $('#verify-code').hide();
                    } else { // ��Ҫ��֤��
                        if ($('#verify-code').is(':hidden')) {
                            // ��ʾ��֤�������
                            $('#verify-code').show();
                            $("#section-form").hide();
                            allowSubmit = false;
                            $('#verifyBtn').click();
                        } else {
                            // У����֤��
                            if (userVerifyCode.length === 0) {
                                alert('���Ǹû�������Ҫ�û�����������֤��֮���ٳ��Ե�¼');
                                allowSubmit = false;
                                return;
                            }
                            if (checkUserVerifyCode()) {
                                allowSubmit = true;
                            } else {
                                alert('��֤�����');
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
     * ���͵�½��֤��
     */
    $('#verifyBtn').click(function () {
        var _this = $(this);
        // �������ظ�����
        if (_this.attr('disabled') === 'disabled') {
            return;
        }
        // 60�뵹��ʱ
        _this.attr("disabled", true);
        var time = 60;  //60��
        var interval = setInterval(function () {
            time = time - 1;
            if (time == 0) {
                _this.val("��ȡ��֤��");
                _this.attr("disabled", false);
                clearInterval(interval);
            } else {
                _this.val("���»�ȡ(" + time + ")");
            }
        }, 1000);
        // ������֤��
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
                // alert('��֤�뷢�ͳɹ�');
                if (res.resultCode == 0) {
                    var account = $('#j_username_face').val();
                    var lastNum = account.substring(account.length - 3);
                    $("#sendVerifyCodeTip").text('ϵͳ�ѷ�����֤�뵽�ֻ���' + account.slice(0, 3) + '***' + lastNum + '��');
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
 * ��ȡ4λ��֤��
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
 * У���½��֤��
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
    var option = { opacity: 0.5, fontColor: "#fff", content: '<li style="padding:10px;background-color:#000;"><i class="fa fa-gear fa-lg fa-spin"></i>' + (txt ? txt : ' ������...') + '</li>' };
    var div = $('<div class="eduboos-loadmask" style="width: 100%;height: 100%;z-index: 10000;background-color: ' + option.backgroundColor + '; opacity: ' + (option.opacity ? option.opacity : 0) + ';position: fixed;left: 0;top: 0;"><div style="position: fixed;left: 50%;top: 50%;list-style: none; color: ' + option.fontColor + ';">' + (option.content ? option.content : '') + '</div></div>');
    div.appendTo('body');
};

function endLoading() {
    $('.eduboos-loadmask:eq(0)').remove();
}


/**
 * �Ѵ� = ���ַ���ת����
 * ���� a=1&b=2 תΪ { a:1, b:2 }
 * ����Ӧ�ÿɼ��·� Util.getUrlParameters();
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
 * ��ȡ��ҳ�����е�����
 */
function getUrlParameters(name) {
    var params = stringToObject(location.href.split('?')[1], /[#?&]/);
    return name ? params[name] : params;
}

/**
 * to showConfirm
 * @param title
 * @param content  
 * @param callback_CANCEL �� ���ȡ���Ļص�����
 * @param callback_OK �� ���ȷ�ϵĻص�����
 */
function showConfirm(title, content, callback_CANCEL, callback_OK) {
    var confirm_modal = '<div id="alert-confirm" class="alert-confirm"><div class="confirm-shade"></div><section class="confirm-table"><header class="confirm-head">'
        + (title ? title : '��ѡ��') + '</header><div class="confirm-content">'
        + content + '</div><footer class="confirm-foot"><button id="confirm-cancel" class="btn btn-default">ȡ��</button><button id="confirm-yes" class="btn btn-primary">ȷ��</button></footer></section></div>';
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
    var tmpTop = offset.top - $description.height(),//��¼ҳ������ʾ��ס����������
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

//��֤��ȷ��
function goOpenInstitution() {


}
//��ȡ��֤��
function getVerifyCode1() {
    var flag = true;
    flag = inputCheck($("#phone"), "�ֻ����벻��Ϊ�գ�");
    if (!!flag) {

        $.get(serviceApi.getVerifyCode, {
            phoneNumber: $("#phone").val()
        }, function (data) {

            if (data.resultCode == "1") {
                alert(data.resultMessage);
                return;
            }
            $("#getVerifyCode").attr("disabled", true);
            var time = 60;  //60��
            var interval = setInterval(function () {
                time = time - 1;
                if (time == 0) {
                    $("#getVerifyCode").val("��ȡ��֤��");
                    $("#getVerifyCode").attr("disabled", false);
                    clearInterval(interval);
                } else {
                    $("#getVerifyCode").val("���»�ȡ(" + time + ")");
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
        $el.attr('placeholder', '����д��ȷ����').addClass('error');
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


//ѡ����
$("#provinceAndCity").click(function (e) {
    SelCity(this, e);
})


//�л���ʾ
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

        //����ʱ��
        $("#getVerifyCode").val("��ȡ��֤��");
        clearInterval(global_verifyCode_interval);
    }
    $("#secondDiv").hide();
}
//�޸�����ʱ���л���ʾ
$("#forgetPassword").bind('click', function () {
    $("#login-form").hide();
    $("#password-form").show();
});

//��������-���ص�¼ҳ
$('#returnToLogin').click(function () {
    $("#password-form").hide();
    $("#login-form").show();
})

//��¼ʧ��-���ص�¼ҳ
$("#backToLoginForFail").click(function () {
    $("#login-fail").hide();
    $("#section-form").show();
})

//�����ȡ��֤�밴ť����ȡ��֤��
function resetPaeeword() {
    if ($("#phonePass").hasClass('error')) return;
    var flag = true;
    flag = inputCheck($("#phonePass"), "����д�绰���룡");
    if (!!flag) {
        checkPhoneInUse();
    }
}
//У���ֻ��Ƿ������ϵͳ�в����ò�������֤��
function checkPhoneInUse() {
    $.get(serviceApi.checkPhoneInUse, {
        phoneNumber: $("#phonePass").val()
    }, function (data) {
        if (data.resultCode != "0") {

            alert("�˺���ϵͳ���޼�¼");
            return;
        }
        $.get(serviceApi.sendSimpleVarifyCode, {
            phoneNumber: $("#phonePass").val(),
            institutionId: $("#institutionId").val()
        }, function (data) {

            if (data.resultCode != "0") {
                alert("��֤�뷢��ʧ�ܣ������»�ȡ");
                return;
            }
            $("#getVerifyCodePass").prop("disabled", true);
            var time = 60;  //60��
            var interval = setInterval(function () {
                time = time - 1;
                if (time == 0) {
                    // $("#getVerifyCodePass").css("background-color", "#6ed4dc");
                    $("#getVerifyCodePass").val("��ȡ��֤��");
                    $("#getVerifyCodePass").attr("disabled", false);
                    clearInterval(interval);
                } else {
                    // $("#getVerifyCodePass").css("background-color","#BBBBBB");
                    $("#getVerifyCodePass").val("���»�ȡ(" + time + ")");
                }
            }, 1000);
            global_verifyCode_password = interval;
        });
    });
}
//�����������ʱ��֤�����֤
function getNewPassword() {
    //�����ʱ��
    var flag = true;
    flag = inputCheck($("#phonePass"), "����д�绰���룡");
    flag = inputCheck($("#verifyCodePass"), "��֤�벻��Ϊ�գ�");
    if (!!flag) {

        checkPhoneVarifyCode();
    }
}
//��֤����֤
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
//�������벢���Ͷ��Žӿ�
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

//���浽����
function saveToDesktop() {
    var browser = navigator.userAgent.toLowerCase();

    if (window.external && browser.indexOf('chrome') != -1) {
        alert('��һ���������������Ͻǵ�[�Զ��弰����]�����[���๤��]-[��ӵ�����]��<br>'
            + '�ڶ���������ӵ�����ĵ����У����[���]���ɡ�', '���浽����');
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

//�����ղؼ�
function addFavorite() {
    var browser = navigator.userAgent.toLowerCase();

    if (window.external && browser.indexOf('chrome') != -1) {
        alert('ͬʱ����Ctrl(�������·�)+D����BossУ����ӵ�������ղؼС�', '����ղؼ�');
    }
}
$(document).on('click', '#userList>ul>li', function () {
    $(this).addClass("current").siblings().removeClass("current");
}).on('click', '#comfirm', function () {
    var UserId = $("#userList>ul>li.current").attr('data-userId');
    $("#userList").hide();
    resetPassword(UserId);
})


// ��������¼ -- start --- #18627
// ��ȡ�Ƿ���Ȩ��
function getThirdPathJurisdiction() {
    var params = { institutionId: $("#institutionId").val() };
    var show = false;
    $.get(serviceApi.external, params, function (res) {
        if (res.resultCode === 0) {
            var data = res.data;
            if (data == true) {
                show = true;
                if (show) {
                    // ��Ȩ�ޣ�������ͼ
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
                        // ��Ȩ�ޣ�������ͼ
                        $('#thirdPartyLoginSection').css({ display: 'flex' });
                        $('.mainBg .ratio').css({ 'min-height': '580px' });
                    }
                }
            },
        });
    }
}

// ��������¼ --  ��΢
$('#enterPriseWechatItem').on('click', function () {
    window.location.replace(serviceApi.path);
})

getThirdPathJurisdiction();

// ��������¼������Ϣ�ص�����

var thirdCbState,
    errorMessageString;

// ��hash��ȡ�������ص���״̬��
function getHashThirdState() {
    var hashArray = location.hash.split('/');
    if (hashArray.length > 1) {
        thirdCbState = hashArray[1];
    }
}

getHashThirdState();

// ͨ��״̬���ȡ��Ҫ��ʾ������
if (thirdCbState) {
    $.get(serviceApi.loginCallBackCodes, null, function (res) {
        if (res.resultCode == 0) {
            var errorData = res.data;
            if (errorData.hasOwnProperty(thirdCbState)) {
                errorMessageString = errorData[thirdCbState];

                if (thirdCbState && errorMessageString) {
                    alert(errorMessageString);
                    // ����hash������ˢ��ҳ��
                    location.hash = /#jincai/.test(location.href) ? '#jincai' : '';
                }
            }
        }
    })
}

// ��������¼ -- end ---

// ��Խ�Ľ����ĵ�¼ҳ���� #11041
var $body = $(window.top.document);
if (location.host === 'erp.kmjcedu.com' || /#jincai/.test(location.href)) {
    // �в���Ԫ���Ǻ�����Ⱦ�ģ����Ի��жδ����� login.css �� .isJinCai ֮��
    window.top.document.title = '��Ľ��� - ��¼';
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
    $body.find('.panelTitle').text('��ʦ��¼');
    $body.find('#safeTips').remove();
    var $head = $(window.top.document.head);
    $head.find('[rel*="icon"]').attr('href', '/eduboss/images/jincai-login-page/jincai.ico');
}
$body.find('body').removeClass('hide');

// #20936��www��¼ҳ���������鰴ť�ɵ���Դ���룺['boss', 'www']
if (['boss'].every(function (bottomDomain) { // �׼��������Խ�������Ҫ���ء�������顿
    return bottomDomain !== window.location.host.split('.')[0]
})) {
    $('.noBgButton').hide();
    $('.loginLine').closest('span').remove();
}