;(function($, window, document, undefined) {
	var moviedetails = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			moviedata: {},
			template: '#thumbitem',
        	gallery: '.gallery'
    	}, options || {})
    	var globalVariableObject = {}
    	
    	this.el = $el;
    	this.init = function(){
    		loadTemplate();
    		loadOnMobile();
    	}

    	function loadTemplate(){
	    	var source = $(settings.template).html();
    		var template = Handlebars.compile(source);
			var html = template(settings.moviedata);
		}

    	function loadOnMobile(){
	    	if ($(window).width() <= 750){
	    		$(settings.gallery).moviegallery({
					template: '#json-gallery',
					moviedata: settings.moviedata
				});
    		}
    	}

	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviedetails = function(options){
		return this.each(function(){
			var plugin = new moviedetails(this, options)
			plugin.init();
		});
	}
    
})(jQuery, window, document);




