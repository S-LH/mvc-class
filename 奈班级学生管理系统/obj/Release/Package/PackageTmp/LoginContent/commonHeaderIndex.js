/**
 * 棣栭〉 tab 椤甸潰锛坱ab 灞呯劧鏂板紑涓€涓〉~~~锛�
 *  - 鑷眰澶氱 ~~~ 鑰佹澘瑕佽繖涔堝共鐨�
 */
$(document).ready(function () {
	// 浜у搧涓嬫媺鍒楄〃椤圭洰
	var proBossProductList = [
		{ name: 'BOSS鏍￠暱', hrefUrl: '/pro_boss.html' },
		{ name: '鏁欏鏄�', hrefUrl: '/pro_jxy.html' },
		{ name: '瀛﹁閫�', hrefUrl: '/pro_xxt.html' },
		{ name: '鏍￠暱鏀堕摱', hrefUrl: '/pro_xzsy.html' },
		{ name: '鐢垫湇瀹�', hrefUrl: '/pro_dfb.html' },
		{ name: '寰', hrefUrl: '/pro_wxb.html' },
		{ name: '430閭︽墭绠�', hrefUrl: '/pro_btg.html' },
	]

	// initData();
	initEvent();

	function initEvent() {

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

		// 浜у搧涓嬫媺椤�
		$('#index_header_event').find('li.header_nav_product').popover({
			animation: true,
			placement: 'bottom',
			content: template('tpl-indexHeader-productList', { items: proBossProductList }),
			html: true,
			container: '.header_nav_product',
			trigger: 'hover'
			// trigger: 'click'
		}).hover(function () {
			$(this).find('.popover').css({ position: 'absolute', left: '-20px', top: '40px' });
		})
	}
})