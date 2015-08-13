var PowerActivity = PowerActivity || {};
// @codekit-append "includes/controller.js";
// @codekit-append "includes/btns.js";
// @codekit-append "includes/init.js";

(function ($, PowerActivity) {
	PowerActivity.Controller = (function(){
		var SPEED = .3;
		var WIDTH = 830;
		var ACTIVITY_HEIGHT = 500;
		var END_HEIGHT = 425;
		var DIFF = 10;
		var correct = [0,0,0];
		var TOP = 17;
		
		/***************
		INIT
		****************/
		function init(){
			$('.content').css('top',($('#wrapper').height()-$('.content').height())/2+'px');
			
			setTimeout(animateInActivity, 1000);
			
			$( "#selectmenu1" ).selectmenu({
				select: characterSelect
			});
			$( "#selectmenu2" ).selectmenu({
				select: characterSelect
			});
			$( "#selectmenu3" ).selectmenu({
				select: characterSelect
			});
		}
		
		/***************
		ANIMATE IN ACTIVITY
		****************/
		function animateInActivity(){
			TweenLite.to( $('.content'), SPEED*2, {
				'top':TOP+'px'
			});
			
			//FIRST
			TweenLite.to( $('.content-body'), SPEED, {
				'width':WIDTH+'px',
				'margin-left':'-'+WIDTH/2+'px'
			});
			TweenLite.to( $('.content-body-inner'), SPEED, {
				'width':WIDTH-DIFF+'px'
			});
			
			//SECOND
			TweenLite.to( $('.content-body'), SPEED, {
				'height':ACTIVITY_HEIGHT+'px',
				'delay': SPEED*2
			});
			
			TweenLite.to( $('.content-body-inner'), SPEED, {
				'height':ACTIVITY_HEIGHT-DIFF+'px',
				'delay': SPEED*2
			});
		}
		
		/***************
		Character Select
		****************/
		function characterSelect(event,ui){
			var t = $(event.target);
			var p = t.parent().parent().parent();
			var img = p.find('.activity-image');
			var a = p.attr("t");
			
			if( a==ui.item.value ){
				p.find('.selectmenu').fadeOut(function(){
					img.find('span').fadeOut();
					p.find('.activity-name span').fadeIn();
					
					addCorrect(p);
				});
				
				p.find('.item-error').hide();
			} else {
				p.find('.item-error').fadeIn();
			}
		}
		
		/***************
		CHECK CORRECT
		****************/
		function addCorrect(t){
			var id = Number(t.attr('n'));
			correct[id] = 1;
			
			var v = 0;
			for (i=0;i<correct.length;i++){
				v += correct[i];
			}
			
			if(v==3) setTimeout(animateOutActivity,1000);
		}
		
		/***************
		ANIMATE OUT ACTIVITY
		****************/
		function animateOutActivity(){
			$('.activity-list li').eq(2).fadeOut(function(){
				$('.activity-list li').eq(1).fadeOut(function(){
					$('.activity-list li').eq(0).fadeOut(function(){				
						TweenLite.to( $('.content'), SPEED*2, {
							'top':TOP+(ACTIVITY_HEIGHT-END_HEIGHT)/2+'px'
						});
						
						TweenLite.to( $('.content-body'), SPEED, {
							'height':0+'px',
							onComplete:showEnd
						});
						
						TweenLite.to( $('.content-body-inner'), SPEED, {
							'height':0+'px'
						});
						
						TweenLite.to( $('.content-body'), SPEED, {
							'height':END_HEIGHT+'px',
							'delay': SPEED*2
						});
						
						TweenLite.to( $('.content-body-inner'), SPEED, {
							'height':END_HEIGHT-DIFF+'px',
							'delay': SPEED*2
						});
					});
				});
			});
		}
		
		/***************
		Show End
		****************/
		function showEnd(){
			$('.activity').hide();
			$('.end').show();
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
	PowerActivity.Buttons = (function(){
		var btnspeed = .07;
		
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
			TweenLite.to(t.find('.btncolor'), btnspeed, {top:'0px'});
		}
		
		/***************
		ANIMATE DOWN 
		****************/
		function animatebgdown(){
			var t = $(this);
			TweenLite.to(t.find('.btncolor'), btnspeed, {top:t.height()+'px'});
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
		PowerActivity.Controller.init();
		PowerActivity.Buttons.init();
	});
})();

