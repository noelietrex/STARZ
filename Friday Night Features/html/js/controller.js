var FNF = FNF || {};

(function ($, FNF) {
	FNF.Controller = (function(){
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
		}
		
		/***************
		ON MOVIECLICK
		****************/
		function onMovieClick(moviedata){
			$('.detail').moviedetails({
				moviedata: moviedata,
				template: "#json-detail",
				gallery: ".gallery"
			})
			//WHEN MOVIE IS CLICK THEN LOAD DETAILS PLUGIN
			//INSIDE THE PLUGIN SHOULD THEN LOAD GALLEY PLUGIN
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