var WidevinePlugin;
var widevine = function() {

    var debug = false;
    var debug_flags = "";
   
   
    // Version of plugin pointed by the installer

    var version ="5.0.0.000";
    var ie_version ="5,0,0,000";

    // Set the head end server 

    var signon_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
    var log_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
    var emm_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";

    // Set the portal

    var portal = "widevine";

    function doDetect( type, value  ) {
        return eval( 'navigator.' + type + '.toLowerCase().indexOf("' + value + '") != -1' );
    }


    function detectMac()     { return doDetect( "platform", "mac" );}
    function detectWin32()   { return doDetect( "platform", "win32" );}
    function detectIE()      { return doDetect( "userAgent", "msie" ); }
    function detectFirefox() { return doDetect( "userAgent", "firefox" ); }
    function detectSafari()  { return doDetect( "userAgent", "safari" ); }
    function detectChrome()  { return doDetect( "userAgent", "chrome" ); }

    function detectVistaOrWindows7()   { return doDetect( "userAgent", "windows nt 6" ); }

    function getCookie(c_name)
    {
        if (document.cookie.length>0)
            {
                var c_start=document.cookie.indexOf(c_name + "=")
                    if (c_start!=-1)
                        {
                            c_start=c_start + c_name.length+1;
                            c_end=document.cookie.indexOf(";",c_start);
                            if (c_end==-1) c_end=document.cookie.length;
                            return unescape(document.cookie.substring(c_start,c_end))
                        }
            }
        return ""
    }

    function setCookie(c_name,value,expireseconds)
    {
        var exdate=new Date();
        exdate.setSeconds(exdate.getSeconds()+expireseconds);
        document.cookie=c_name+ "=" +escape(value)+
            ((expireseconds==null) ? "" : ";expires="+exdate.toGMTString())
    }


    /////////////////////////////////////////////////////////////////////////////////
    // Start debug output section
    // Used to write debug information to the screen if debug variable is set to true.
    // Only used by test page
    /////////////////////////////////////////////////////////////////////////////////

    function writeDebugCell( name, bold ) {
        if ( bold ) {
            return "<td><b>" + name + "</b></td>";
        } else {
            return "<td><s>" + name + "</s></td>";
        }
    }
    
    function writeDebugMimeArray( values ){
        var result = "";
        for ( value in values ) {
            if ( values[value] ) {
                result += "<td><table><tr><td>" + values[value].description + "</td></tr><tr><td>"+values[value].type+"</td></tr><tr><td>"+values[value].enabledPlugin+"</td></tr></table></td>";
            }
        }
        return result;
    }
    
    function DebugInfo() {
        var result = "";
        result += "<table border=1>";
            
        result += "<tr><td>Platform</td>";
        result += writeDebugCell( "Macintosh", detectMac() );
        result += writeDebugCell( "Windows", detectWin32() );
        if ( detectWin32() ) {
            result += writeDebugCell( "Vista/Windows7", detectVistaOrWindows7() );
        }
        result += "</tr>";
            
        result += "<tr><td>Browser</td>";
        result += writeDebugCell( "IE", detectIE() );
        result += writeDebugCell( "Firefox", detectFirefox() );
        result += writeDebugCell( "Safari", detectSafari() );
        result += writeDebugCell( "Chrome", detectChrome() );
        result += "</tr>";
            
        if ( !detectIE() ) {
            result += "<tr><td>MIME types</td>";
            result += writeDebugMimeArray( navigator.mimeTypes );
            result += "</tr>";
        }

        result += "<tr><td>Installed</td><td>";
        if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {
            var aWidevinePlugin = document.getElementById('WidevinePlugin');
            if ( aWidevinePlugin ) {
                result += aWidevinePlugin.GetVersion();
            } else {
                result += "MIME type exists but could not load plugin";
            }
        } else {
            result += "MIME Type Not Found";
        }
        result += "</td></tr>";
            
        result += "</table>";
        return result;
    }
   
    /////////////////////////////////////////////////////////////////////////////////
    // End debug output section
    // Used to write debug information to the screen if debug variable is set to true.
    // Only used by test page
    /////////////////////////////////////////////////////////////////////////////////


    	////////////////////////////////////////////
    	// AddDiv
    	//
    	// Adds a div to the html page
    	// html: html to place in the div
    	////////////////////////////////////////////
    	function AddDiv( html ) {
        	var div = document.createElement( "div" );
        	document.body.appendChild( div );
        	div.innerHTML = html;
        	return div;
    	}

   

	////////////////////////////////////////////
        // EmbedText
        //
        // Returns embed or object tag for the initializing WidevineMediaOptimizer plugin
        ////////////////////////////////////////////
	function EmbedText() {
        	if ( detectIE() ) {
	    		if (pluginInstalledIE()){	 
				return '<object id="WidevinePlugin" classid=CLSID:defa762b-ebc6-4ce2-a48c-32b232aac64d ' +
                    				'hidden=true style="display:none" height="0" width="0">' +
                    				'<param name="default_url" value="' + signon_url + '">' +
                    				'<param name="emm_url" value="' + emm_url + '">' +
                    				'<param name="log_url" value="' + log_url + '">' +
                    				'<param name="portal" value="' + portal + '">' +
                                                '<param name="user_agent" value="' + navigator.userAgent + '">' +
                    				'</object>' ;
                     	}
        	} else {
            		if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {
				setCookie("FirefoxDisabledCheck", "");
                		return '<embed id="WidevinePlugin" type="application/x-widevinemediaoptimizer" default_url="' + signon_url +
                        		'" emm_url="' + emm_url +
                        		'" log_url="' + log_url +
                        		'" portal="' + portal +
                        		'" height="0" width="0' +
                                        '" user_agent="' + navigator.userAgent +
                        		'">' ;
            		}
        	}
		return showDownloadPageText();
    	}

   	////////////////////////////////////////////
        // showDownloadPageText
        //
        // Returns button to download page
        ////////////////////////////////////////////
	function showDownloadPageText(){
		return 	"<div style='position: absolute; z-index: 10; width: 100%; height: 400px; color: white'>" +
			"<div align='center'>" +
			"<h2>Widevine Video Optimizer is not installed</h2>" +
			"<input type='button' value='Get Video Optimizer' OnClick='javascript: window.open(\"http://tools.google.com/dlpage/widevine\");'>" +
			"</div>" +
			"</div>"
	}

	////////////////////////////////////////////
        // pluginInstalledIE
        //
        // Returns true is the plugin is installed
        ////////////////////////////////////////////
        function pluginInstalledIE(){
                try{
                        var o = new ActiveXObject("npwidevinemediaoptimizer.WidevineMediaTransformerPlugin");
			o = null;
                       	return true;

                }catch(e){
                        return false;
                }
        }


    return {
   	pluginInstalledIE: function(){
		return pluginInstalledIE();
	}
	, 
	flashVersion:function(){
		return current_ver;
	}
	,
    
    init:function() {
	   
	   try{
             	var major_ver = 0;
            	var version = GetSwfVer();
           	if(version.indexOf(" ") != -1){
              		version = version.split(" ")[1];
            	}else if (version.indexOf("=") != -1){
			version = version.split(" ")[1];
		}
        	current_ver = version;

          	if(version.indexOf(",") != -1){
                	major_ver = parseInt(version.split(",")[0]);
             	}else if(version.indexOf(".") != -1){
                     	major_ver = parseInt(version.split(".")[0]);
            	}
           	if (major_ver < 10){
                	alert("Please upgrade to Flash 10+ to continue. Current version: " + current_ver);
			return "";
          	}
     	    }catch(e){
		current_ver = "";
           	alert("Flash not detected. Please install Flash to continue.");
		return "";
            }



	    try {

		var div = AddDiv( EmbedText() );

		if ( debug ) {
		    	AddDiv( DebugInfo() );
		}

	    }
	    catch(e) {
		alert("widevine.init exception: " + e.message);
	    }
	}
    };
}();

