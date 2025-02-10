$(document).ready(function () {

	var $footer = $('.index_footer');

	var android_ios_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABQFJREFUeF7tXe0SmzAMo+//0N3RlTYE68MubNer95NBSBTZkk263ZZluS/FP/f730dvt9tuhO36dnH8+/mZ+d7ome2aenaeB1sWmnsWinXlDWAWteH+F4CICfPYEZsQa5xdPuMeNvdtvoi9bD0I1/GZBnBIPxUSHQBEeSRiCsp1jFVqkpk8NufGSiSy/DyPF62rAQwYmCHRKQCiPMMYkpkkYgJjHHIGbK4qH1/GwAZw9TLA0yEPtl53nxmZ4jLDYZfyhZFHPWM9VIUzodUALsspNmYO4U+qicyzDpuQj3VcxT/zgQ1gxUAFOTDj9isVwtXPVGA4tRZuAJNboABjeeZqNlXmllz+4/bbXdVWxqgZMIzh5C0KnNFizaJ0wnJ382sA5XbxG6SNUVVGNDxrqLoNAKfNxBoPmUatwpCtpwFU6A1uI/KoEEBVkURlUqa0Uq0wp/xj+U3NH3lXVv5F0dMAPnsAbMNmko6bfxARtjNodzJsQqxR760yPgq7SKWzzHuNO9sYtZAoNBrA4NPkHO8RsBWwlQqftUEu8ypqH4ZwJek2gEM7C6m56vmN+UQ1S5ljcN6TmaNKKw7TEYt3gqM+rDsLQ/c4z6JUYdiz1y1Ob88pCCrmW3ZjHBB+GsBNhd2mqFOMOybV2ZiK4GSY69oZtuaXD2wA39CjXB5tDgTQyRlu/trJ/nSSC7GM2QvlGMKFPt9L2QTmxiKhARzQZt0dGO6ooaqapKx2ZO0fZS8c9jjR4Qobiw6rOdIAvo9HKh8bhf/BxlS8UIZVpTARJ2CzysuixykMqJFuAPGRlZCBsw9Uquj4wJkRTsHulE0st7qeTnnL9e8zoXxQ4QbwQwArFUKlK6MUjhX7jgqrxoOj9nNUWCHcAL5zYAMY0MypRFKuAokIKtMyZZkThp9YEFZKuiA4fUFWG0MRaQC95oL8rOmUZRVzjJjntMKczWVWSrFeCVxopCuUdwUn4x2/DkDXSKtdi8ojJ2HP40abojY3Azp6HzPQbO22kW4AYwTSAKp8lwF6vNfJO6prHhpd0cDNrMcy0qpWzLwwA+bXA4iKeWdhSvEYM1SDYB0bzYGVdK7AsU12xoCHiypWQW2CIzSO+VaARqBnooEZ9ANZlApXdrniHTNMnDfqE+WOgEXMi65LEWkA3xA3gMYPJFn4hwBuZ2My1YLKJ6o/GD1fMcNM4JRbcEy+g4k8ZK7AyoKBxvtaANUJVbaTqsSKVBntKmsZIdFAqu9susMuZxx5RroB5DDKXypVQotVMyo/ZhqcV9kl5YHHOTaA5ECRY9jlActMqeO8UOXNiKHqK5xjpCv50llPA0gYYgF4xc9dlWqymljlSNc2uax1x4P2qwE8QpPZxEtCmOUb1SJy8pmqMqJyzAnHUutO/cyhIiINoGPBSaPzJwF0S5sxfFQPLxpThZ9T5COjHs0NiUnmPchYr9fTzYQGcH/87dR//m6OfEcQHMujGg1OuanEy8xaj9tG9jaAGeSe954OIDSZ5MctymtlmgpRTkTjK4PNLFAkjqcwsAE0vhU4+UzlqodqmScFdmEyMdlhEVJqx2LNhKA5dv4m4i5wTqYROBkb43zfcKoJJGQIlPG66paH68l+VGI2RoWyAzrLZ47KI8+mPCvLfSyyTvWBPw1gQc3lmRWHTcifZcI/mrtq3GZyIaueLunGUMqD3719IkANoPFfajAF/58A/gETDUoEh98vkgAAAABJRU5ErkJggg==';
	var attendance_src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABRFJREFUeF7tneF22zoMg5P3f+jspKtTWSGBj5LaZanuv3tsyRIEgiDtdNfL5XK7DP53u/0der1e8Qz9mBVzHA8/5orW1F5rF1tZe7TJ+843gPj4n298AJidUD+kPbGMPWSuY57+XsWIkef1z8n+/75Psu6e3RvARn6WAJgxIDp9p2dkTM/waBNOp9QYBwqJqF5j2zFPDNwA5kkxIsQSAJVOjuqzYk5FP51uvgQDN4BNBloZwsqfZdmX6FnGQOXvnF63WbiCwZIQVtagtwcu/P57AJ1mRZrhxowwI3T9n5aj4h2jKMjW4zL2MU5mYQfGBvCcpZeWciM680pjHHm+vRZ+JTDcWkaaGBvApnO0DMAbVc4Rfn+OcaWYm9otMcrs/TMzRrpnu+vXDaCDSF9PuzGzrMke69hEtuN8pzLFhIlk/oelORqqI96KbJZ0W6rzkA3SGrhi3MMkcoQwKY/oRklTNKufVQvMjVHmm0QELeFa0B8auAHkbSwJIGVZpDNEBtw9I01YVa5l2Tgqy/p5XN1+v/+JgRvAr3cjJQDVibRsUzrjhPvjxLpXoDNjMk0k0UGIQpzIkw90QroBPCPw1ExwPo20wEk73mXFSiaP7s3WoCwQbfKG7SwlxO1mN4CmnbUZ+EWXpUmEWAUHPjG6I0aaJAQnGVmU2QTaNxNc5iGlT2VDJCs7Pas8r79X7YfIWvpSyRne6GQI5SkTVGKoPMc1Vtv1jPQIN4ANglMAZtRWNfJM/VwZ68qxmRAmTFfzpy+VRvpmlY28DYB9O6sXTpdUCGiV7ExMcWVNIxqoSsRe+9Nmwoge0AQhQyL4XJgkNPfsShP2WwAcSfeVMCVMdtn31KfrvmLIACRjpAemIbwBjD8Bngphqm0VXSNGnbApC0MlB04vI1nbAAbfSLsDOnVjaAhHGrUZGLT0KY3vgJLMRpJDVE6NFPekh0hMubtHMnADmL92OA41BDC6OFtoE/aRdyLZPMQmOeuj1oiqMdrOWmmsycEQfX0JAPtPO1yZFBlP0jejLCI6lkWLWltWoo7YppM+bwCff2vpbEwIIGWRY2hfbDtD6zJexNyRNYyEO9HPqdearoBXm1+RPEgC6MNdaStl3lQWJplV3ZOxZ0WJNXtghNl9hC35MqEC6tsDWNGsjDUzFiTSHQc6aVZkoTwy9pRE3DfSqlzbADa18IhP2wBeLvjHhpHNoRakEiaqpCSllStJiV0jlufxnJ8w0r8CwD6ESe1LvRyxB+TFkUtO7XPI+qs+NtoHfi8cPWwDGGjgSk+ntIS6frKeimapykQ5jtZAnyqR7Ic2lYW78J/teLi1vBSARK8ywEgGnLE+mcknNfHIvtw+79fLNkZp4a8E0FUiLnw+TiH56YIq7t28pHFLQteVgWqNJEku+bnrrwZw5Z+/W1kpOIZGWTFirdNc5R0z3xlmYbJgmm1nQquyDnVg2RpIc8StfwOY/KUmGkFTPnCkXCIJQTHPsSlqEFBTTJKINN9VI70BPH/mhn1glNJJmq+a30oTQN1LmhNOb10CKhnpDeDzx1T/BEB36pXrLluSuSJJyiqqiEQ/HsJkU/SetwGwcmJRxmwBI91rUp5l1RGpmtzBSBvjFjdL+bcH0IWPArCacdv7SfZ1pZXqO/YHp1hWaX0t+UPcGeiVhfz3ADrmRdez0mcEOFKJVMLfsVU9z5V0P1YLk0Nxb9o+vBbsNxJ5IYe7ART/sMBqAP8ARTmTKwAgGQwAAAAASUVORK5CYII=';
	var wechat_src = 'https://www.xuebangsoft.net/eduboss/app/libs/newXXTQRCode.jpg';

	// initData();
	initEvent();

	function initEvent() {

		$footer.find('.down_ios').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + android_ios_src + '" class="menu_wechat_tips_img"><p class="menu_wechat_tips_text">鍛樺伐绔疉PP-iOS</p></span>',
			html: true,
			container: 'body',
			// trigger: 'click'
			trigger: 'hover'
		})

		$footer.find('.down_android').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + android_ios_src + '" class="menu_wechat_tips_img"><p class="menu_wechat_tips_text">鍛樺伐绔疉PP-瀹夊崜鐗�</p></span>',
			html: true,
			container: 'body',
			trigger: 'hover'
		})

		$footer.find('.down_attendance').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + attendance_src + '" class="menu_wechat_tips_img"><p class="menu_wechat_tips_text">浜鸿劯鑰冨嫟3.0</p></span>',
			html: true,
			container: 'body',
			trigger: 'hover'
		})

		$footer.find('.down_wechat').popover({
			animation: true,
			placement: 'left',
			content: '<span><img src="' + wechat_src + '" class="menu_wechat_tips_img"><p class="menu_wechat_tips_text">瀛﹁閫氬叕浼楀彿</p></span>',
			html: true,
			container: 'body',
			trigger: 'hover'
		})

		$footer.find('.clickItem').on('click', function (e) {
			var $this = $(this);
			var flag = $this.attr('data-click-flag');
			$('#freeExperienceModal').attr('data-from-click', flag);
		})

	}
})