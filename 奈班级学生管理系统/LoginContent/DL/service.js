var ApiHelper = window.ApiHelper;
var microschoolService = {
    //获取boss绑定的企微信息
    getMicroschoolBindingInfo: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}`, options);
    },
    // 企微机构绑定第三方机构
    bindMicroschool: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}`, options);
    },
    //    更新boss绑定企微机构contractSecret
    updateMicroschoolContractSecret: function (params, options) {
        return ApiHelper.apiGen(`PUT /corps/boss/${params.institutionId}`, options);
    },
    //启用扫码登录
    enableScanLogin: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/scanLogin/enable`, options);
    },
    //禁用扫码登录
    disableScanLogin: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/scanLogin/disable`, options);
    },
    //启用通讯录同步
    enableContactBound: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/contactBound/enable`, options);
    },
    //禁用通讯录同步
    disableContactBound: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/contactBound/disable`, options);
    },
    // 同步设置是否有效
    contactSecretIsValid: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}/contactSecret/valid`, options);
    },
    //同步企微信息
    syncFromWxqy: function (params, options) {
        return Util.apiGen(`POST /corps/${params.corpId}/syncFromWxqy`, options);
    },
    // 同步企微信息（基于boss机构id）
    syncFromWxqyByInstitutionId: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/syncFromWxqy`, options);
    },

    //获取boss绑定企微的员工列表
    getBandStaffList: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}/users`, options);
    },
    // 获取boss绑定企微的部门列表
    getDepartmentsList: function (params, options) {
        return Util.apiGen(`GET /corps/boss/${params.institutionId}/departments`, options);
    },
    //绑定员工
    bindStaff: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/bind`, options);
    },
    //解绑员工
    unBindStaff: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/unbind`, options);
    },
    //解绑部门
    unBindDepartment: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/department/${params.departmentId}/unbind`, options);
    },
    //绑定部门
    bindDepartment: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/department/${params.departmentId}/bind`, options);
    },
    // 获取企微的部门列表
    getWechatDepartments: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/departments`, options);
    },
    // 同步企微外部联系人
    syncExternalContact: function (params, options) {
        return ApiHelper.apiGen(`PUT /corps/${params.corpId}/syncExternalContact`, options);
    },
    //查询boss员工在企微的绑定状态
    checkBossSttaffBindWechatStatus: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/batch/bossUserIdToWxqyUser`, options);
    },
    //检测需要绑定的账户
    smartMatch: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/smartMatch`, options);
    },
    //批量绑定
    bathBind: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/bathBind`, options);
    },
    //查询boss组织架构在企微的绑定状态
    checkBossOrganizationBindStatus: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/batch/bossOrganizationIdToWxqyDepartmentId`, options);
    },
    // 保存'同步企微员工与外部联系人会话内容'配置
    saveChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/saveChatRecordConfig`, options);
    },
    // 修改'同步企微员工与外部联系人会话内容'配置
    modifyChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/modifyChatRecordConfig`, options);
    },
    // 生成会话加密秘钥
    chatRecordGenerateKey: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/generateKey`, options);
    },
    //获取会话配置
    getChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/findChatRecordConfig`, options);
    },
    //获取回调事件地址
    getChatMsgNotifyUrl: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/getChatMsgNotifyUrl`, options);
    },
    //获取群会话列表
    getChatGroupList: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/groupList`, options);
    },
    //获取群会话内容
    getChatGroupContent: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/groupChatRecord`, options);
    },
    //获取会话内容资源
    getChatMediaData: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/getMediaData`, options);
    },

    getChatMediaDataUrl: function (params, options) {
        return ApiHelper.urlGen('/chatRecord/getMediaData?', options);
    },
    //账号许可，开通基础账号或互通账号
    activeAccount: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/active/${params.activeCodeType}`, options);
    },
    //获取激活码
    getActiveCode: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/activeCodes/staticsByActiveCodeType`, options);
    },
    //同步激活码到本地（微校务）
    syncLicenseOrder: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/licenseOrder/sync`, options);
    },

    //聊天工具栏配置
    getToolbarConfig: function (params, options) {
        return ApiHelper.apiGen(`GET /toolbarConfig`, options);
    }
}