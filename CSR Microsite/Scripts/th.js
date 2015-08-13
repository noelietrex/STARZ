var th = th = {};

(function($,th){
	th.csr = (function(){
		/********************************
			CLASSES THAT NEED TO BE FOUND	
		*********************************/
		var classes = [
			{c:'firstclue',p:'thstart',b:'clue1'},
			{c:'secondclue',p:'thpopup2',b:'clue2'},
			{c:'thirdclue',p:'thpopup3',b:'clue3'}
		];
		
		/********************************
			LAST POPUP BTN
		*********************************/
		var lastbtn = 'clue4'; 
		
		/********************************
			GENERIC CLASS ON POPUP BTNS
		*********************************/
		var popupbtns = 'thbtn';
		
		/********************************
			CLASS THAT IS ADDED TO ACTIVE ITEM 
			
			USE FOR CSS STYLING	
		*********************************/
		var current = 'thselected';
		
		/********************************
			COMMON CLASS ON EVERY POPUP
		*********************************/
		var popupclass= 'thpopup';
		
		/********************************
			POPUP CLOSE BTN - SAME ON EVERY POPUP
		*********************************/
		var closebtn= 'closeth';
		
		/********************************
			WHAT HAPPENS AFTER ALL FOUND	
		*********************************/
		function endAction(){
			$('.'+lastbtn).show();
			$('.thend').show();

			//showVideo();	
		}
		
		/*----------------------------------------------- END OF EDITING // DON'T EDIT BELOW -------------------------------------------------------*/
		
		/********************************
			INIT - START THE TREASURE HUNT	
		*********************************/
		function init(){
			checkTH();
			$('.'+closebtn).click(closepopup);
			$('.submitth').click(checkValue);
			
			$('.'+popupbtns).click(showPopup);
		}
		
		/********************************
			VALIDATE THAT THE CORRECT ANSWER IS PICKED
			AND SHOW CLAIM PRIZE POPUP	
		*********************************/
		function checkValue(){
			$('.therror').hide();
			var thqv = $('input[name=RadioGroup]:checked').val();

			if( thqv=="vid02") {
				$('.thpopup3').hide();
				$('.thend').show();
				_gaq.push(['_trackEvent', 'TreasureHunt', 'Completed' ]);
			} else {
				$('.therror').show();
			}
		}
		
		/********************************
			CLOSE ALL POPUPS WHEN CLOSE BTN IS CLICKED
		*********************************/
		function closepopup(){
			$('.'+popupclass).hide();
			$('#thvideo').html("");
		}
		
		/********************************
			CLOSE ALL POPUPS WHEN CLOSE BTN IS CLICKED
		*********************************/
		function showPopup(){
			$('.'+popupclass).hide();
			
			var t = $(this);
			$('.'+t.attr('t')).show();
			
			_gaq.push(['_trackEvent', 'TreasureHunt', 'OpenPopup', t.attr('t') ]);
			
			if (t.attr('t')=='thpopup4') showVideo();
		}
		
		
		/********************************
			CHECK WHAT LEVEL TH IS ON
		*********************************/
		function checkTH(){
			var c = $.cookie('csrth2');
			
			if ( c==undefined ){
				$.cookie('csrth2',0);
				c = '0';
				c = Number(c);
				$("."+classes[c].p ).show();
			}
			
			c = Number(c);
			
			if ( c<classes.length){
				if( c>0 ){
					for (i=0;i<=c;i++){
						$("."+classes[i].b ).show();
					}
				}
				
				$("."+classes[c].b ).show();
				$("."+classes[c].c ).addClass(current);
				$('.'+current).click(nextClick);
			} else {
				for (i=0;i<classes.length;i++){
					$("."+classes[i].b ).show();
				}
				$('.'+lastbtn).show();
			}
		}
		
		/********************************
			WHAT HAPPENS WHEN ONE IS CLICKED	
		*********************************/
		function nextClick(){
			$('.'+current).off("click");
			$(this).removeClass(current);
			var c = Number( $.cookie('csrth2') );
			
			_gaq.push(['_trackEvent', 'TreasureHunt', 'ItemFound', 'Item #'+c ]);
			
			if( c<classes.length-1 ) {
				 c++;
				 $.cookie('csrth2',c);
				 $("."+classes[c].p ).show();
				 checkTH();
			} else {
				$.cookie('csrth2',classes.length);
				endAction();
			}
		}
		
		function showVideo(){
			var flashlink = "http://preview-g.starz.com/p/promos/31756/31756_4q_starz_image_spot_600k.mp4";
			var iosLink = "http://preview-g.starz.com/p/promos/31756/31756_4q_starz_image_spot_600k.mp4";
			

			var playerCode = '<div id="StarzVideoPlayerPopup">';
			playerCode +=	'<div id="StarzVideoPlayerFallback" class="hidden">';
			playerCode +=	'<a href="http://www.adobe.com/go/getflashplayer" target="_blank">';
			playerCode +=	'<img src="http://assets.starz.com/starzvideoplayer/v1-patch30/SiteImagesLib/no-flash-image-980.jpg" alt="Update Flash Player Image" /></a>';
			playerCode +=	'</div>';
			playerCode +=	'</div>';

			$('#thvideo').html(playerCode);
			
			var options = {
					src: flashlink,
					srcApple: iosLink,
					ccUri: "",
					poster: "http://assets.starz.com/starzvideoplayer/v1-patch30/Assets/starz_darkBkgd_685x385.jpg",
					width: 420,
               		height: 260,
					autoPlay: true,
					id: 'StarzVideoPlayerPopup'			
			};
				
			starzVideoPlayer2.init(options,false);
			
			_gaq.push(['_trackEvent', 'TreasureHunt', 'VideoPlayed' ]);
		}
			
		return {
			init:init
		}
	})();
	
	/********************************
		CONSTRUCTOR	
	*********************************/
	this.Construct = (function(){
		$(document).ready(function(){
			th.csr.init();
		});
	})();
	
})(jQuery,th);