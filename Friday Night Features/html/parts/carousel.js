;(function($, window, document, undefined) {
	var carousel = function(element,options){
		var $el = $(element);
		var plugin = this;
		var settings = $.extend({
			json: 'data/this.json',
        	template: '#thumbitem',
        	children: '.children-item',
        	onLoaded: function(){},
			onClick: function(){},
    	}, options || {});	  
    	var globalVariableObject = {};
    	
    	this.el = $el;
    	this.init = function(){
			loadjson();
	    	//LOAD JSON
	    	
	    	//ADJUST JSON TO ADD DATE FIELDS
	    	//LOAD TEMPLATE
	    	//ADD CLICK EVENT
    	}

    	function loadjson(){
			$.getJSON(settings.json, function(data){
				globalVariableObject.movies = data.movies;

				var source = $(settings.template).html();
				var template = Handlebars.compile(source);
				var html = template(data);
				$el.html(html);
				addMovieData();
				onjsonLoaded();
			});
		}

		function addMovieData(){
			$el.find(settings.children).each(function(i){
				var t = $(this);
				t.data("moviedata",globalVariableObject.movies[i]);
			});
		}

		function onjsonLoaded(){
			addClickEvent();
			loadFirstMovie();
		}

		function addClickEvent(){
			$el.find(settings.children).click(selectMovie)
		}

		function loadFirstMovie(){
			$el.find(settings.children).eq(0).trigger("click");
		}

		function selectMovie(){
			var t = $(this);
			//WHATEVER ELSE ON CLICK THAT HAPPENS
			settings.onClick.call(undefined,t.data("moviedata"));
		}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.carousel = function(options){
		return this.each(function(){
			var plugin = new carousel(this, options);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

