
$(function () {
	$(".nav li").on("mouseover",function(){
		var n = $(this).attr("data-subnav");
		$(".subNav").removeClass("subNav-show subNav-animation").addClass("subNav-animationC");
		$("#sub-" + n).addClass("subNav-show subNav-animation").removeClass("subNav-animationC");
	});
	$(".header").on("mouseleave",function(){
		$(".subNav").removeClass("subNav-show subNav-animation").addClass("subNav-animationC");
	});
	

	$(".floatMenu li").hover(function(){
		$(this).addClass("on");
	},function(){
		$(this).removeClass("on");
	})
	
	$(".fm_weichat").on("click",function(){
        window.location.href="https://www.xuebangsoft.com/Experience.html"
	});
	

	var p = 0, t = 0,flag=true;
	$(window).bind('scroll', function() {
		
		p = $(this).scrollTop();
		if( p == 0 ||  p <= 100){
			$('.header').removeClass('fixed');
			return
		};
		
		if($(document).has('div.i-videoWrap').length != 0){
			if(flag===true&&p>=1800){
				$("#media_jplayer_1").jPlayer("play",0);
				flag=false;
			};
		}
		

		if (t < p) {
		 	$('.header').removeClass('fixed');
		} else{
			$('.header').addClass('fixed');
		};
		
		setTimeout(function(){ t = p},0)
		
	});

	var data=new Date();
	$("#currentTime").text(data.getFullYear());
});

var _vds = _vds || [];
window._vds = _vds;
(function(){
  _vds.push(['setAccountId', 'b679472f3bb8c4d4']);
  (function() {
    var vds = document.createElement('script');
    vds.type='text/javascript';
    vds.async = true;
    vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(vds, s);
  })();
})();
window.template&&template.helper('decodeURI', function (data) {
    return decodeURI(data);
})
function getUrlVars() {
    var vars = {},
        hash;
    var pageUrl = window.location.href.substring(window.location.href.indexOf('?') + 1);
    pageUrl = decodeURI(pageUrl);
    var hashes = pageUrl.slice(pageUrl.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        if (hash[1]) vars[hash[0]] = hash[1];
    }
    return vars;
}
function onfind(img){
    img.src="/style/images/no.jpg";
    img.onerror=null;
}