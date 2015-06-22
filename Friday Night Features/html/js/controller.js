var FNF = FNF || {};

(function ($, FNF) {
	FNF.Controller = (function(){
		var details;

		/***************
		INIT
		****************/
		function init(){
			//LOAD MOVIES THROUGH PLUGIN THAT LOADS JSON
			$('#carousel-items').carousel({
				json: "data/this.json",
				template: '#json-carousel',
        		children: '.carousel-item',
				onClick: onMovieClick
			});

			details = $('.detail').moviedetails({
				template: "#json-detail"
			});

			
		}
		
		/***************
		ON MOVIECLICK
		****************/
		function onMovieClick(moviedata){
			details.data("details").load(moviedata);

			//WHEN MOVIE IS CLICK THEN LOAD DETAILS PLUGIN
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