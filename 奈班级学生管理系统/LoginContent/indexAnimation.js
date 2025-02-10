// 棣栭〉 - 婊氬姩鏉℃粦鍔ㄥ姩鐢�
$(document).ready(function () {

    // 琛屼笟瑙ｅ喅鏂规鍖哄煙
    var $mainPlanArea = $('.main_plan_area');

    // 鍗佸勾娌夋穩鍖哄煙
    var $mainDecadeArea = $('.main_decade_area');

    // 婊氬姩鎵ц涓€娆�
    var isExe = true;

    initData();
    initEvent();

    function initData() {
    }

    function initEvent() {
        // 鐩戝惉婊氬姩鏉℃粴鍔� - 瑙﹀彂瀵瑰簲鍔ㄧ敾
        $(window).on('scroll', function () {
            var scrollHeight = $(this).scrollTop();
            var decadeOTHeight = $mainDecadeArea.offset();
            var screenHeight = window.screen.height;
            if ((scrollHeight + screenHeight) >= decadeOTHeight.top && isExe) {
                numUp({
                    el: $mainDecadeArea.find("#decade_data_1"),
                    max: 568,
                    start: 0
                });
                numUp({
                    el: $mainDecadeArea.find("#decade_data_2"),
                    max: 1230,
                    start: 0
                });
                numUp({
                    el: $mainDecadeArea.find("#decade_data_3"),
                    max: 5000,
                    start: 0
                });
                numUp({
                    el: $mainDecadeArea.find("#decade_data_5"),
                    max: 40,
                    start: 0
                });
                numUp({
                    el: $mainDecadeArea.find("#decade_data_4"),
                    max: 4,
                    start: 0
                });
                isExe = false;
            }
        })

        // 琛屼笟瑙ｅ喅鏂规鍖哄煙鎼厤 js 鏁堟灉
        $mainPlanArea.on('hover', '.plan_radus', function () {
            $(this).addClass('plan_hover_item').siblings().removeClass('plan_hover_item');
            $(this).find('.plan_mask').addClass('plan_hover_mask');
            $(this).siblings().find('.plan_mask').removeClass('plan_hover_mask');
        })
    }

    /**
     * @desc: 鏁板瓧澧為暱
     * @param {*} obj 
     */
    function numUp(obj) {
        var item = obj.el;
        var num = obj.max;
        var start = num - 500;
        if (start < 0) start = 0;
        var delta = 1;
        time2 = setInterval(function () {
            if (start > num) {
                start = num;
                clearInterval(time2);
            }
            item.text(start)
            start = start + delta;
        }, 1);
    }
})