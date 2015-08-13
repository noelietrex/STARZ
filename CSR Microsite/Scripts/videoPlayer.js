var Microsite = Microsite || {};

(function ($, page) {
	page.CastVideo = (function () {
		var $video, $cvpDIV, 
			_options = {},
			_paths = [],
			_loc = "http://starzcontent.starz.com/downloads/access_us/mp4/csr/",
			_init = false,
			_link, html;

		function setupVideo() {
			$video = $('#castVideo');
			
			html = $('#castVideo').html();
			
			
			$cvpDIV = $('#castvideoPlayerDIV');

			$('.videoLinkMarquee').click(function() {
				_link = $(this);
				
				setVideo2();
				$(document).trigger("videoStart");
				setTimeout(showVideoDiv,500);
			})


			$('.videoLinkNew').click(function() {
				_link = $(this);
				
				setVideo2();
				$(document).trigger("videoStart");
				setTimeout(showVideoDiv,500);
			})
			
			$('#closeCastVideo').click(function() {
				hideVideoPlayer();
			})
		}

		function showVideoPlayer2($link) {
			var flashlink = $link.attr ( "path" );
			var iosLink = $link.attr ( "iOSpath" );
			
			_options = {
					src: flashlink,
					srcApple: iosLink,
					ccUri: "",
					poster: "http://assets.starz.com/starzvideoplayer/v1-patch30/Assets/starz_darkBkgd_685x385.jpg",
					width: 623,
               height: 350,
					autoPlay: true				
				};
				
			starzVideoPlayer2.init(_options,false);
				
			
						
		}
		
		function showVideoDiv() {
			$('.episodeVideo').html("");
			$('#episodevideoPlayerDIV').hide();
			
			
			$cvpDIV.show();
		}
		
		function setVideo() {
			showVideoPlayer( _link );			
		}

		function setVideo2() {
			showVideoPlayer2( _link );			
		}
		
		function hideVideoPlayer() {
			$('#castVideo').html(html);
			
			setTimeout( delayOut, 500 );
		}
		
		function delayOut(){
			$(document).trigger("videoEnd");
			$cvpDIV.hide();
		}
		
		return {
			init: function () {
				setupVideo();
			}, hide: hideVideoPlayer
		}
		
	})();
	
	this.Construct = (function(){
		$(document).ready(function(){
			page.CastVideo.init();
		});
	})();	
	
}) (jQuery, Microsite);