(function () {

	var $indexHeader = $('#index_header_event');

	initEvent();
	initDate();

	function initEvent() {
		$('#indexBanner').on('click', '.indexBannerPic', function () {
			if ($(this).attr('value')) {
				location.href = $(this).attr('value');
			}
		});

		// 寰俊鍜ㄨ宸︿晶鎻愮ず
		$('#floatMenuArea').find('.menu_wechat').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="https://www.xuebangsoft.com/style/images/qrcode_konw_me.png" class="menu_wechat_tips_img"><p class="menu_wechat_tips_text">寰俊鎵爜鍜ㄨ</p></span>',
			html: true,
			container: '.floatMenu',
			trigger: 'hover'
		})

		// 鐢佃瘽鍜ㄨ宸︿晶鎻愮ず
		$('#floatMenuArea').find('.menu_phone').popover({
			animation: true,
			placement: 'left',
			content: '<div class="menu_phone_tips_text"><div class="phone_text_img"><img src="https://www.xuebangsoft.com/style/images/icon_phone_num.svg"></div>400 800 7001</div>',
			html: true,
			container: '.float_menu_list',
			trigger: 'hover'
		})
			.on('hover', function () {
				$('.float_menu_list').find('.popover').css({ "top": "162px", "left": "-133px", "color": "#111111" });
			})

		$('#index-banner-area').find('#banner-wechat-install').popover({
			animation: true,
			placement: 'right',
			content: '<span><img src="' + location.origin + "/style/images/index_banner/banner-wechat-tip-1.png" + '" class="banner_wechat_tips_img"><div class="banner_wechat_tips_text">瀹夎鍒颁紒涓氬井淇�</div></span>',
			html: true,
			container: '#index-banner-area',
			trigger: 'hover'
		})
		$('#index-banner-area').find('#banner-wechat-login').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + location.origin + "/style/images/index_banner/banner-wechat-tip-1.png" + '" class="banner_wechat_tips_img"><div class="banner_wechat_tips_text">浼佷笟寰俊鐧诲綍</div></span>',
			html: true,
			container: '#index-banner-area',
			trigger: 'hover'
		})
		$('#index-banner-area').find('#banner-wechat-register').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + location.origin + "/style/images/index_banner/banner-wechat-tip-1.png" + '" class="banner_wechat_tips_img"><div class="banner_wechat_tips_text">浼佷笟寰俊娉ㄥ唽</div></span>',
			html: true,
			container: '#index-banner-area',
			trigger: 'hover'
		})

		// 棣栭〉 - 澶撮儴 - 浜嬩欢澶勭悊
		// $indexHeader.on('click', '.header_box_nav li', function () {
		// 	var $this = $(this);
		// 	$this.addClass('nav_active').siblings().removeClass('nav_active');
		// })

	}

	function initDate() {
		$.get('/picAction/findPicByType.do', { contentType: 'INDEX_BANNER', v: new Date().getTime() }, function (res) {
			var curData = res.data;
			var str = "";
			$(curData).each(function (i, item) {
				str += "<li><img class='indexBannerPic' src='" + item.aliName + "' value='" + (item.title ? item.title : "") + "' alt='" + (item.alt ? item.alt : "") + "'/></li>";
			});
			$('#indexBanner').html(str);
			jQuery(".banner").slide({ titCell: ".hd ul", mainCell: ".bd ul", effect: "fold", autoPlay: true, autoPage: true, trigger: "click" });
			$(window).resize();
		});

		$.get('/contentCharAction/getListByType.do', { contentType: 'INSTITUTION_URL', v: new Date().getTime() }, function (res) {
			var curData = res.data;
			var str = "";
			var dong = "<span>|</span>";
			str += dong;
			$(curData).each(function (i, item) {
				str += "<span><a href='" + item.content + "' target='_blank'>" + item.title + "</a></span>";
				str += dong;
			});
			$('#indexFriendLink').html(str);
		});
	}

})();
