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
    		globalVariableObject.source = $(settings.template).html();
	    	//LOAD TEMPLATE
	    	//LOAD GALLERY PLUGIN
    	}
    	this.load = function(moviedata){
    		var template = Handlebars.compile(globalVariableObject.source)
			var html = template(moviedata)

			$el.html(html);

			if(!globalVariableObject.gallery) loadGallery(moviedata);
			else globalVariableObject.gallery.data("gallery").load(moviedata);
    	}

    	function loadGallery(moviedata){
    		globalVariableObject.gallery = $('.gallery').moviegallery({
				template: '#json-gallery'
			});

			globalVariableObject.gallery.data("gallery").load(moviedata);
    	}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviedetails = function(options){
		return this.each(function(){
			var plugin = new moviedetails(this, options)
			$(this).data("details",plugin);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