function WVGetURL( arg ) {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
      	try {
        	transformedUrl = aWidevinePlugin.Translate( arg );
      	}
     	catch (err) {
      		return "Error calling Translate: " + err.description;
     	}
       	return transformedUrl;
}
     
function WVGetCommURL () {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                return aWidevinePlugin.GetCommandChannelBaseUrl();
        } catch (err) {
                //alert("Error calling GetCommandChannelBaseUrl: " + err.description);
        }
        return "http://localhost:20001/cgi-bin/";
}

function WVSetPlayScale( arg ) {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
      	try {
       		return aWidevinePlugin.SetPlayScale( arg );
       	}
       	catch (err) {
       		alert ("Error calling SetPlayScale: " + err.description);
       	}
       	return 0;
}

function WVGetMediaTime( arg ) {
      	var aWidevinePlugin = document.getElementById('WidevinePlugin');
       	try {
         	return aWidevinePlugin.GetMediaTime( arg );
       	} catch (err) {
         	alert("Error calling GetMediaTime: " + err.description);
      	}
       	return 0;
}

function WVGetClientId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                return aWidevinePlugin.getClientId();
        }
        catch (err) {
                alert ("Error calling GetClientId: " + err.description);
        }
        return 0;
}


function WVSetDeviceId(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setDeviceId(arg);
        }
        catch (err) {
                alert ("Error calling SetDeviceId: " + err.description);
        }
        return 0;
}

