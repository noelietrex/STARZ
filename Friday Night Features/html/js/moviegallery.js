;(function($, window, document, undefined) {
	var moviegallery = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			moviedata:{},
			template: '#thumbitem',
			children: 'li',
			gallery: '.gallery',
			gallerySpeed: 6000
    	}, options || {})
    	var globalVariableObject = {}
    	
    	this.el = $el;
    	this.init = function(){
    		loadTemplate();
	    	showFirstImg();
	    	innerGalleryTime();
	    	backgroundImg();

	    	$(window).resize(windowResize);
			windowResize();
    	}
    	
    	function loadTemplate(){
	    	clearInterval( $(document).data('galleryinterval') );
	    	var source = $(settings.template).html()
    		var template = Handlebars.compile(source)
			var html = template(settings.moviedata)

			$el.html(html);
    	}

    	function showFirstImg() {
    		$el.find(settings.children).first().addClass('js-gallery-active');
    	}

    	function rotateGalleryImg() {
	    	$(settings.children + '.js-gallery-active').appendTo($el).removeClass('js-gallery-active');
			$el.find(settings.children).first().addClass('js-gallery-active');
		}

		function backgroundImg() {
			var curr = $(settings.children + '.js-gallery-active')
			var currImg = $(curr > 'img')

			$el.css({'background-image' : currImg});
		}


		//Set the Delay Time
		function innerGalleryTime() {
			var interval = setInterval(rotateGalleryImg, settings.gallerySpeed);
			$(document).data('galleryinterval', interval);
		}

		//RESPONSIVE
		function windowResize(){
			if ($(window).width() <= 1030){	
				var galleryImgHeight = $el.find(settings.children).height();
				$el.css({'height' : galleryImgHeight});
			}
		}

	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviegallery = function(options){
		return this.each(function(){
			var plugin = new moviegallery(this, options)
			$(this).data("gallery",plugin);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

