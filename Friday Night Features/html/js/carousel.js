;(function($, window, document, undefined) {
	var carousel = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			json: 'data/this.json',
        	template: '#thumbitem',
        	children: '.children-item',
        	onLoaded: function(){},
			onClick: function(){},
    	}, options || {}) 
    	var globalVariableObject = {}
    	
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

				var source = $(settings.template).html()
				var template = Handlebars.compile(source)
				var html = template(data)

				$el.html(html);
				addMovieData();
				onjsonLoaded();
			});
		}

		function addMovieData(){
			$el.find(settings.children).each(function(i){
				var t = $(this)
				var bg = $(this).attr('headerPhoto')

				t.data("moviedata",globalVariableObject.movies[i]);
				t.css('background-image','url(images/'+bg+')');
			});
		}


		function onjsonLoaded(){
			addClickEvent();
			loadFirstMovie();
			arrows();
		}

		function arrows() {
			var length = $el.find(settings.children).length
			var last = $('#' + 'carousel' + (length - 1))
			
			$('.js-arrow-right').click($.throttle(function(){
				if ($(last).hasClass('js-currentMovie')){
					$el.find('#carousel0').trigger("click");
				} else {
					$el.find('.js-currentMovie').next().trigger("click");
				}
			}, 500));

			$('.js-arrow-left').click($.throttle(function(){
				if ($('#carousel0').hasClass('js-currentMovie')){
					$el.find(last).trigger("click");
				} else {
					$el.find('.js-currentMovie').prev().trigger("click");
				}
			}, 500));
		}

		function addClickEvent(){
			$el.find(settings.children).click(selectMovie)
		}

		function loadFirstMovie(){
			$el.find(settings.children).each(function(i){
				var t = $(this)
				var currentDate = new Date() // get current date
				var itemDate = new Date(t.attr('date'))

				if (currentDate < itemDate){
					t.trigger("click");
					return false;
				}
			});
		}



		function selectMovie(){
			var t = $(this)

			settings.onClick.call(this, t.data('moviedata'));

			$el.find(settings.children).removeClass('js-currentMovie');
			$(t).addClass('js-currentMovie');
		}


	}
    
    /******************
	 INIT
	*******************/
	$.fn.carousel = function(options){
		return this.each(function(){
			var plugin = new carousel(this, options)

			plugin.init();
		});
	}
    
})(jQuery, window, document);