function WVSetStreamId(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setStreamId(arg);
        }
        catch (err) {
                alert ("Error calling SetStreamId: " + err.description);
        }
        return 0;
}

function WVSetClientIp(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setClientIp(arg);
        }
        catch (err) {
                alert ("Error calling SetClientIp: " + err.description);
        }
        return 0;
}

function WVSetEmmURL(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setEmmUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetEmmURL: " + err.description);
        }
        return 0;
}


function WVSetEmmAckURL(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setEmmAckUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetEmmAckUrl: " + err.description);
        }
        return 0;
}

function WVSetHeartbeatUrl(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setHeartbeatUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetHeartbeatUrl: " + err.description);
        }
        return 0;
}


function WVSetHeartbeatPeriod(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setHeartbeatPeriod(arg);
        }
        catch (err) {
                alert ("Error calling SetHeartbeatPeriod: " + err.description);
        }
        return 0;
}



function WVSetOptData(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setOptData(arg);
        }
        catch (err) {
                alert ("Error calling SetOptData: " + err.description);
        }
        return 0;
}

function WVGetDeviceId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getDeviceId();
        }
        catch (err) {
                alert ("Error calling GetDeviceId: " + err.description);
        }
        return 0;
}

function WVGetStreamId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getStreamId();
        }
        catch (err) {
                alert ("Error calling GetStreamId: " + err.description);
        }
        return 0;
}

function WVGetClientIp() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getClientIp();
        }
        catch (err) {
                alert ("Error calling GetClientIp: " + err.description);
        }
        return 0;
}


function WVGetEmmURL() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getEmmUrl();
        }
        catch (err) {
                alert ("Error calling GetEmmURL: " + err.description);
        }
        return "";
}


function WVGetEmmAckURL() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getEmmAckUrl();
        }
        catch (err) {
                alert ("Error calling GetEmmAckUrl: " + err.description);
        }
        return "";
}

function WVGetHeartbeatUrl() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getHeartbeatUrl();
        }
        catch (err) {
                alert ("Error calling GetHeartbeatUrl: " + err.description);
        }
        return "";
}



function WVGetHeartbeatPeriod() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getHeartbeatPeriod();
        }
        catch (err) {
                alert ("Error calling GetHeartbeatPeriod: " + err.description);
        }
        return "";
}


function WVGetOptData() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getOptData();
        }
        catch (err) {
                alert ("Error calling GetOptData: " + err.description);
        }
        return "";
}


function WVAlert( arg ) {
	alert(arg);
     	return 0;
}


function WVPDLNew(mediaPath, pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                pdl_new =  aWidevinePlugin.PDL_New(mediaPath, pdlPath);
                return pdl_new;
        }
        catch (err) {
               //alert ("Error calling PDL_New: " + err.description);
        }
        return "";
}

function WVPDLStart(pdlPath, trackNumber, trickPlay) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Start(pdlPath, trackNumber, trickPlay);
        }
        catch (err) {
               //alert ("Error calling PDL_Start: " + err.description);
        }
        return "";
}

function WVPDLResume(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Resume(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Resume: " + err.description);
        }
        return "";
}


function WVPDLStop(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Stop(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Stop: " + err.description);
        }
        return "";
}

function WVPDLCancel(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Cancel(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Stop: " + err.description);
        }
        return "";
}

function WVPDLGetProgress(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetProgress(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_GetProgress: " + err.description);
        }
        return "";
}


function WVPDLGetTotalSize(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTotalSize(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_GetTotalSize: " + err.description);
        }
        return "";
}

function WVPDLFinalize(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Finalize(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Finalize: " + err.description);
        }
        return "";
}

function WVPDLCheckHasTrickPlay(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_CheckHasTrickPlay(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_CheckHasTrickPlay: " + err.description);
        }
        return "";
}

function WVPDLGetTrackBitrate(pdlPath, trackNumber) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTrackBitrate(pdlPath, trackNumber);
        }
        catch (err) {
               //alert ("Error calling PDL_GetTrackBitrate: " + err.description);
        }
        return "";
}

function WVPDLGetTrackCount(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTrackCount(pdlPath);
        }
        catch (err) {
                //alert ("Error calling PDL_GetTrackCount: " + err.description);
        }
        return "";
}

function WVPDLGetDownloadMap(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetDownloadMap(pdlPath);
        }
        catch (err) {
                //alert ("Error calling PDL_GetDownloadMap: " + err.description);
        }
        return "";
}

function WVGetLastError() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.GetLastError();
        }
        catch (err) {
               //alert ("Error calling GetLastError: " + err.description);
        }
        return "";
}

function WVRegisterAsset(assetPath, requestLicense){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.RegisterAsset(assetPath, requestLicense);
        }
        catch (err) {
               //alert ("Error calling RegisterAsset: " + err.description);
        }
        return "";

}


