var PowerActivity = PowerActivity || {};

(function ($, PowerActivity) {
	PowerActivity.Buttons = (function(){
		var btnspeed = 100;
		
		/***************
		INIT
		****************/
		function init(){
			$('.poweractivitybtn').hover(animatebgup,animatebgdown);
		}
		
		/***************
		ANIMATE UP
		****************/
		function animatebgup(){
			var t = $(this);
			t.find('.btncolor').stop().animate({top:'0px'}, btnspeed);
		}
		
		/***************
		ANIMATE DOWN 
		****************/
		function animatebgdown(){
			var t = $(this);
			t.find('.btncolor').stop().animate({top:t.height()+'px'}, btnspeed);
		}
		
		/***************
		PUBLIC
		****************/
		return {
			init:init
		}
	})();
})(jQuery,PowerActivity);

(function ($, PowerActivity) {
	PowerActivity.Popup = (function(){
		/***************
		INIT
		****************/
		function init(){
			var c = $.cookie('poweractivitycookie');
			
			if ( c=="personsofinterestover" ){
				closepopup();
			} else {
				showpopup();
				$.cookie('poweractivitycookie', 'personsofinterestover' );
			}
			
			$('.poweractivitypopup-close').click(closepopup);
			$('.powerfixedbtn').click(showpopup);
		}
		
		function closepopup(){
			$('.poweractivitypopup').hide();
			$('.poweractivityfixed').show();
		}
		
		function showpopup(){
			$('.poweractivitypopup').show();
			$('.poweractivityfixed').hide();
		}
		
		/***************
		PUBLIC
		****************/
		return {
			init:init
		}
	})();
})(jQuery,PowerActivity);

/***************
START THE PARTY
****************/
(function(){
	$(document).ready(function(){
		PowerActivity.Buttons.init();
		PowerActivity.Popup.init();
	});
})();