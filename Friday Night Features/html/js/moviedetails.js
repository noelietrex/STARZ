;(function($, window, document, undefined) {
	var moviedetails = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			moviedata: {},
			template: '#thumbitem',
        	gallery: '.gallery',
        	gallerySpeed: 6000
    	}, options || {})
    	var globalVariableObject = {}
    	
    	this.el = $el;
    	this.init = function(){
    		loadTemplate();
    		loadGallery();
    	}
    	function loadTemplate(){
	    	var source = $(settings.template).html();
    		var template = Handlebars.compile(source);
			var html = template(settings.moviedata);

			$el.html(html);
    	}

    	function loadGallery(){
    		$('.gallery').moviegallery({
				template: '#json-gallery',
				moviedata: settings.moviedata,
				gallerySpeed: settings.gallerySpeed
			});
    	}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviedetails = function(options){
		return this.each(function(){
			var plugin = new moviedetails(this, options)
			//$(this).data("details",plugin);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