function WVQueryAsset(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.QueryAsset(assetPath);
        }
        catch (err) {
               //alert ("Error calling QueryAsset: " + err.description);
        }
        return "";

}

function WVQueryAllAssets(){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.QueryAllAssets();
        }
        catch (err) {
               //alert ("Error calling QueryAllAssets: " + err.description);
        }
        return "";

}



function WVUnregisterAsset(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.UnregisterAsset(assetPath);
        }
        catch (err) {
               //alert ("Error calling UnregisterAsset: " + err.description);
        }
        return "";

}

function WVUpdateLicense(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.UpdateLicense(assetPath);
        }
        catch (err) {
               //alert ("Error calling UpdateAssetLicense: " + err.description);
        }
        return "";

}

function WVGetQueryLicenseValue(assetPath, key){
        var licenseInfo = eval('(' + WVQueryAsset(assetPath) + ')');
        licenseInfo = eval("licenseInfo." + key);
        return licenseInfo;
}


function WVCancelAllDownloads(){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                if (aWidevinePlugin){
                        var downloading_list = eval(aWidevinePlugin.PDL_QueryDownloadNames());
                        for(var i = 0; i < downloading_list.length; i++){
                                WVPDLCancel(downloading_list[i]);
                        }
                }
        }
        catch (err) {
               //alert ("Error calling QueryAllAssets: " + err.description);
        }
        return "";
}




<!--
//v1.7
//Flash Player Version Detection
//Detect Client Browser type
//Copyright 2005-2008 Adobe Systems Incorporated.  All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
function ControlVersion()
{
	var version;
	var axo;
	var e;
	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}
	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";
			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";
			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}
//JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}
//When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];
      	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}
function AC_AddExtension(src, ext)
{
if (src.indexOf('?') != -1)
  return src.replace(/\?/, ext+'?'); 
else
  return src + ext;
}
function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
var str = '';
if (isIE && isWin && !isOpera)
{
  str += '<object ';
  for (var i in objAttrs)
  {
    str += i + '="' + objAttrs[i] + '" ';
  }
  str += '>';
  for (var i in params)
  {
    str += '<param name="' + i + '" value="' + params[i] + '" /> ';
  }
  str += '</object>';
}
else
{
  str += '<embed ';
  for (var i in embedAttrs)
  {
    str += i + '="' + embedAttrs[i] + '" ';
  }
  str += '> </embed>';
}
document.write(str);
}
function AC_FL_RunContent(){
var ret = 
  AC_GetArgs
  (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
   , "application/x-shockwave-flash"
  );
AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}
function AC_SW_RunContent(){
var ret = 
  AC_GetArgs
  (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
   , null
  );
AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}
function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
var ret = new Object();
ret.embedAttrs = new Object();
ret.params = new Object();
ret.objAttrs = new Object();
for (var i=0; i < args.length; i=i+2){
  var currArg = args[i].toLowerCase();    
  switch (currArg){	
    case "classid":
      break;
    case "pluginspage":
      ret.embedAttrs[args[i]] = args[i+1];
      break;
    case "src":
    case "movie":	
      args[i+1] = AC_AddExtension(args[i+1], ext);
      ret.embedAttrs["src"] = args[i+1];
      ret.params[srcParamName] = args[i+1];
      break;
    case "onafterupdate":
    case "onbeforeupdate":
    case "onblur":
    case "oncellchange":
    case "onclick":
    case "ondblclick":
    case "ondrag":
    case "ondragend":
    case "ondragenter":
    case "ondragleave":
    case "ondragover":
    case "ondrop":
    case "onfinish":
    case "onfocus":
    case "onhelp":
    case "onmousedown":
    case "onmouseup":
    case "onmouseover":
    case "onmousemove":
    case "onmouseout":
    case "onkeypress":
    case "onkeydown":
    case "onkeyup":
    case "onload":
    case "onlosecapture":
    case "onpropertychange":
    case "onreadystatechange":
    case "onrowsdelete":
    case "onrowenter":
    case "onrowexit":
    case "onrowsinserted":
    case "onstart":
    case "onscroll":
    case "onbeforeeditfocus":
    case "onactivate":
    case "onbeforedeactivate":
    case "ondeactivate":
    case "type":
    case "codebase":
    case "id":
      ret.objAttrs[args[i]] = args[i+1];
      break;
    case "width":
    case "height":
    case "align":
    case "vspace": 
    case "hspace":
    case "class":
    case "title":
    case "accesskey":
    case "name":
    case "tabindex":
      ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
      break;
    default:
      ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
  }
}
ret.objAttrs["classid"] = classid;
if (mimeType) ret.embedAttrs["type"] = mimeType;
return ret;
}



