;(function($, window, document, undefined) {
	var moviegallery = function(element,options){
		var $el = $(element)
		var plugin = this
		var settings = $.extend({
			images :{},
			template: '#thumbitem',
			children: 'li',
			gallery: '.gallery',
			gallerySpeed: '5000'
    	}, options || {})
    	var globalVariableObject = {}
    	
    	this.el = $el;
    	this.init = function(){
    		globalVariableObject.source = $(settings.template).html();
	    	//ADD AUTOPLAY
	    	showFirstImg();
	    	innerGalleryTime();
	    	//console.log (globalVariableObject.interval);
    	}

    	this.load = function (moviedata){
    		console.log(moviedata);
    		var template = Handlebars.compile(globalVariableObject.source)
			var html = template(moviedata)

			$el.html(html);
    	}

    	function showFirstImg() {
    		$el.find(settings.children).first().addClass('js-gallery-active');
    	}

    	function rotateGalleryImg() {
			$(settings.children + '.js-gallery-active').appendTo($el).removeClass('js-gallery-active');
			$el.find(settings.children).first().addClass('js-gallery-active');
		}


		//Set the Delay Time
		function innerGalleryTime() {
			setInterval(function () {
			  rotateGalleryImg();
			}, settings.gallerySpeed);
		}
	}
    
    /******************
	 INIT
	*******************/
	$.fn.moviegallery = function(options){
		return this.each(function(){
			console.log( this );
			var plugin = new moviegallery(this, options)
			$(this).data("gallery",plugin);
			plugin.init();
		});
	}
    
})(jQuery, window, document);

