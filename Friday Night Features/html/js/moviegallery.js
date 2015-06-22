;(function($, window, document, undefined) {
	var moviegallery = function(element,options){
		var $el = $(element);
		var plugin = this;
		var settings = $.extend({
			images :{},
			template: '#thumbitem',
    	}, options || {});	  
    	var globalVariableObject = {};
    	
    	this.el = $el;
    	this.init = function(){
    		globalVariableObject.source = $(settings.template).html();
    		loadTemplate();
	    	//LOAD TEMPLATE
	    	//ADD AUTOPLAY
    	}

    	function loadTemplate(){
    		var template = Handlebars.compile(globalVariableObject.source);
			var html = template(settings.images);
			$el.html(html);
    	}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviegallery = function(options){
		return this.each(function(){
			var plugin = new moviegallery(this, options);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

