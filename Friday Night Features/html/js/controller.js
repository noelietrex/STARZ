var FNF = FNF || {};

(function ($, FNF) {
	FNF.Controller = (function(){
		var details;

		/***************
		INIT
		****************/
		function init(){
			$('#carousel-items').carousel({
				json: "data/this.json",
				template: '#json-carousel',
        		children: '.carousel-item',
				onClick: onMovieClick,
				activeWidth: 376
			});

			$('#copyrights').copy({
				json: "data/this.json",
				template: '#json-copyright',
        		children: 'p'
			});
		}
		
		/***************
		ON MOVIECLICK
		****************/
		function onMovieClick(moviedata){
			details = $('.detail').moviedetails({
				template: "#json-detail",
				moviedata: moviedata,
				gallerySpeed: 5000
			});
		}
		
		/***************
		PUBLIC
		****************/
		return {
			init:init
		}
	})();
})(jQuery,FNF);

/***************
START EVERYTHING
****************/
(function(){
	$(document).ready(function(){
		FNF.Controller.init();
	});
})();