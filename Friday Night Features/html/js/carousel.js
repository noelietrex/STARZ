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

		function addMovieData(){
			if ($(window).width() >= 750){	
				$el.find(settings.children).each(function(i){
					var t = $(this)
					var bg = $(this).attr('headerPhoto')

					t.data("moviedata",globalVariableObject.movies[i]);
					t.css('background-image','url(images/'+bg+')');
				});
			}
		}


		function onjsonLoaded(){
			addClickEvent();
			loadFirstMovie();
			measure();
			center();
			arrows();
			windowResize();
			$(window).resize(windowResize);
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
			if ($(window).width() >= 750){	
				$el.find(settings.children).click(selectMovie)
			}
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
				if ($(window).width() <= 750){
					if (currentDate <= itemDate){
						t.css({'display' : 'block'});
					} else {
						t.css({'display' : 'none'});
					}
				}
			});
		}

		function selectMovie(){
			var t = $(this)

			if ($(window).width() >= 750){	
				settings.onClick.call(this, t.data('moviedata'));

				$el.find(settings.children).removeClass('js-currentMovie');
				$(t).addClass('js-currentMovie');

				move();
			}
		}

		function measure(){
			if ($(window).width() >= 750){	
				var x = $el.find(settings.children)
				var carItemWidth = x.outerWidth(true);
				// var activeWidth = $el.find(settings.children + '.js-currentMovie').outerWidth(true);
				var countToCurrent = $el.find(settings.children + '.js-currentMovie').prevAll().length;
				var carouselNum = x.length;
				var carouselWidth = ((carouselNum - 1) * carItemWidth) + settings.activeWidth

				// console.log('carItemWidth: ', carItemWidth);
				// console.log('activeWidth: ', settings.activeWidth);
				// console.log('countToCurrent: ', countToCurrent);
				// console.log('carouselWidth:', carouselWidth);

				$el.css({'width' : carouselWidth + 'px'});
			}
		}

		var activeWidth;

		function center(){
			if ($(window).width() >= 750){	
				var x = $el.find(settings.children)
				var carItemWidth = x.outerWidth(true);
				// var activeWidth = $el.find(settings.children + '.js-currentMovie').outerWidth(true); // HOW DO I MAKE THIS THE NUMBER FROM AFTER LOAD?
				var countToCurrent = $el.find(settings.children + '.js-currentMovie').prevAll().length;
				var carouselNum = x.length;
				var carouselWidth = ((carouselNum - 1) * carItemWidth) + settings.activeWidth
				var screenWidth = $(window).width()
				var howFar = (countToCurrent * carItemWidth) - (screenWidth / 2) + (settings.activeWidth / 2)

				$el.css({'left': -howFar + 'px'});
			}
		}

		function move(){
			var x = $el.find(settings.children)
			var carItemWidth = x.outerWidth(true);
			var countToCurrent = $el.find(settings.children + '.js-currentMovie').prevAll().length;
			var carouselNum = x.length;
			var carouselWidth = ((carouselNum - 1) * carItemWidth) + settings.activeWidth
			var screenWidth = $(window).width()
			var howFar = (countToCurrent * carItemWidth) - (screenWidth / 2) + (settings.activeWidth / 2)

			$el.animate({'left': -howFar + 'px'});
		}

		function windowResize(){
			pageWidth = $(window).width();
			center();
		}



		// clean this up a bit later - grabbed from stack overflow
		var ww = $(window).width();
		var limit = 750;

		function refresh() {
		   ww = $(window).width();
		   var w =  ww<limit ? (location.reload(true)) :  ( ww>limit ? (location.reload(true)) : ww=limit );
		}

		var tOut;
		$(window).resize(function() {
		    var resW = $(window).width();
		    clearTimeout(tOut);
		    if ( (ww>limit && resW<limit) || (ww<limit && resW>limit) ) {        
		        tOut = setTimeout(refresh, 0);
		    }
		});




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