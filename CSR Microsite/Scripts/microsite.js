var Microsite = Microsite || {};

(function ($, page) {

	/* -------------------  Init ---------------------------------------------------- */
	
	page.init = function() {
		page.Setup.init();
		
		if($('#imageBrowser').length)page.ImageBrowser.init();
		if($('.episodeVideo').length)page.EpisodeVideo.init();
				
		if($('.sweepstakesFrame').length)page.Sweepstakes.init();
		if($('.affiliate').length)page.Affiliate.init();	
	}
	
	/* -------------------  Setup Page ---------------------------------------------------- */
	page.Setup = (function () {
		
		function setupPage() {
			//internetExplorerFixes();
			//activateAnalytics();
			
		}
		
		function internetExplorerFixes() {
			if($.browser.msie) {
				
			}
		}
		
		function activateAnalytics() {
			//Track all link tags
			$('a').click(function() {
				var linkName = $(this).attr('href');
				if((linkName != '#')&&(linkName != null)) {
	 				_gaq.push(['_trackEvent', 'Link', 'Clicked', linkName]);
				}
			});
			
			//Track all video plays
			$('.headerVideo').click(function() {
				//var videoName = $(this).attr('videoName');
	 			_gaq.push(['_trackEvent', 'Video', 'Played', videoName]);
			});	
		}
				
		return {
			init: function() {
				setupPage();
			}
		}
				
	})();
		
	/* -------------------  Image Browser ---------------------------------------------------- */
	
	page.ImageBrowser = (function () {
		var imageTimer;
		var imageDelay = 10000;
		var animating = false;
		var mouseIsOver = false;
		var imgs = new Array();
		var gallery, 
			_current;
		
		function setupBrowser() {
			gallery = $('#imageBrowser');
			gallery.attr ( 'current', 0);
			
			var items = $('.imageBrowserContent');
			
			if ( items.length > 1 ) {
				for ( var i=0;i<items.length;i++ ) {
					imgs.push ( items.eq(i) );
					
					var imgBtn
					if (i!=0) {
						items.eq(i).hide();
						imgBtn = '<img id="imageGalleryButton'+i+'"imageNumber="'+i+'" class="imageBrowserBtn hotspot" src="images/elements/img_off.png" style="padding-right: 10px;" />';
					} else {
						imgBtn = '<img id="imageGalleryButton'+i+'"imageNumber="'+i+'" class="imageBrowserBtn hotspot" src="images/elements/img_on_orange.png" style="padding-right: 10px;" />';
						items.eq(i).show();
						_current = items.eq(i);
					} 
					
					var btns = gallery.find ( "#imageButtons" );
					btns.append ( $(imgBtn) );
				}
				
			} else {
				gallery.find ( "#imageBrowserNav").hide();
				items.eq(0).show();
				_current = items.eq(0);
			}
			
			gallery.show();
			
			$('.imageBrowserBtn').click( switchImage );
			
			$(document).on("videoStart", stopBrowser);
			$(document).on("videoEnd", startTimer);
			
			startTimer();
			
		}
		
		function switchImage() {
			stopBrowser();
			
			var t = $(this);
			var btns = t.parent().children();
			
			var itemNumber = Number( t.attr("imageNumber") );
			var currentNumber = Number( gallery.attr( "current") );
			
			if ( itemNumber != currentNumber ) {
				switchToImage( itemNumber, currentNumber, gallery, btns );
			}
		}
		
		function switchToImage( itemNumber, currentNumber, gallery, btns) {
			var nextItem = imgs[itemNumber];
			var old = _current;

			try{
				nextItem.fadeIn("slow");
				old.fadeOut( "slow" , function () {
					old.hide();
				});
				
				_current = nextItem;
				
				btns.eq( currentNumber ).attr('src', 'images/elements/img_off.png');
				btns.eq( itemNumber ).attr('src', 'images/elements/img_on_orange.png');
				gallery.attr( "current", itemNumber );
				
				startTimer();
			}catch(e){}
		}
		
		function nextImage() {
			var btns = gallery.find ('#imageButtons').children();
			
			var currentNumber = Number( gallery.attr( "current") );
			var totalNumber = btns.length;
			
			var nextNumber = currentNumber+1;
			if (nextNumber == totalNumber ) nextNumber=0;
			
			switchToImage( nextNumber, currentNumber, gallery, btns );
		}
		
		//Starts the image gallery rotation
		function startTimer() {
			imageTimer = setTimeout(function(){
				nextImage();
			}, imageDelay); 
		}
		//Stops it
		function stopBrowser() {
			clearTimeout(imageTimer);
		}
		
		
		return {
			init: function() {
				setupBrowser();
			},
			stopBrowser: function() {
				if($('.imageBrowserContent').length > 1)stopBrowser();
			},
			startBrowser: function() {
				if($('.imageBrowserContent').length > 1)startTimer();
			}
		}
		
	})();

	function hideExit() {
		$('iframe header').hide();
	}
	
	page.EpisodeVideo = (function () {
		var $video, $evpDIV, 
			_paths = [],
			_v;
				
		function setupVideo() {	
			$video = $('.episodeVideo'); 
			$('.episodeVideo').hide();
			$evpDIV = $('#episodevideoPlayerDIV');
			
						//<iframe scrolling="no" width="650" height="460" frameborder="0" src="http://www.starz.com/videoembed/pages/videoembed2.aspx?&w=2a2b8cc6-c736-4065-b807-24f46a514690&vl=53e80514-669a-4e27-b3dd-eb8faa6011ab&vid=&ccid=emb%3A%3A687b4705-e069-45f1-b294-0d2e3bfc418b" ></iframe>
						
						//'<iframe scrolling="no" width="650" height="400" frameborder="0" src="http://www.starz.com/videoembed/pages/videoembed2.aspx?w=2a2b8cc6-c736-4065-b807-24f46a514690&vl=11350667-9a1b-4158-b394-46f9456f5b00&cid=6433"></iframe>';
			
			_paths[0] = '<iframe scrolling="no" width="650" height="400" frameborder="0" src="http://www.starz.com/videoembed/pages/videoembed2.aspx?w=2a2b8cc6-c736-4065-b807-24f46a514690&vl=53e80514-669a-4e27-b3dd-eb8faa6011ab&cid=6433"></iframe>';
				
			$('.episodeVideoLink').click(function() {				
				showVideoPlayer( $(this) );
			})
			
			$('#closeEpisodeVideo').click(function() {
				hideVideoPlayer();
			})
		}
		
		function showVideoPlayer($link) {
			try {
				starzVideoPlayer2.pause();
			} catch(err) {
				
			}
			
			//var v = Number ( $link.attr('episodeName') );
			$('#castvideoPlayerDIV').hide();
			
			_gaq.push(['_trackEvent', 'Episode', 'Viewed', "Episode201"]);
			
			//_v = $link.attr('videoName');
			
			$evpDIV.fadeIn( function () {
				$video.html ( _paths[0] );
				//$('#'+_v).show();
			});
			
			//console.log( "here" );
		}
		
		function hideVideoPlayer() {
			$video.html ( "" );
			$evpDIV.fadeOut();
			//$('#'+_v).hide();
		}
		
		return {
			init: function () {
				setupVideo();
			}
		}
		
	})();
	
	page.Sweepstakes = (function () {
		var code = '<iframe width=\"960\" height=\"825\" src=\"http://starz.pmcprograms.com\" frameborder=\"0\" allowfullescreen></iframe>';
		//code+= '<div style=\"text-align:center;\" ><br><a class=\"redClose\" href=\"#\"><img src=\"http://www.starz.com/affiliate/csrviporiginals/images/closeBtn.png\" border=\"0\"></a>';
		//code+= '<a class=\"closeBtn"\ href=\"#\" onClick="_gaq.push(['_trackEvent', 'SweepsEnter', 'Click_CloseWindow']);"><img src="images/elements/btn_close.png" width="81" height="23" alt="Click to Close" /></a>
		
		var VALID = false;
		
		function init(){
			$('.sweepstakesFrame').hide();
			//$('#btn_instantWin').click ( showFrame );
			//$('#btn_Visa').click ( showFrame );
			
			$('#btn_sweeps').click( validate );
			
			
			if ($.cookie("sweepCookie") == 'DVDSweepStakes2') {
				VALID = true;
				$('.blue').hide();
				$('.watchtrailer').hide();
				$('.questioncontainer').hide();
			}
		}
		
		function validate(){
			if (VALID) {
				showFrame();
			} else {
				var q1 = $('input[name=q1]:checked').val();
				var q2 = $('input[name=q2]:checked').val();	
				var q3 = $('input[name=q3]:checked').val();				
				
				var n = 0;
				if (q1=='a2') {
					n++;
					$('.question').eq(0).find('.incorrect').hide();
				}else {
					$('.question').eq(0).find('.incorrect').show();
				}
				
				if (q2=='a3') {
					n++;
					$('.question').eq(1).find('.incorrect').hide();
				}else {
					$('.question').eq(1).find('.incorrect').show();
				}
				
				if (q3=='a1') {
					n++;
					$('.question').eq(2).find('.incorrect').hide();
				}else {
					$('.question').eq(2).find('.incorrect').show();
				}
				
				if ( n==3 ) {
					$('.blue').hide();
					$('.watchtrailer').hide();
					$('.questioncontainer').hide();
					VALID = true;
					$.cookie('sweepCookie', 'DVDSweepStakes2');
					showFrame();
				}
			}
		}
		
		function showFrame(){
			$('#winmarquee').hide();
			$('#contentContainer').hide();
			$('.sweepstakesFrame').fadeIn("medium", function () {
				$('.sweepscontent').html( code );
				$('.closeBtn').click ( hideFrame );
			});
			page.CastVideo.hide();
			
		}
		
		function hideFrame(){
			$('.sweepstakesFrame').fadeOut( "medium", function () {
				$('.sweepscontent').html( "" );
				$('#contentContainer').show();
				$('#winmarquee').show();	
			});
		}
		
		return {
			init: init
		}
	})();
	
	page.Affiliate = (function () {
		var t;
		
		function init(){
			$('.affiliate').click ( clicked );
			$('.login-close').click( close );
			$('.login-end').click( close );
			$('.login-submit').click( submitted );
		}
		
		function clicked(){
			t = $(this);
			
			$('#login').show();
			$('.login-content').show();
			$('.login-incorrect').hide();
			
			$('.login-password').focus();
		}
		
		function submitted(){
			var p = $('.login-password').val().toUpperCase();
		
			if (t==undefined) {
				$('.login-content').hide();
				$('.login-incorrect').show();
			} else {
				if ( p!= null && CryptoJS.MD5(p)==t.attr('s') ) {
					_gaq.push(['_trackEvent', 'AffiliatePage', 'Opened', t.attr('p')]);
					window.open( CryptoJS.MD5(p)+CryptoJS.MD5(t.attr('p'))+'.html');
					$('.login-password').val("");
					close();
				}else {
					$('.login-password').val("");
					$('.login-content').hide();
					$('.login-incorrect').show();
					_gaq.push(['_trackEvent', 'AffiliatePage', 'IncorrectPassword', t.attr('p')]);	
				}
			}
		}
		
		function close(){
			$('#login').hide();
			$('.login-content').hide();
			$('.login-incorrect').hide();
			t = undefined;
		}
	
		return {
			init: init
		}
	})();
	
	/* -------------------  Constructor ---------------------------------------------------- */
	
	this.Construct = (function(){
		$(document).ready(function(){
			page.init();
			
		});
	})();	
	
}) (jQuery, Microsite);