;(function($, window, document, undefined) {
    /*****************
    Treasure Hunt Plugin
    ******************/
    $.csrTreasureHunt = function(options) {
	    var defaults = {
		    
		    //REQUIRED
			cookie: 'csrth',
			items: 3,
			
			//QUIZ / VIDEO
			quiz: false,
				quizanswer: 2,
				quizvideo: true,
					videoproperties: { 
						width:420,
						height:260,
						videopath: "http://preview-g.starz.com/p/promos/31756/31756_4q_starz_image_spot_600k.mp4",
						autoplay:true,
						poster:"http://assets.starz.com/starzvideoplayer/v1-patch30/Assets/starz_darkBkgd_685x385.jpg",
						fallbackimg: "http://assets.starz.com/starzvideoplayer/v1-patch30/SiteImagesLib/no-flash-image-980.jpg"
					},
			
			//OPTION CLASS NAMES
			clueClass: "th-clue",
			
			buttonClass: "th-cluebtn",
			
			popupClass: "th-popup",
					closeClass: "th-closebtn",
				quizPopupClass: "th-quiz",
					videoClass: "th-videodiv",
					errorClass: "th-errormessage",
				enterToWinPopup: "th-entertowin",
			
				//ISN'T APPLIED IN HTML
				genericPopupClass: "genericTHPopupClass" 
	    }
	    
	    /******************
		    VARS
		*******************/
	    var plugin = this;
	    plugin.settings = {};
	    
	    /******************
		    CONSTRUCTOR
		*******************/
	    plugin.init = function(){
		    plugin.settings = $.extend(defaults, options || {});
		    $.removeCookie('csrth');
		    
		    plugin.setupAndHide();
		    plugin.checkProgress();
	    }
	    
	    /******************
		    START THE PARTY BY HIDING
		*******************/
	    plugin.setupAndHide = function(){
			$("."+plugin.settings.closeClass).click(plugin.hidePopup);
			
			for (i=1;i<=plugin.settings.items;i++){
				$("."+plugin.settings.popupClass+i ).hide().addClass(plugin.settings.genericPopupClass);
				$("."+plugin.settings.buttonClass+i ).hide().attr('t',"."+plugin.settings.popupClass+i);
				$("."+plugin.settings.buttonClass+i ).click(plugin.showPopup);
			}
			
			if (plugin.settings.quiz) {
				$("."+plugin.settings.buttonClass+(plugin.settings.items+1) ).hide().attr('t', "."+plugin.settings.quizPopupClass).click(plugin.showPopup);
				$("."+plugin.settings.buttonClass+(plugin.settings.items+2) ).hide().attr('t', "."+plugin.settings.enterToWinPopup).click(plugin.showPopup);
			} else {
				$("."+plugin.settings.buttonClass+(plugin.settings.items+1) ).hide().attr('t', "."+plugin.settings.enterToWinPopup).click(plugin.showPopup);
			}
			
			$("."+plugin.settings.quizPopupClass ).hide().addClass(plugin.settings.genericPopupClass);
			$("."+plugin.settings.enterToWinPopup ).hide().addClass(plugin.settings.genericPopupClass);     
		}
	    
	    /******************
		    Check Progress
		*******************/
	    plugin.checkProgress = function(){
		   plugin.current = $.cookie('csrth');
			
			if ( plugin.current==undefined ){
				$.cookie('csrth',1);
				plugin.current = 1;
				$("."+plugin.settings.popupClass+plugin.current ).show();
			}
			
			plugin.current = Number(plugin.current);
			
			if ( plugin.current<plugin.settings.items+1){
				for( i=1;i<=plugin.current;i++){
					$("."+plugin.settings.buttonClass+i ).show();
				}
				
				$('.'+plugin.settings.clueClass+plugin.current).click(plugin.nextItemFound)
			} else{
				for (i=1;i<=plugin.settings.items+1;i++){
					$("."+plugin.settings.buttonClass+i ).show();
				}
				
				if (plugin.settings.quiz){
					plugin.loadQuiz();
				} else {
					$("."+plugin.settings.enterToWinPopup ).show();
				}
			}
	    }
	    
	    /******************
		   NEXT ITEM FOUND
		*******************/
	    plugin.nextItemFound = function(){
		    $('.'+plugin.settings.clueClass+plugin.current).unbind("click");
		    
			try{
				_gaq.push(['_trackEvent', 'TreasureHunt', 'ItemFound', 'Item #'+plugin.current ]);
			}catch(err){}
			
			plugin.current++;
			$.cookie('csrth',plugin.current);
			$('.'+plugin.settings.genericPopupClass).hide();
			$("."+plugin.settings.popupClass+plugin.current ).show();
			plugin.checkProgress();
	    }
	    
	    /******************
		    SHOW A POPUP
		*******************/
		plugin.showPopup = function(){
			$('.'+plugin.settings.genericPopupClass).hide();
			$( $(this).attr('t') ).show();
		}
	    
	    /******************
		    HIDE POPUP
		*******************/
	    plugin.hidePopup = function(){
		    $('.'+plugin.settings.genericPopupClass).hide();
	    }
	    
	     /******************
		   LOAD QUIZ
		*******************/
		plugin.loadQuiz = function(){
			$('.'+plugin.settings.errorClass).hide();
			
			var qp = $("."+plugin.settings.quizPopupClass ).show();
			plugin.answers = [];
			qp.find('input').each(function(i){
				if ( $(this).attr('type')=="submit" ) $(this).click(plugin.checkQuiz);
				else plugin.answers.push( $(this) );
			});
			
			if (plugin.settings.quizvideo) {
				plugin.jsVideo();
			}
		}
		
		/******************
		   HANDLE JS VIDEO
		*******************/
		plugin.jsVideo = function(){
			var playerCode = '<div id="StarzVideoPlayerPopup">';
			playerCode +=	'<div id="StarzVideoPlayerFallback" class="hidden">';
			playerCode +=	'<a href="http://www.adobe.com/go/getflashplayer" target="_blank">';
			playerCode +=	'<img src="'+plugin.settings.videoproperties.fallbackimg+'" alt="Update Flash Player Image" /></a>';
			playerCode +=	'</div>';
			playerCode +=	'</div>';

			$('.'+plugin.settings.videoClass).html(playerCode);
			
			var options = {
					src: plugin.settings.videoproperties.videopath,
					srcApple: plugin.settings.videoproperties.videopath,
					ccUri: "",
					poster: plugin.settings.videoproperties.poster,
					width: plugin.settings.videoproperties.width,
               		height: plugin.settings.videoproperties.height,
					autoPlay: plugin.settings.videoproperties.autoplay,
					id: plugin.settings.videoproperties.videoplayerid			
			};
				
			starzVideoPlayer2.init(options,false);
		}
	    
	    /******************
		   CHECK QUIZ
		*******************/
	    plugin.checkQuiz = function(){
			var correct = plugin.answers[plugin.settings.quizanswer-1].val();
			
			var selected = $("."+plugin.settings.quizPopupClass ).find('input').filter(":checked").val();
			
			if( correct==selected ){
				if (plugin.settings.quizvideo) $('.'+plugin.settings.videoClass).html("");
				
				$("."+plugin.settings.buttonClass+(plugin.settings.items+2) ).show();
				
				$('.'+plugin.settings.errorClass).hide();
				plugin.current = plugin.settings.items+2;
				$.cookie('csrth',plugin.current);
				
				$("."+plugin.settings.buttonClass+plugin.current ).show();
				$('.'+plugin.settings.genericPopupClass).hide();
				
				$("."+plugin.settings.enterToWinPopup ).show();
				
			} else {
				$('.'+plugin.settings.errorClass).show();
			}
	    }
	    
	    /******************
		    START THE PARTY
		*******************/
	    plugin.init(options);
	    
		/******************
		    RETURN
		*******************/
	    return plugin;
    }
})(jQuery, window, document);

