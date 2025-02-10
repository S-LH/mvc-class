/**
 * 鍏叡 鍏嶈垂浣撻獙鐢宠琛ㄥ崟 浜や簰 js
 */
$(document).ready(function () {

    var $footerForm = $('.footer_free_experience'), // 搴曢儴鍏嶈垂璇曠敤琛ㄥ崟
        $modalForm = $('#freeExperienceModal').find('.freeRightContent'); // 寮圭獥 modal 鍏嶈垂璇曠敤琛ㄥ崟

    // 楠岃瘉鐮� 60s
    var countdown = 60;

    /**
     * @desc: 姝ｅ垯楠岃瘉瑙勫垯椤�
     *  - phone: 鎵嬫満鍙疯鍒欙紝绗竴浣嶏細1锛岀浜屼綅锛�3~9锛岀涓変綅鑷冲崄涓€浣嶆槸鏁板瓧
     *  - numOrHyphen: 绾暟瀛楋紝鍙兘甯︽湁 '-'
     *  - onlyNum: 绾暟瀛�
     *  - telPhone: 鐢佃瘽鍙风爜锛屽尯鍙凤細0 寮€澶寸殑 3 鎴� 4 浣嶇殑鏁板瓧锛屽彿鐮侊細7 鎴� 8 浣嶇殑鏁板瓧锛岃繛鎺ョ锛�-
     *  - phoneAndHyphen: phone 鍜� telPhone 鍚屾椂鏀寔
     */
    const regularRules = {
        phone: /^1[3-9]\d{9}$/,
        numOrHyphen: /^\d+(-\d+)?$/,
        onlyNum: /^\d+$/,
        telPhone: /^(0\d{2,3}-)?\d{7,8}$/,
        phoneAndHyphen: /^(?:(0\d{2,3}-)?\d{7,8}|1[3-9]\d{9})$/,
    }

    // 鑷畾涔夋牎楠屾彁绀�
    $.validator.addMethod("phoneRequired", function (value, element) {
        return value;
    }, "鎵嬫満鍙蜂笉鑳戒负绌猴紒");

    $.validator.addMethod("phoneGRC", function (value, element) {
        return regularRules.phoneAndHyphen.test(value);
    }, "璇疯緭鍏ユ瑙勭殑鎵嬫満鍙锋垨搴ф満鍙凤紒");

    $.validator.addMethod("schoolnameRequired", function (value, element) {
        return value;
    }, "鏈烘瀯鍚嶇О涓嶈兘涓虹┖锛�");

    $.validator.addMethod("nameRequired", function (value, element) {
        return value;
    }, "鎮ㄧ殑鍚嶇О涓嶈兘涓虹┖锛�");

    $footerForm.find('#form').validate({
        errorClass: 'error_tips'
    })

    $modalForm.find('#form').validate({
        errorClass: 'error_tips_modal'
    })

    // initData();
    initEvent();

    function initEvent() {

        // 搴曢儴鍏嶈垂璇曠敤鐨勮〃鍗曟彁浜�
        $footerForm.on('click', '#submitBtn', function () {
            var $form = $footerForm.find('#form');
            // 琛ㄥ崟蹇呭～
            if (!$form.valid()) { return }
            var params = {
                act: 1
            }
            $form.find('input').each(function () {
                params[$(this).attr('name')] = $(this).val();
            })
            if ($(this).attr('data-act-flag') == 'add') {
                // 1銆佺敓鎴愬鎴�
                createCustomer(params, function () {
                    var twoParams = {
                        act: 2,
                        phone: $footerForm.find('input[name="phone"]').val()
                    };
                    // 2銆佹煡鏄惁绌哄彿
                    checkPhone(twoParams, function () {
                        var threeParams = {
                            act: 3,
                            phone: $footerForm.find('input[name="phone"]').val()
                        }
                        // 3銆佸彂閫佺煭淇￠獙璇佺爜
                        sendPhoneCode(threeParams, function () {
                            settime($('#formVerCodeModal').find('#getVerCode'));
                            $('#formVerCodeModal').fadeIn();
                        });
                    });
                })
            } else {
                // 杩斿洖淇敼鏉ョ殑淇敼瀹㈡埛
                var modifyParams = {
                    act: 5,
                    phone: $footerForm.find('input[name="phone"]').val(),
                    remarks: '瀹㈡埛淇敼鍙风爜'
                }
                modifyCustomer(modifyParams, function () {
                    // 淇敼鎴愬姛
                    var checkParams = {
                        act: 2,
                        phone: $footerForm.find('input[name="phone"]').val()
                    };
                    // 楠岃瘉鎵嬫満鍙锋槸鍚︾┖鍙�
                    checkPhone(checkParams, function () {
                        // 鍙戦€佺煭淇￠獙璇佺爜
                        var codeParams = {
                            act: 3,
                            phone: $footerForm.find('input[name="phone"]').val()
                        }
                        sendPhoneCode(codeParams, function () {
                            settime($('#formVerCodeModal').find('#getVerCode'));
                            $('#formVerCodeModal').fadeIn();
                        });
                    });
                })
            }
        })

        // modal 鍏抽棴鎵ц
        $('#freeExperienceModal').on('hidden.bs.modal', function (e) {
            var clickFlag = $('#freeExperienceModal').attr('data-from-click');
            if (clickFlag && $('#freeExperienceModal').is(':visible')) {
                var src_obj = {
                    'pc-client': 'https://pingtai-prd.oss-cn-shenzhen.aliyuncs.com/static/EdubossCloudClient.exe',
                    'dev-net': 'https://xuebangsoft-eduboss.oss-cn-shenzhen.aliyuncs.com/Eduboss_.NET4.exe',
                    'drive-print': 'https://xuebangsoft-eduboss.oss-cn-shenzhen.aliyuncs.com/EdubossPrinterDriver.exe',
                    'drive-win7': 'https://xuebangsoft-eduboss.oss-cn-shenzhen.aliyuncs.com/EdubossPrinterDriver.exe',
                    'drive-win10': 'https://xuebangsoft-eduboss.oss-cn-shenzhen.aliyuncs.com/FingerprintDriver-win10.exe',
                    'drive-skq': 'https://xuebangsoft-eduboss.oss-cn-shenzhen.aliyuncs.com/CardDriver.zip',
                };
                $('.index_footer').find('p[data-click-flag="' + clickFlag + '"]').find('a').attr('href', src_obj[clickFlag]);
                $('.index_footer').find('p[data-click-flag="' + clickFlag + '"]').find('a').trigger('click');
            }
        })

        // 寮圭獥 Modal 鐨勮〃鍗曟彁浜�
        $modalForm.on('click', '#submitModalBtn', function () {
            var $form = $modalForm.find('#form');
            // 琛ㄥ崟蹇呭～
            if (!$form.valid()) { return }
            var params = {
                act: 1
            }
            $form.find('input').each(function () {
                params[$(this).attr('name')] = $(this).val();
            })
            if ($(this).attr('data-act-flag') == 'add') {
                // 1銆佺敓鎴愬鎴�
                createCustomer(params, function () {
                    var twoParams = {
                        act: 2,
                        phone: $modalForm.find('input[name="phone"]').val()
                    };
                    // 2銆佹煡鏄惁绌哄彿
                    checkPhone(twoParams, function () {
                        var threeParams = {
                            act: 3,
                            phone: $modalForm.find('input[name="phone"]').val()
                        }
                        // 3銆佸彂閫佺煭淇￠獙璇佺爜
                        sendPhoneCode(threeParams, function () {
                            settime($('#formVerCodeModal').find('#getVerCode'));
                            $('#formVerCodeModal').fadeIn();
                        });
                    });
                })
            } else {
                // 杩斿洖淇敼鏉ョ殑淇敼瀹㈡埛
                var modifyParams = {
                    act: 5,
                    phone: $modalForm.find('input[name="phone"]').val(),
                    remarks: '瀹㈡埛淇敼鍙风爜'
                }
                modifyCustomer(modifyParams, function () {
                    // 淇敼鎴愬姛
                    var checkParams = {
                        act: 2,
                        phone: $modalForm.find('input[name="phone"]').val()
                    };
                    // 楠岃瘉鎵嬫満鍙锋槸鍚︾┖鍙�
                    checkPhone(checkParams, function () {
                        // 鍙戦€佺煭淇￠獙璇佺爜
                        var codeParams = {
                            act: 3,
                            phone: $modalForm.find('input[name="phone"]').val()
                        }
                        sendPhoneCode(codeParams, function () {
                            settime($('#formVerCodeModal').find('#getVerCode'));
                            $('#formVerCodeModal').fadeIn();
                        });
                    });
                })
            }
        })

        // 鎻愮ず modal锛堟棤楠岃瘉鐮侊級 鐩稿叧浜嬩欢鐩戝惉
        $('#formTipsModal').on('click', '#btnDefine', function (e) {
            var pagePhoneVal = $footerForm.find('input[name="phone"]').val();
            var modalPhoneVal = $modalForm.find('input[name="phone"]').val();
            // 纭鏃犺
            var params = {
                act: 5,
                phone: $('#freeExperienceModal').is(':visible') ? modalPhoneVal : pagePhoneVal,
                remarks: '瀹㈡埛鐐瑰嚮纭鏃犺'
            }
            modifyCustomer(params, function () {
                $('#formTipsModal').fadeOut();
                $('#freeExperienceModal').modal('hide');
                $('#commonTipsModal').find('.tips_text').text('鎰熻阿鎮ㄥ瀛﹂偊鐨勪俊浠伙紝绋嶅悗瀛﹂偊鍚涘皬铚滀細鍗忓姪鎮ㄤ綋楠屼簡瑙ｇ郴缁燂紝璇蜂繚鎸佹偍鐨勬墜鏈洪€氱晠銆傝阿璋紒');
                $('#commonTipsModal').fadeIn();
                // 閲嶇疆鎿嶄綔鏍囪瘑
                if ($('#freeExperienceModal').is(':visible')) {
                    $modalForm.find('#submitModalBtn').attr('data-act-flag', 'add');
                } else {
                    $footerForm.find('#submitBtn').attr('data-act-flag', 'add');
                }
                setTimeout(() => {
                    $('#commonTipsModal').fadeOut();
                }, 2000);
            });
        }).on('click', '#btnBackModify', function (e) {
            var pagePhoneVal = $footerForm.find('input[name="phone"]').val();
            var modalPhoneVal = $modalForm.find('input[name="phone"]').val();
            // 杩斿洖淇敼
            $('#formTipsModal').fadeOut();
            if ($('#freeExperienceModal').is(':visible')) {
                $modalForm.find('input[name="phone"]').val('').focus().val(modalPhoneVal);
                // 澧炲姞鏄慨鏀圭殑鎿嶄綔鏍囪瘑
                $modalForm.find('#submitModalBtn').attr('data-act-flag', 'modify');
            } else {
                $footerForm.find('input[name="phone"]').val('').focus().val(pagePhoneVal);
                // 澧炲姞鏄慨鏀圭殑鎿嶄綔鏍囪瘑
                $footerForm.find('#submitBtn').attr('data-act-flag', 'modify');
            }
        })

        // 鎻愮ず modal锛堟湁楠岃瘉鐮侊級 鐩稿叧浜嬩欢鐩戝惉
        $('#formVerCodeModal').on('click', '#verCodeSubmit', function (e) {
            // 鎻愪氦楠岃瘉鐮�
            var params = {
                act: 4,
                smscode: $('#formVerCodeModal').find('input[name="smscode"]').val()
            }
            // 楠岃瘉鐮佸繀濉�
            if (!$('#formVerCodeModal').find('input[name="smscode"]').val()) {
                $('#formVerCodeModal').find('.code_error_tips').text('璇峰～鍐欓獙璇佺爜');
                $('#formVerCodeModal').find('.code_error_tips').show();
                return
            }
            // 妫€楠岀煭淇￠獙璇佺爜
            checkPhoneCode(params, function () {
                var pagePhoneVal = $footerForm.find('input[name="phone"]').val();
                var modalPhoneVal = $modalForm.find('input[name="phone"]').val();
                var sureCustomerParams = {
                    act: 5,
                    phone: $('#freeExperienceModal').is(':visible') ? modalPhoneVal : pagePhoneVal,
                    remarks: '瀹㈡埛鏈€缁堝凡纭璇ュ彿鐮�'
                }
                modifyCustomer(sureCustomerParams, function () {
                    $('#formVerCodeModal').fadeOut();
                    $('#freeExperienceModal').modal('hide');
                    $('#commonTipsModal').find('.tips_text').text('鎰熻阿鎮ㄥ瀛﹂偊鐨勪俊浠伙紝绋嶅悗瀛﹂偊鍚涘皬铚滀細鍗忓姪鎮ㄤ綋楠屼簡瑙ｇ郴缁燂紝璇蜂繚鎸佹偍鐨勬墜鏈洪€氱晠銆傝阿璋紒');
                    $('#commonTipsModal').fadeIn();
                    // 閲嶇疆鎿嶄綔鏍囪瘑
                    if ($('#freeExperienceModal').is(':visible')) {
                        $modalForm.find('#submitModalBtn').attr('data-act-flag', 'add');
                    } else {
                        $footerForm.find('#submitBtn').attr('data-act-flag', 'add');
                    }
                    setTimeout(() => {
                        $('#commonTipsModal').fadeOut();
                    }, 2000)
                })
            })
        }).on('click', '#getVerCode', function (e) {
            var pagePhoneVal = $footerForm.find('input[name="phone"]').val();
            var modalPhoneVal = $modalForm.find('input[name="phone"]').val();
            // 閲嶆柊鑾峰彇楠岃瘉鐮�
            var params = {
                act: 3,
                phone: $('#freeExperienceModal').is(':visible') ? modalPhoneVal : pagePhoneVal,
            }
            sendPhoneCode(params, function () {
                settime($('#formVerCodeModal').find('#getVerCode'));
            });
        }).on('focus', 'input[name="smscode"]', function (e) {
            // 楠岃瘉鐮佹鑱氱劍
            $('#formVerCodeModal').find('.code_error_tips').hide();
        })

        // 閿洏浜嬩欢鐩戝惉
        $(window).keydown(function (e) {
            switch (e.keyCode) {
                // ESC
                case 27:
                    $('#formTipsModal').fadeOut();
                    $('#formVerCodeModal').fadeOut();
                    break;

                default:
                    break;
            }
        });

    }

    /**
     * @desc锛氭娴嬭姹�
     * @param {*} params 
     * @returns Promise Obj
     */
    function sendAjax(params) {
        return new Promise((resolve, reject) => {
            $('#loading').fadeIn();
            $.ajax({
                type: 'POST',
                url: location.origin + '/api/ajax.php',
                data: params,
                dataType: 'json',
                success: function (res) {
                    $('#loading').fadeOut();
                    resolve(res);
                }
            });
        })
    }

    /**
     * @desc锛氱敓鎴愬鎴�
     * @param {*} params 
     * @param {*} callBack 
     */
    function createCustomer(params, callBack) {
        sendAjax(params).then((result) => {
            if (result.type == 1) {
                // 鐢宠鎴愬姛
                callBack && callBack();
            } else if (result.type == 0) {
                // 閲嶅鎻愪氦
                $('#commonTipsModal').find('.tips_text').text('鎮ㄥ凡鎴愬姛鎻愪氦锛岃鍕块噸澶嶆彁浜わ紝鎴戜滑浼氬緢蹇仈绯绘偍锛岃淇濇寔鎮ㄧ殑鎵嬫満閫氱晠銆傝阿璋紒');
                $('#commonTipsModal').fadeIn();
                setTimeout(() => {
                    $('#commonTipsModal').fadeOut();
                }, 2000);
            } else if (result.type == 2) {
                // 鐢宠澶辫触
                // $('#commonTipsModal').find('.tips_text').text('褰撳墠鐢宠閲忚緝澶э紝璇风◢鍚庨噸璇曪紒');
                // $('#commonTipsModal').fadeIn();
                // setTimeout(() => {
                //   $('#commonTipsModal').fadeOut();
                // }, 2000);
            }
        })
    }

    /**
     * @desc锛氭娴嬫墜鏈哄彿鏄惁鏄┖鍙�
     * @param {*} params 
     * @param {*} callBack 
     */
    function checkPhone(params, callBack) {
        sendAjax(params).then((result) => {
            if (result.type == 1) {
                callBack && callBack();
            } else if (result.type == 0) {
                // 绌哄彿
                var addFlagParams = {
                    act: 5,
                    phone: params.phone,
                    remarks: '妫€娴嬬粨鏋滐細绌哄彿'
                }
                modifyCustomer(addFlagParams, function () {
                    $('#formTipsModal').find('#tipsPhone').text(params.phone);
                    $('#formTipsModal').fadeIn();
                });
            }
        })
    }

    /**
     * @desc锛氬彂閫佺煭淇￠獙璇佺爜
     * @param {*} params 
     * @param {*} callBack 
     */
    function sendPhoneCode(params, callBack) {
        sendAjax(params).then((result) => {
            if (result.type == 1) {
                callBack && callBack();
            } else {
                // 涓€澶╁彂閫佽繃澶氾紝鍋囩殑
                $('#commonTipsModal').find('.tips_text').text('鐭俊楠岃瘉鐮佸凡鎴愬姛鍙戦€侊紒');
                $('#commonTipsModal').fadeIn();
                setTimeout(() => {
                    $('#commonTipsModal').fadeOut();
                    callBack && callBack();
                }, 2000);
            }
        })
    }

    /**
     * @desc锛氭楠岀煭淇￠獙璇佺爜
     * @param {*} params 
     * @param {*} callBack 
     */
    function checkPhoneCode(params, callBack) {
        sendAjax(params).then((result) => {
            if (result.type == 1) {
                callBack && callBack();
            } else if (result.type == 0) {
                // 楠岃瘉鐮侀敊璇�
                $('#formVerCodeModal').find('.code_error_tips').text('楠岃瘉鐮佹湁璇�');
                $('#formVerCodeModal').find('.code_error_tips').show();
            } else {
                // 楠岃瘉鐮佽繃鏈�
                $('#formVerCodeModal').find('.code_error_tips').text('楠岃瘉鐮佸凡杩囨湡');
                $('#formVerCodeModal').find('.code_error_tips').show();
            }
        })
    }

    /**
     * @desc锛氫慨鏀瑰鎴�
     * @param {*} params 
     * @param {*} callBack 
     */
    function modifyCustomer(params, callBack) {
        sendAjax(params).then((result) => {
            if (result.type == 1) {
                callBack && callBack();
            } else {
                // $('#commonTipsModal').find('.tips_text').text('鍑洪敊浜嗭紝璇风◢鍚庨噸璇曪紒');
                // $('#commonTipsModal').fadeIn();
                // setTimeout(() => {
                //   $('#commonTipsModal').fadeOut();
                // }, 2000);
            }
        })
    }

    /**
     * @desc锛氶獙璇佺爜鍊掕鏃�
     * @param {*} $this 
     * @returns 
     */
    function settime($this) {
        if (countdown === 0) {
            $this.removeAttr('disabled');
            $this.text("閲嶆柊鑾峰彇");
            $this.css('color', '#4682F7');
            countdown = 60;
            return;
        } else {
            $this.text(countdown + "s鍚庨噸璇�");
            $this.css('color', '#72829B');
            $this.attr('disabled', true);
            countdown--;
        }
        setTimeout(function () {
            settime($this)
        }, 1000);
    }

    /**
     * @desc锛氭娴嬫槸鍚︽敮鎸� C3 鏌愪釜灞炴€�
     * @param {*} propertyName 
     * @returns 
     */
    function browserSupportsCSSProperty(propertyName) {
        var elm = document.createElement('div');
        propertyName = propertyName.toLowerCase();

        if (elm.style[propertyName] != undefined)
            return true;

        var propertyNameCapital = propertyName.charAt(0).toUpperCase() + propertyName.substr(1),
            domPrefixes = 'Webkit Moz ms O'.split(' ');

        for (var i = 0; i < domPrefixes.length; i++) {
            if (elm.style[domPrefixes[i] + propertyNameCapital] != undefined)
                return true;
        }

        return false;
    }
})