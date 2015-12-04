//These methods are called by the Brightcove video embed object:
//
//<param name="templateLoadHandler" value="BC.VideoPlayer.onTemplateLoad" />
//<param name="templateReadyHandler" value="BC.VideoPlayer.onTemplateReady" />

var BC = BC || {};

(function ($, BC) {
	BC.VideoPlayer = (function(){	
		var VIDEO = "templates/videothumb.html";
		
		/***************
		TEMPLATE LOAD
		****************/
		function onTemplateLoad(id){
			BC.player = brightcove.api.getExperience(id);
			BC.APIModules = brightcove.api.modules.APIModules;
			BC.adEvent = brightcove.api.events.AdEvent;
		    BC.captionsEvent = brightcove.api.events.CaptionsEvent;
		    BC.contentEvent = brightcove.api.events.ContentEvent;
		    BC.cuePointEvent = brightcove.api.events.CuePointEvent;
			BC.mediaEvent = brightcove.api.events.MediaEvent;
		}
		
		/***************
		TEMPLATE READY
		****************/
		function onTemplateReady(){
			BC.videoPlayer = BC.player.getModule(BC.APIModules.VIDEO_PLAYER);
		
		    //Playlist data Instance
			BC.contentModule = BC.player.getModule(BC.APIModules.CONTENT);
		    
		    BC.contentModule.getPlaylistByID($('.videolist').attr('pl'), function(jsonData){
			   var obj = {
				   "videos": []
				}
				
				if ( jsonData.videos.length > 0 ){
					$.each(jsonData.videos, function(i, data){
						data.eid = i+1;
						obj.videos.push(data);
				   	});
				   
				   $.get(VIDEO, function(template){
						var html = Mustache.to_html(template, obj);
						$('.videolist').html(html);
						
						$('.videothumb').click(switchVideo);
						
						BC.currentVideo = $('.videothumb').eq(0).attr("vid");
						if (BC.currentVideo!=undefined) BC.videoPlayer.cueVideoByID(BC.currentVideo);
						
						STARZ.FYC.resize();
					});
				} else{
					$('.loader').hide();
					$('.listerror').show();
				}
			});
		}		
		
		/***************
		SWITCH VIDEO
		****************/
		function switchVideo(){
			$('.popup').hide();
			
			BC.currentVideo = $(this).attr("vid");
			BC.videoPlayer.loadVideoByID(BC.currentVideo);
		}
		
		/***************
		PUBLIC
		****************/
		return {
			onTemplateLoad: onTemplateLoad,
			onTemplateReady: onTemplateReady
		}
	})();
	
})(jQuery,BC);