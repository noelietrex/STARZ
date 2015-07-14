$(document).ready(function(){

	function modal(){
		$('.play-ad-button').click(function(){
			$('.modal').addClass('js-active-modal');
		});
		$('.close-modal').click(function(){
			$('.modal').removeClass('js-active-modal');
		});
	}

	modal();

});