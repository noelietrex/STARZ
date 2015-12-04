var STARZ = STARZ || {};
(function ($, STARZ) {
	/***************
	START THE PARTY
	****************/
	STARZ.FYC = ( function(){
		var PATH = "data/contentcostume.json",
			$content, 
			HOME = "templates/guilds.html", 
			SHOW = "templates/show.html";
			AWARD = "templates/award.html";
			OLD = "templates/old.html";
		
		/***************
		INIT
		****************/
		function init(){
			$content = $('#content');
			
			if(  document.addEventListener  ){
		       loadShows();
			} else {
			    $.get(OLD, function(template){
					var html = Mustache.to_html(template, {});
					$content.html(html);
				});
			}
			
			$(window).resize(resize);
			resize();
		}
		
		/***************
		LOAD DATA
		****************/
		function loadShows(){
			$.getJSON(PATH, function (data) {
				STARZ.DATA = data;
				STARZ.SHOWS = [];
				
				var app = $.sammy(function () {
					var pg = this;
					
					pg.get('#/', function () {
	                  loadHome();
	              	});
					
					$.each( data["shows"], function(i, field){
						STARZ.SHOWS[field["safe_name"]] = field;
						
						pg.get("#/"+field["safe_name"], function(){
							Prompt(field["safe_name"]);
						})
					});
				});
				
				app.run('#/');
			});
		}
		
		/***************
		LOAD HOME
		****************/
		function loadHome(){
			$.get(HOME, function(template){
				var html = Mustache.to_html(template, STARZ.DATA);
				$content.html(html);
			});
			
		}
		
		/***************
		Password
		****************/
		function Prompt(t){
			var c = $.cookie('starzfyc2015');
			if(c!=CryptoJS.MD5("starzfyc2015")){
				var a = prompt('Please enter your password to view this content');
				if (  CryptoJS.MD5(a) ==  "64dd2c0944eacbca53121f629005921c") {
					$.cookie('starzfyc2015',CryptoJS.MD5("starzfyc2015").toString(),  {expires: 1});
					loadShow(t);
				} else {
					alert('Incorrect password');
					window.location.hash = '#/';
				}
			} else {
				loadShow(t);
			}
		}
		
		/***************
		LOAD SHOW
		****************/
		function loadShow(t){
			$(window).scrollTop(0);
			
			var temp = {"shows":[]};
			
			for ( i in STARZ.SHOWS ){
				var d = STARZ.SHOWS[i];
				d["current"] = ( i==t ) ? true : false;
				temp["shows"].push(d);
			}
			
			$.get(SHOW, function(template){
				var html = Mustache.to_html(template, temp);
				$content.html(html);
				
				$('*[data-html]').each(loadHtml);
				
				brightcove.createExperiences();
			});
		}
		
		/***************
		LOAD HTML
		****************/
		function loadHtml(){
			var t = $(this);
			var path = t.attr('data-html');
			
			$.get(path, function(html){
				t.html(html);
			});
		}	
		
		/***************
		Resize
		****************/
		function resize(){
			var ww = $(window).width();
			$('.theVideo').css('margin-top', '0px');
			$('.theVideo').css('margin-bottom', '0px');
			
			var cs = $('.currentshow').height();
			var vh = $('.BrightcoveExperience').height();
			
			if (ww>979){
				var vm = (cs-vh)/2;
			} else{
				vm = 0
			}
			
			$('.theVideo').css('margin-top', vm+'px');
			$('.theVideo').css('margin-bottom', vm+'px');
		}
			
								
		/***************
		PUBLIC
		****************/
		return {
			init:init,
			resize: resize
		}
		
	})();
		
})(jQuery,STARZ);

/*********************************
	START THE PARTY
*********************************/
(function(){
	$(document).ready(function(){
		STARZ.FYC.init();
	});
})();




