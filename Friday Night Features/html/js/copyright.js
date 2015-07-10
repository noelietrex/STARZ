;(function($, window, document, undefined) {
	var copy = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			json: 'data/this.json',
        	template: '#json-copyright',
        	children: 'p',
        	onLoaded: function(){},
			onClick: function(){},
			activeWidth: 376
    	}, options || {}) 
    	var globalVariableObject = {}
    	
    	this.el = $el;
    	this.init = function(){
			loadjson();
    	}

    	function loadjson(){
			$.getJSON(settings.json, function(data){
				globalVariableObject.movies = data.movies;

				var source = $(settings.template).html()
				var template = Handlebars.compile(source)
				var html = template(data)

				$el.html(html);
				addMovieData();
				onjsonLoaded();
			});
		}
	}

    /******************
	 INIT
	*******************/
	$.fn.copy = function(options){
		return this.each(function(){
			var plugin = new copy(this, options)

			plugin.init();
		});
	}
    
})(jQuery, window, document);