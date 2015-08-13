
// TODO:   Injest jQuery if it doesn't exist ! https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js ??

var starzVideoPlayer2 = (function () {
 
 	var defaultHeight = 420;
 	var defaultWidth = 640;

    var options,
		forceNoFlash = false,
		forceHtml5 = false,
		isInitialized = false,
		hostname = "",
		isHtml5 = false,
        metadataLoaded = false,
        ageRestricted = false,
        trackingEnabled = true,
        embedEnabled = false,
        shareEnabled = false,
        footerEnabled = false,
        hasCampaignTracking = false,

        player = null,  // the DOM instance, NOT the jQuery instance!
        $player = null, // the jQuery instance!

        playing = false, // from flash
        html5IsPlaying = false, // from <video>

        wasPlaying = false,

        videoEmbedPath = "",
        videoViewPath = "",

        description = "",
        title = "",
        embedlink = "",

    // ageGate
        ageGateFailed = false,
        ageGatePassed = false,

    // omniture tracking
        pageName = "",
        videoFileName = "",
       	videoPosition,
		videoStreamLength = -1
        ;

    // load our own css
    var cssId = 'starzCCVideoPlayer';
    if (!document.getElementById(cssId)) {

        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = "/CssLib/starzCCVideoPlayer.css";
        link.media = 'all';

        head.appendChild(link);

        // zzz...
        // TODO: move the css into the <head> directly
    }

    /** **** public methods ***** */
    return {
        init: function (aOptions) {

            if (typeof (s) == "undefined") {
                trackingEnabled = false;
            }

            if (!aOptions) {
                options = {};
            } else {
                options = jQuery.extend({}, aOptions);
            }

            // get the hostname!
            var protocol = (("https:" == document.location.protocol) ? "https://" : "http://");

            hostname = protocol + location.hostname + '/';

            setPlayerDefaults(aOptions);

            // TODO: Remove this getScript stuff and put swfobject directly in the headers
            jQuery.getScript(hostname + "JsLib/swfobject.js", function () {

                //// TODO: Injest widevine if necessary...
                //jQuery.getScript(hostname + "JsLib/WidevineMediaOptimizer.js", function () {
                run();
                //}

            });

            isInitialized = true;
        },

        onJavaScriptBridgeCreated: function (playerId) {
            if (player == null) {
                player = document[playerId];
            }
        },

        getHostname: function () {
            return hostname;
        },

        showControls: function () {
            if (isHtml5) {
            	try { $player.attr("controls", "controls"); } catch (e) { };
            }
            else {
                try { player.showControls(); } catch (e) { };
            }
        },

        hideControls: function () {
            if (isHtml5) {
            	try { $player.removeAttr("controls"); } catch (e) { };
            }
            else {
                try { player.hideControls(); } catch (e) { };
            }
        },

        showVideo: function (aOptions) {
            metadataLoaded = false;
            showVideoInternal(aOptions);
        },

        isPlaying: function () {

            playing = false;

            // remember if the video is playing from either the flash or html5 player
            if (isHtml5) {
                return html5IsPlaying;
            }
            else {
                try { player.getIsPlaying("starzVideoPlayer2.isPlaying_Callback"); } catch (e) { };
            }
            // wait for the callback inline... isPlaying_Callback... ExternalInterface handles this for us :)

            return playing;
        },

        isPlaying_Callback: function (evt) {
            playing = evt;
        },

        tryPause: function () {

            // IDSTARZDOTCOM-3205 - video controls don't work with Gigya
            starzVideoPlayer2.hideControls();

            if (starzVideoPlayer2.isPlaying()) {
                starzVideoPlayer2.wasPlaying = true;
                starzVideoPlayer2.pause();
            }
            else {
                starzVideoPlayer2.wasPlaying = false;
            }
        },

        tryRestart: function () {

            // IDSTARZDOTCOM-3205 - video controls don't work with Gigya
            starzVideoPlayer2.showControls();

            // the video restarts only if it was previously playing
            if (starzVideoPlayer2.wasPlaying) {
                starzVideoPlayer2.play();
            }
        },

        play: function () {
            if (player) {
                if (isHtml5) {
                    try {
                        player.play();
                    } catch (e) { };
                }
                else {
                    try {
                        player.play2();
                    } catch (e) { };
                }
            }
        },

        pause: function () {
            if (player) {
                if (isHtml5) {
                    try {
                        player.pause();
                    } catch (e) { };
                }
                else {
                    try {
                        player.pause();
                    } catch (e) { };
                }
            }
        },

        stop: function () {

            if (player) {
                if (isHtml5) {
                    try {
                        player.pause();
                        player.currentTime = 0;
                    }
                    catch (e) { };
                }
                else {
                    try {
                        player.stop2();
                    } catch (e) { };
                }
            }
        },

        showShareFacebook: function () {
            shareFacebook();
        },

        showShareTwitter: function () {
            shareTwitter();
        }

        /* TODO!
        ,showShareGoogle: function() {
        shareGoogle();
        }
        */
    }

    /** **** private methods ***** */
    function setPlayerDefaults(tOptions) {

        if (tOptions.forceNoFlash != null) forceNoFlash = tOptions.forceNoFlash;
        if (tOptions.forceHtml5 != null) forceHtml5 = tOptions.forceHtml5;
        if (tOptions.ageRestricted != null) ageRestricted = options.ageRestricted = tOptions.ageRestricted;
        if (tOptions.videoEmbedPath != null) videoEmbedPath = options.videoEmbedPath = encodeURIComponent(tOptions.videoEmbedPath);
        if (tOptions.videoViewPath != null) videoViewPath = options.videoViewPath = encodeURIComponent(tOptions.videoViewPath);
        if (tOptions.description != null) description = options.description = encodeURIComponent(tOptions.description);
        if (tOptions.title != null) title = options.title = encodeURIComponent(tOptions.title);
        if (tOptions.embedLink != null) embedLink = options.embedLink = tOptions.embedLink;
        if (tOptions.trackingEnabled != null) trackingEnabled = options.trackingEnabled = tOptions.trackingEnabled;
        if (tOptions.shareEnabled != null) shareEnabled = options.shareEnabled = tOptions.shareEnabled;
        if (tOptions.embedEnabled != null) embedEnabled = options.embedEnabled = tOptions.embedEnabled;
        if (tOptions.footerEnabled != null) footerEnabled = options.footerEnabled = tOptions.footerEnabled;
        if (tOptions.autoPlay == null) options.autoPlay = false;
        if (tOptions.playerType == null) options.playerType = "extras";
        if (tOptions.skin == null) options.skin = "/SiteImagesLib/VideoSkins/Sleek.xml";
        if (tOptions.src == null) options.src = "";
        if (tOptions.srcApple == null) options.srcApple = "";
        if (tOptions.width == null) options.width = defaultWidth;
        if (tOptions.height == null) options.height = defaultHeight;
        if (tOptions.id == null) options.id = "StarzVideoPlayer";
        if (tOptions.fallbackId == null) options.fallbackId = "StarzVideoPlayerFallback";

        options.javascriptCallbackFunction = "starzVideoPlayer2.onJavaScriptBridgeCreated";
        
        // STARCOMI-8
        if( footerEnabled == false )
        { 
        	shareEnabled = false; 
        	embedEnabled = false; 
        	
        	options.shareEnabled = false;
        	options.embedEnabled = false;
    	}
    }

    function updatePlayerOptions(tOptions) {

        if (tOptions.autoPlay != null) options.autoPlay = tOptions.autoPlay;
        if (tOptions.src != null) options.src = tOptions.src;
        if (tOptions.srcApple != null) options.srcApple = tOptions.srcApple;
        if (tOptions.poster != null) options.poster = tOptions.poster;
        if (tOptions.ccUri != null) options.ccUri = tOptions.ccUri;
        if (tOptions.ageRestricted != null) ageRestricted = options.ageRestricted = tOptions.ageRestricted;
        if (tOptions.videoEmbedPath != null) videoEmbedPath = options.videoEmbedPath = encodeURIComponent(tOptions.videoEmbedPath);
        if (tOptions.videoViewPath != null) videoViewPath = options.videoViewPath = encodeURIComponent(tOptions.videoViewPath);
        if (tOptions.description != null) description = options.description = encodeURIComponent(tOptions.description);
        if (tOptions.title != null) title = options.title = encodeURIComponent(tOptions.title);
        if (tOptions.embedLink != null) embedLink = options.embedLink = tOptions.embedLink;
        if (tOptions.trackingEnabled != null) trackingEnabled = options.trackingEnabled = tOptions.trackingEnabled;
        if (tOptions.width != null) options.width = tOptions.width;
        if (tOptions.height != null) options.height = tOptions.height;
        if (tOptions.width == 0) options.width = defaultWidth;
        if (tOptions.height == 0) options.height = defaultHeight;
        if(tOptions.shareEnabled == null){tOptions.shareEnabled=false};
        if(tOptions.embedEnabled == null){tOptions.embedEnabled=false};
        if(tOptions.footerEnabled == null){tOptions.footerEnabled=false};
        
        shareEnabled = options.shareEnabled = tOptions.shareEnabled;
        embedEnabled = options.embedEnabled = tOptions.embedEnabled;
        footerEnabled = options.footerEnabled = tOptions.footerEnabled;
        
        // STARCOMI-8
        if( footerEnabled == false )
        { 
        	shareEnabled = false; 
        	embedEnabled = false; 
        	
        	options.shareEnabled = false;
        	options.embedEnabled = false;
    	}
    }

    function showAgeGateDialog() {
        var tPlayerWrapper = jQuery("#" + options.id);

        var tWidth = tPlayerWrapper.width();
        var tHeight = tPlayerWrapper.height();

        var tPreAgeGate = jQuery("#preAgeGate");

        // hide the roundPlayButton...
        var tPlayButton = jQuery(".roundPlayButton2");
        tPlayButton.remove();

        // show the dialog
        var tDialog = "<div id='ageGate' style='width:" + tWidth + "px; height:" + tHeight + "px;'>";

        var tWarningWidth = 97;
        var tWarningHeight = 16;

        var tAgeGateHeight = 162;

        var tWarningTop = tHeight / 2 - tWarningHeight / 2 - tAgeGateHeight / 2;
        var tWarningLeft = tWidth / 2 - tWarningWidth / 2;

        if (isIE()) tWarningLeft = 0;


        tDialog += "<div class='ageGateWarning' style='margin-left:" + tWarningLeft + "px; margin-top:" + tWarningTop + "px;' ><span></span></div>";

        tDialog += "<span class='ageGateText' >This Program contains mature content.<br/><br/>Please enter your date of birth:</span>";

        tDialog += "<br/><div class='ageGateForm'>";

        tDialog += "<select id='month' ></select><span>MM</span>";
        tDialog += "<select id='day' ></select><span>DD</span>";
        tDialog += "<select id='year' ></select><span>YYYY</span>";

        tDialog += "</div>";

        var tSubmitWidth = 75;
        var tSubmitHeight = 20;

        var tSubmitTop = 0;
        var tSubmitLeft = tWidth / 2 - tSubmitWidth / 2;

        if (isIE()) tSubmitLeft = 0;

        tDialog += "<br/><div class='ageGateSubmit2' style='margin-left:" + tSubmitLeft + "px; margin-top:" + tSubmitTop + "px;'><span></span></div>";

        tDialog += "</div>"; // end ageGate

        tPreAgeGate.after(tDialog);

        var i;
        var $monthSelect = jQuery("#ageGate #month");
        for (i = 1; i <= 12; i++) {
            $monthSelect.append("<option value='" + i + "'>" + i + "</option>");
        }

        var $daySelect = jQuery("#ageGate #day");
        for (i = 1; i <= 31; i++) {
            $daySelect.append("<option value='" + i + "'>" + i + "</option>");
        }

        var d = new Date();
        var year = d.getFullYear();
        var $yearSelect = jQuery("#ageGate #year");
        for (i = year; i >= year - 100; i--) {
            $yearSelect.append("<option value='" + i + "'>" + i + "</option>");
        }


        // wait for the user to select the age and click submit...\
        var tSubmitBtn = jQuery(".ageGateSubmit2");
        tSubmitBtn.click(function () {

            var isValid = false;

            var yearVal = $yearSelect.val();
            var dayVal = $daySelect.val();
            var monthVal = $monthSelect.val();

            var month = parseInt(monthVal); // month is a zero-based array
            var day = parseInt(dayVal);
            var year = parseInt(yearVal);

            var birthday = day + "/" + month + "/" + year;

            // check if the date exists...
            isValid = isValidDate(birthday);

            if (!isValid) {
                // if they fail, show the "sorry" screen because they entered a birthday that doesn't exist 
                showAgeGateFail();
                return;
            }

            var today = new Date();
            birthday = new Date(year, (month - 1), day);
            var delta = today.getTime() - birthday.getTime();

            // the date is 'technically' valid, do some math to see if they are 18 years old!
            var eighteen = 1000 * 60 * 60 * 24 * 365 * 18;
            if (delta < eighteen) {
                isValid = false;
            }

            if (isValid) {

                ageGatePassed = true;

                // if they pass, remove the poster and dialog always
                jQuery("#preAgeGate").remove();
                jQuery("#ageGate").remove();

                // force autoplay!
                options.autoPlay = true;

                // and then, depending on the playerType...
                if (isHtml5) {
                    createHtml5Video();
                }
                else {
                    try { player.showVideo(options); } catch (e) { };
                }
            }
            else {
                // if they fail, show the "sorry" screen
                showAgeGateFail();
            }
        });
    }

    function isValidDate(s) {
        var bits = s.split('/');
        var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
        return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
    }

    function showAgeGateFail() {

        ageGateFailed = true;

        jQuery("#ageGate").remove();

        var tPlayerWrapper = jQuery("#" + options.id);
        var tWidth = tPlayerWrapper.width();
        var tHeight = tPlayerWrapper.height();

        var tWarningHeight = 16;
        var tAgeGateHeight = 162;

        var tTop = tHeight / 2 - tWarningHeight / 2 - 20;

        // replace the dialog text with new sorry text

        var tPreAgeGate = jQuery("#preAgeGate");
        // show the dialog
        var tDialog = "<div id='ageGate' style='width:" + tWidth + "px; height:" + tHeight + "px;'>";

        tDialog += "<span class='ageGateText' style='width:280px; display:inline-block; margin-top:" + tTop + "px;'>We're sorry you do not meet the minimum age requirement to view this content.</span>";

        tDialog += "</div>"; // end ageGate

        tPreAgeGate.after(tDialog);
    }

    function showAgeGate() {

        if (ageGatePassed) {
            try {
                if (isHtml5) {
                    createHtml5Video();
                }
                else {
                    player.showVideo(options);
                }
            } catch (e) { };
            return;
        }

        starzVideoPlayer2.stop();

        // always show the posterImage AS A SEPARATE DIV above the playerWrapper
        // and the footer description/embed/share scenario

        var tPlayerWrapper = jQuery("#" + options.id);

        var tWidth = tPlayerWrapper.width();
        var tHeight = tPlayerWrapper.height();

        var tPreAgeGate = "<div id='preAgeGate' style='width:" + tWidth + "px; height:" + tHeight + "px; ' ><img src=" + options.poster + " style='width:100%;height:100%;' /></div>";

        tPlayerWrapper.before(tPreAgeGate);

        if (ageGateFailed) {
            // if the ageGate has already failed...
            showAgeGateFail();
        }
        else {
            // the ageGate has not failed, so figure out what's next...

            // if the autoPlay feature is requested 
            if (options.autoPlay) {
                // show the dialog
                showAgeGateDialog();
            }
            else {
                // wait for the user to click the image or the roundPlayButton... then show the dialog

                //playButton is 150x150
                var tPlayButtonHeight = 150;
                var tPlayButtonWidth = 150;

                var tPlayButtonTop = tHeight / 2 - tPlayButtonHeight / 2;
                var tPlayButtonLeft = tWidth / 2 - tPlayButtonWidth / 2;


                var tPlayButton = "<div class='roundPlayButton2' style='margin-top:" + tPlayButtonTop + "px; margin-left:" + tPlayButtonLeft + "px;' />";

                var tPreAgeGate = jQuery("#preAgeGate");

                tPreAgeGate.after(tPlayButton);

                var tPlayButton = jQuery(".roundPlayButton2");

                tPlayButton.click(function () {
                    showAgeGateDialog();
                });

                tPreAgeGate.click(function () {
                    showAgeGateDialog();
                });
            }
        }
    }

    function updateFooter() 
    {    
    	var tFooter = jQuery("#VideoDescriptionWrapper");
    	
    	// STARCOMI-8
    	if(options.footerEnabled) 
    	{
    		tFooter.show();    		
    		
			var tTitle = decodeURIComponent(options.title);
	        var tDescription = decodeURIComponent(options.description);
	        
	        // IIDOSMF-35 :	show either the description, or "Title - Description"
	        var tFooterCopy = (options.playerType == "embedded") ? (tTitle + " - " + tDescription) : tDescription;
	                
	        jQuery("#VideoDescCopy span").html(tFooterCopy);
	
	        var tShareDiv = jQuery("#VideoSocialShare");
	        if (options.shareEnabled && options.src != "") {
	            tShareDiv.show();
	        }
	        else {
	            tShareDiv.hide();
	        }
    	}
    	else
		{
    		tFooter.hide();
		}
    }

    function shareFacebook() {
        var tUrl = options.videoViewPath;
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + tUrl, "FACEBOOK_SHARE_WINDOW", "width=700,height=420,left=0,top=0");
    }

    function shareTwitter() {
        var tUrl = options.videoViewPath;
        var tTitle = decodeURIComponent(options.title);
        var tText = tTitle + " " + options.embedLink;
        if (tText.length > 140) {
            tText = options.embedLink;
        }
        window.open("https://twitter.com/intent/tweet?original_referer=" + tUrl + "&text=" + tText, "TWITTER_SHARE_WINDOW", "width=700,height=420,left=0,top=0");
    }

    function showVideoInternal(aOptions) {

        // hide any previous ageGate experience... just in case :)
        jQuery("#preAgeGate").remove();
        jQuery(".roundPlayButton2").remove();
        jQuery("#ageGate").remove();

        // remove the old html5 video, but NOT the flash video :)
        if (isHtml5) { jQuery("#" + options.id).html(""); }

        if (!isInitialized) {
            starzVideoPlayer2.init(aOptions);
        }
        else {

            updatePlayerOptions(aOptions);

            // TODO: support the "Title" of the video here instead of crashScreeningRoom2.js !
            // updateHeader();

            if (isHtml5) {
                showHtml5VideoPlayer();
            } else {
                if (options.ageRestricted) {
                    showAgeGate();
                }
                else {
                    try { player.showVideo(options); } catch (e) { };
                }
            }

            updateFooter();
        }
    }

    function run() {

        var skipFlash = false;

        if ((typeof (swfobject) == "undefined")
				|| forceHtml5
				|| isApple()
		) {
            skipFlash = true;
        }

        if (forceNoFlash) {
            skipFlash = false;
        }

        setupPlayerWrapper();

        if (options.playerType == "embedded") {
            setupEmbeddedFrame();
        }

        if (!skipFlash) {
            showFlashVideoPlayer();
        } else {
            showHtml5VideoPlayer();
        }
    };


    function setupPlayerWrapper() {

        var tPlayerWrapper = jQuery("#" + options.id);

        // TODO: add the headerWrapper before the player

        // TODO: add the footerWrapper after the player
        var tVideoDescriptionWrapper = "<div id='VideoDescriptionWrapper'><div id='VideoDescCopy'><span></span></div><div id='VideoSocialShare'><div id='shareBtnFacebook' class='socialBtn'></div><div id='shareBtnTwitter' class='socialBtn'></div></div></div>";
        tPlayerWrapper.after(tVideoDescriptionWrapper);
        
        if(options.playerType == "embedded") {
        	// if the CMS width is larger than the frame width, we must respect the frame width
        	var tWidth = getFrameTotalWidth();
        	var tHeight = getFrameTotalHeight();
        	if( options.width > tWidth || options.height > tHeight )
        	{
        		options.width = tWidth;
        		options.height = tHeight;
        	}
        }
           

        jQuery("#VideoDescriptionWrapper").width(options.width);

        jQuery("#shareBtnFacebook").click(function () {
            shareFacebook();
        });

        jQuery("#shareBtnTwitter").click(function () {
            shareTwitter();
        });

        updateFooter();
    };
    
    function setupEmbeddedFrame() {

        var tPage = jQuery(".page_videoEmbed");
        var tDescriptionWrapper = jQuery("#VideoDescriptionWrapper");
        var tPlayerWrapper = jQuery("#" + options.id);

        var tWidth = getFrameTotalWidth();
        var tHeight = getFrameTotalHeight();

        tPage.css("width", tWidth + "px");
        tPage.css("height", tHeight + "px");

        tPlayerWrapper.css("width", tWidth + "px");
        tPlayerWrapper.css("height", (tHeight - tDescriptionWrapper.height()) + "px"); // or subtract 60px directly...?

    };


    /***************************************************************************
    * showFlashVideoPlayer
    * 
    * this method uses swfobject to embed the Flash video player into the targetDiv
    */
    function showFlashVideoPlayer() {

        if (forceNoFlash) {
            showFallbackImage();
            return;
        }

        if (typeof (widevine) != "undefined") { widevine.init(); }

        var params = {
            allowFullScreen: "true",
            wmode: "direct"
        };

        params = {
            allowFullScreen: "true",
            allowScriptAccess: "always",
            bgcolor: "#000000",
            menu: "false",
            //wmode: "direct",
            wmode: "transparent",
            swLiveConnect: "true"
        };

        var attributes = {
            id: options.id,
            name: options.id
        };

        var tPlayerWrapper = jQuery("#" + options.id);
        var tWrapperWidth = tPlayerWrapper.width();
        var tWrapperHeight = tPlayerWrapper.height();

        swfobject.embedSWF(hostname + "SwfLib/StarzCCVideoPlayer.swf", options.id,
            tWrapperWidth, tWrapperHeight,
            "11.0", false, options, params, attributes, function (e) { if (!e.success) showFallbackImage(); });

        tPlayerWrapper = jQuery("#" + options.id);
        tPlayerWrapper.css("background-color", "#000000");

        if (options.ageRestricted) {
            showAgeGate();
        }

    };

    function getFrameTotalWidth() {
        var tWidth = options.width;
        if (options.playerType == "embedded") {
            if (!utilities.isIE()) {
                tWidth = this.innerWidth;
            }
            else {
                tWidth = this.document.documentElement.clientWidth;
            }
        }
        return tWidth;
    }

    function getFrameTotalHeight() {
        var tHeight = options.height;
        if (options.playerType == "embedded") {
            if (!utilities.isIE()) {
                tHeight = this.innerHeight;
            }
            else {
                tHeight = this.document.documentElement.clientHeight;
            }
        }
        return tHeight;
    }


    /***************************************************************************
    * showHtml5VideoPlayer
    * 
    * This method enforces the starz business rule to only show the html5 video
    * player if we detect an iOS device.
    */
    function showHtml5VideoPlayer() {
        isHtml5 = true;

        if (trackingEnabled) setupHtml5MediaTracking();

        if (options.ageRestricted) {
            showAgeGate();
        }
        else {
            createHtml5Video();
        }
    };

    /***************************************************************************
    * showFallbackImage
    */
    function showFallbackImage() {

        var tFallback = jQuery("#" + options.fallbackId);
        tFallback.show();

        if (options.playerType == "embedded") {
            var tWrapper = jQuery("#VideoDescriptionWrapper");
            
            tWidth = this.innerWidth;
            tHeight = this.innerHeight - tWrapper.height() - 40;

            tFallback.css("text-align", "center");
            //tFallback.css("vertical-align","middle");
            tFallback.height(tHeight);

            var tTargetDiv = jQuery("#" + options.id);
            tTargetDiv.width(tWidth);
            tTargetDiv.height(tHeight);
        }

    };

    /***
    * createHtml5Video
    */
    function createHtml5Video() {

        var tTargetDiv = jQuery("#" + options.id);
        tTargetDiv.css("background-color", "#000000");

        var tWidth = tTargetDiv.width();
        var tHeight = tTargetDiv.height();

        var tHTML = getVideoPlayerHTML(tWidth, tHeight);

        tTargetDiv.html(tHTML);

        player = document.getElementsByTagName("video")[0]; // DOM-instance, not jQuery instance
        $player = jQuery("video");

        // init omniture for html5 media tracking  
        bindHtml5VideoEvents();

        if (options.autoPlay) {
            if (isHtml5) {

                // TRY REALLY HARD to autoplay on the iPad :)
                $player.attr("autoplay", "autoplay");
                $player.load();
            }

            starzVideoPlayer2.play();
        }
        else {
            if (isHtml5) {
                $player.removeAttr("autoplay");
            }
        }
    }

    /***
    * getVideoPlayerHTML
    *
    * Gets the HTML for the actual video player and controls
    */
    function getVideoPlayerHTML(aWidth, aHeight) {

        var tSrc = options.srcApple;
        var tPoster = options.poster;

        var tHTML = "";

        if ((tSrc == "") || (tSrc == undefined)) {
            tHtml = getVideoPlayerErrorHTML();
        } else {

            var tAtts = "width='" + aWidth + "' height='" + aHeight + "' controls='controls' ";
            tAtts += "id='iOS_" + options.id + "' ";
            tAtts += "poster='" + tPoster + "' ";
            tAtts += "x-webkit-airplay='deny' ";
            tAtts += "preload='" + "metadata' "; // auto|metadata|none

            tAtts += "style='-webkit-transform-style: preserve-3d' ";

            tHTML = "<video " + tAtts + ">";

            tHTML += "<source src='" + tSrc + "' type='video/mp4' />";

            tHTML += "</video>";

        }

        //tHTML = "<div style='background-color:#ff0000; height:340px' >hello world</div>";

        return tHTML;
    }

    /***
    * getVideoPlayerErrorHTML
    *
    * Gets the HTML for the FAILED video experience
    */
    function getVideoPlayerErrorHTML() {

        var tHTML = "<div class='html5UnavailOuter'><div class='html5UnavailMiddle'><div class='html5UnavailInner'>";
        tHTML += "<div class='html5Unavail'><div class='html5Unavail_left'></div><div class='html5Unavail_right'> We're Sorry. This video is no longer available or is not accessible in your country.";
        tHTML += "</br></br> Please select another video.</div></div>";
        tHTML += "</div></div></div>";
        //var tHTML = "We're Sorry. This video is no longer available or is not accessible in your country.  </br></br> Please select another video.";

        return tHTML;
    }

    /***
    * bindHtml5VideoEvents
    */
    function bindHtml5VideoEvents() {

        // comment any of these events out to stop binding to them...
        var tEvents = "";
        tEvents += "play ";
        tEvents += "pause ";
        tEvents += "progress ";
        tEvents += "error ";
        tEvents += "timeupdate ";
        tEvents += "ended ";
        tEvents += "abort ";
        tEvents += "empty ";
        tEvents += "emptied ";
        tEvents += "waiting ";
        tEvents += "loadedmetadata ";

        $player.on(tEvents, function (e) { onVideoEvent(e); });
    }

    //======================
    // Event Listeners
    //======================

    /***
    * onVideoEvent
    */
    function onVideoEvent(e) {
        // NOTES: typical html5 video playback event sequence is as follows...

        //if (e.type != "timeupdate") console.log("onVideoEvent: " + e.type);

        /*
        == iOS - iPad ==

        play
        waiting
        loadedmetadata
        timeupdate
        progress [progress...]
        timeupdate [timeupdate...]
        ... [user interaction - pause,play,etc]
        pause
        ended


        == Chrome ==

        emptied
        loadedmetadata
        play
        progress
        timeupdate
        ... [user interaction - pause,play,etc]
        pause
        ended

        */

        try {

            switch (e.type) {
                case "play":

                    html5IsPlaying = true;

                    if (trackingEnabled && metadataLoaded) { trackVideoStart(); }
                    break;

                case "pause":

                    html5IsPlaying = false;

                    if (trackingEnabled) { trackVideoPause(); }
                    break;

                case "progress":

                    break;

                case "error":
                    html5IsPlaying = false;
                    break;

                case "timeupdate":

                    break;

                case "ended":

                    html5IsPlaying = false;

                    if (trackingEnabled) { trackVideoEnd(); }
                    break;

                case "abort":
                    html5IsPlaying = false;
                    break;

                case "empty":

                    break;

                case "emptied":

                    break;

                case "waiting":

                    break;

                case "loadedmetadata":

                    metadataLoaded = true;

                    videoFileName = $player.find("source").attr("src").split("/").pop();
                    videoStreamLength = player.duration;

                    // in the case of iPad playback, the metadata is loaded AFTER the 'play' event fires... see NOTES above for playback event sequence
                    // DO NOT REMOVE THIS LINE!!
                    if (isApple()) {
                        trackVideoStart();
                    }

                    break;
            }
        }
        catch (e) {
            //nothing
        }
    }

    /***
    * currentVideoTime
    */
    function currentVideoTime() {
        return player.currentTime;
    }

    //======================
    // Video Events
    //====================== 

    /***
    * correlateMediaPlaybackEvents
    *
    * used during normal media playback for data correlation in omniture siteCatalyst15
    *
    *   sets/correlates prop19, evar 20, and evar21
    */
    function correlateMediaPlaybackEvents() {
        s.prop19 = videoFileName;

        s.eVar20 = omniturePlayerName();
        s.eVar21 = videoFileName;
    }



    /***
    * trackVideoPageName
    *
    * TODO
    */
    function trackVideoPageName() {

        this.flushParams();

        s.eVar20 = omniturePlayerName();
        s.eVar21 = videoFileName;
        s.prop20 = pageName + "::" + videoFileName;

        s.track();
    }

    /***
    * trackVideoStart
    *
    * Load: Call Media.open and Media.play
    */
    function trackVideoStart() {

        flushParams();
        correlateMediaPlaybackEvents();

        s.Media.open(videoFileName, videoStreamLength, omniturePlayerName());
        s.Media.play(videoFileName, 0, 0);
    }

    /***
    * trackVideoEnd
    *
    * End: Call Media.stop, then Media.close.
    */
    function trackVideoEnd() {

        flushParams();
        correlateMediaPlaybackEvents();
        s.Media.stop(videoFileName, videoStreamLength);
        s.Media.close(videoFileName);
    }

    /***
    * trackVideoPause
    *
    * TODO
    */
    function trackVideoPause() {

        flushParams();
        correlateMediaPlaybackEvents();
        videoPosition = currentVideoTime();
        s.Media.stop(videoFileName, videoPosition);
    }

    /***
    * flushParams
    *
    * reset all params before the next call to s.Media
    */
    function flushParams() {

        s.events = "";
        s.campaign = "";
        s.linkTrackVars = "";
        s.linkTrackEvents = "";
        s.Media.trackVars = "";
        s.Media.trackEvents = "";

        s.eVar1 = "";
        s.eVar2 = "";
        s.eVar3 = "";
        s.eVar4 = "";
        s.eVar5 = "";
        s.eVar6 = "";
        s.eVar7 = "";
        s.eVar8 = "";
        s.eVar9 = "";
        s.eVar10 = "";
        s.eVar11 = "";
        s.eVar12 = "";
        s.eVar13 = "";
        s.eVar14 = "";
        s.eVar15 = "";
        s.eVar16 = "";
        s.eVar17 = "";
        s.eVar18 = "";
        s.eVar19 = "";
        s.eVar20 = "";
        s.eVar21 = "";
        s.eVar22 = "";
        s.eVar23 = "";

        s.hier1 = "";
        s.hier3 = "";

        s.prop1 = "";
        s.prop2 = "";
        s.prop3 = "";
        s.prop4 = "";
        s.prop5 = "";
        s.prop6 = "";
        s.prop7 = "";
        s.prop8 = "";
        s.prop9 = "";
        s.prop10 = "";
        s.prop11 = "";
        s.prop12 = "";
        s.prop13 = "";
        s.prop14 = "";
        s.prop15 = "";
        s.prop16 = "";
        s.prop17 = "";
        s.prop18 = "";
        s.prop19 = "";
        s.prop20 = "";
    }

    function setupHtml5MediaTracking() {

        s.debugTracking = false; // true;

        s.Media.trackUsingContextData = true;
        s.Media.contextDataMapping = {
            "a.media.name": "eVar21,prop19",
            "a.media.segment": "eVar22",
            "a.contentType": "eVar23",
            "a.media.timePlayed": "event8",
            "a.media.view": "event9",
            "a.media.segmentView": "event11",
            "a.media.complete": "event39",
            "a.media.milestones": {
                25: "event36",
                50: "event37",
                75: "event38",
                100: "event39"
            }
        };

        s.Media.autoTrack = false; // we are NOT a supported player for automatic tracking, so we MUST use media.open/play/stop/close			
        //this.media.autoTrackNetStreams = true;	// don't know if this is correct...			
        s.Media.playerName = omniturePlayerName();
        //this.media.trackSeconds
        s.Media.trackMilestones = "25,50,75,100";
        s.Media.segmentByMilestones = true; // You can use segmentByMilestones to have the media module create segments automatically based on your milestones.
        //this.media.trackVars
        //this.media.trackEvents        
    }

    function omniturePlayerName() {
        var tStr = "html5_";
        if (isApple()) tStr = "iOS_";
        tStr += options.playerType + "_CC";
        return tStr;
    }

    /***************************************************************************
    * isApple
    */
    function isApple() {
        var tRet = false;
        if (navigator.userAgent.match(/iPad/i) != null)
            tRet = true;
        if (navigator.userAgent.match(/iPhone/i) != null)
            tRet = true;
        return tRet;
    };

    /***************************************************************************
    * isIE
    */
    function isIE() {
        var isIE = (jQuery.browser.msie);
        return isIE;
    };
})();
