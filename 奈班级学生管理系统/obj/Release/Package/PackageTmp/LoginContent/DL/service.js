var ApiHelper = window.ApiHelper;
var microschoolService = {
    //��ȡboss�󶨵���΢��Ϣ
    getMicroschoolBindingInfo: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}`, options);
    },
    // ��΢�����󶨵���������
    bindMicroschool: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}`, options);
    },
    //    ����boss����΢����contractSecret
    updateMicroschoolContractSecret: function (params, options) {
        return ApiHelper.apiGen(`PUT /corps/boss/${params.institutionId}`, options);
    },
    //����ɨ���¼
    enableScanLogin: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/scanLogin/enable`, options);
    },
    //����ɨ���¼
    disableScanLogin: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/scanLogin/disable`, options);
    },
    //����ͨѶ¼ͬ��
    enableContactBound: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/contactBound/enable`, options);
    },
    //����ͨѶ¼ͬ��
    disableContactBound: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/contactBound/disable`, options);
    },
    // ͬ�������Ƿ���Ч
    contactSecretIsValid: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}/contactSecret/valid`, options);
    },
    //ͬ����΢��Ϣ
    syncFromWxqy: function (params, options) {
        return Util.apiGen(`POST /corps/${params.corpId}/syncFromWxqy`, options);
    },
    // ͬ����΢��Ϣ������boss����id��
    syncFromWxqyByInstitutionId: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/syncFromWxqy`, options);
    },

    //��ȡboss����΢��Ա���б�
    getBandStaffList: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/boss/${params.institutionId}/users`, options);
    },
    // ��ȡboss����΢�Ĳ����б�
    getDepartmentsList: function (params, options) {
        return Util.apiGen(`GET /corps/boss/${params.institutionId}/departments`, options);
    },
    //��Ա��
    bindStaff: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/bind`, options);
    },
    //���Ա��
    unBindStaff: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/unbind`, options);
    },
    //�����
    unBindDepartment: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/department/${params.departmentId}/unbind`, options);
    },
    //�󶨲���
    bindDepartment: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/department/${params.departmentId}/bind`, options);
    },
    // ��ȡ��΢�Ĳ����б�
    getWechatDepartments: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/departments`, options);
    },
    // ͬ����΢�ⲿ��ϵ��
    syncExternalContact: function (params, options) {
        return ApiHelper.apiGen(`PUT /corps/${params.corpId}/syncExternalContact`, options);
    },
    //��ѯbossԱ������΢�İ�״̬
    checkBossSttaffBindWechatStatus: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/batch/bossUserIdToWxqyUser`, options);
    },
    //�����Ҫ�󶨵��˻�
    smartMatch: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/smartMatch`, options);
    },
    //������
    bathBind: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/bathBind`, options);
    },
    //��ѯboss��֯�ܹ�����΢�İ�״̬
    checkBossOrganizationBindStatus: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/boss/${params.institutionId}/batch/bossOrganizationIdToWxqyDepartmentId`, options);
    },
    // ����'ͬ����΢Ա�����ⲿ��ϵ�˻Ự����'����
    saveChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/saveChatRecordConfig`, options);
    },
    // �޸�'ͬ����΢Ա�����ⲿ��ϵ�˻Ự����'����
    modifyChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/modifyChatRecordConfig`, options);
    },
    // ���ɻỰ������Կ
    chatRecordGenerateKey: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/generateKey`, options);
    },
    //��ȡ�Ự����
    getChatRecordConfig: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/findChatRecordConfig`, options);
    },
    //��ȡ�ص��¼���ַ
    getChatMsgNotifyUrl: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/getChatMsgNotifyUrl`, options);
    },
    //��ȡȺ�Ự�б�
    getChatGroupList: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/groupList`, options);
    },
    //��ȡȺ�Ự����
    getChatGroupContent: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/groupChatRecord`, options);
    },
    //��ȡ�Ự������Դ
    getChatMediaData: function (params, options) {
        return ApiHelper.apiGen(`GET /chatRecord/getMediaData`, options);
    },

    getChatMediaDataUrl: function (params, options) {
        return ApiHelper.urlGen('/chatRecord/getMediaData?', options);
    },
    //�˺���ɣ���ͨ�����˺Ż�ͨ�˺�
    activeAccount: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/user/${params.openUserId}/active/${params.activeCodeType}`, options);
    },
    //��ȡ������
    getActiveCode: function (params, options) {
        return ApiHelper.apiGen(`GET /corps/${params.corpId}/activeCodes/staticsByActiveCodeType`, options);
    },
    //ͬ�������뵽���أ�΢У��
    syncLicenseOrder: function (params, options) {
        return ApiHelper.apiGen(`POST /corps/${params.corpId}/licenseOrder/sync`, options);
    },

    //���칤��������
    getToolbarConfig: function (params, options) {
        return ApiHelper.apiGen(`GET /toolbarConfig`, options);
    }
}