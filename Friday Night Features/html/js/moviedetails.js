;(function($, window, document, undefined) {
	var moviedetails = function(element,options){
		var $el = $(element);
		var plugin = this;
		var settings = $.extend({
			moviedata: {},
			template: '#thumbitem',
        	gallery: '.gallery'
    	}, options || {});	  
    	var globalVariableObject = {};
    	
    	this.el = $el;
    	this.init = function(){
    		globalVariableObject.source = $(settings.template).html();
    		loadTemplate();
	    	//LOAD TEMPLATE
	    	//LOAD GALLERY PLUGIN
    	}

    	function loadTemplate(){
    		var template = Handlebars.compile(globalVariableObject.source);
			var html = template(settings.moviedata);
			$el.html(html);

			console.log( $el.find(settings.gallery) );
			$el.find(settings.gallery).moviegallery({
				images: settings.moviedata,
				template: '#json-gallery'
			});
    	}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviedetails = function(options){
		return this.each(function(){
			var plugin = new moviedetails(this, options);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

