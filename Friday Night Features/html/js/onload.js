$(document).ready(function(){

	// =LISTS
	$(function() {
		// Add classes to first and last of each list
		$('li:first-child').addClass('js-first');
		$('li:last-child').addClass('js-last');
	});
	
	var currentDate = new Date(); // get current date
	var n = 376; // width of number AFTER animation won't measure so this is 350 + 10 margin + 3 border
	var selectedMovie;
	var pageWidth;
	var itemNumber;
	var itemWidth;
	var fullWidth;
	var numBeforeCurrent;
	var currentDetailGallery;
	
	$(window).resize(windowResize);
	
	$('.carousel-item').click(function(){
		selectMovie($(this));
	});
	
	
	function loadCarouselImages(){
		$('.carousel-item').each(function(){
			var bg = $(this).attr('headerPhoto');
			$(this).css('background-image','url(images/'+bg+')');
		});
	}
	
	function detirmineInitialMovie(){
		$('.carousel-item').each(function(){
			
			var itemDate = new Date($(this).attr('date'));
			
			if (currentDate < itemDate){
				var t = $(this);
				var id = t.attr('id')
				
				selectMovie(t);
				return false;
			}
		});
	}
	
	function selectMovie(t){
		var id = t.attr('id')

		$('#'+selectedMovie).removeClass('js-currentMovie');
		$('#'+id).addClass('js-currentMovie');
		
		selectedMovie = id;
		countToCurrent();
		animateOver();
		selectDetail();
	}

	function selectDetail(){
		var theId = $('.js-currentMovie').attr('id')
		if($('.carousel-item').hasClass('js-currentMovie')){
			$('.detail').removeClass('js-currentDetail');
			$('.detail' + '#' + theId).addClass('js-currentDetail');
			// console.log(theId, 'is the carousel-item id attr');

			thisDetailGalleryShowFirst();

		} else {
			$('.detail' + '#' + theId).removeClass('js-currentDetail');
		}
	}
	selectDetail();

	// =ARROWS
	$('.js-arrow-right').click($.throttle(function(){
		// if this is the last item, go back to first item
		if($('.carousel-item.js-currentMovie').hasClass('js-last')) {
			selectMovie($('.carousel-item').first());
		}
		// else highlight next
		else {
			selectMovie($('.carousel-item.js-currentMovie').next());
		}
	}, 500));

	$('.js-arrow-left').click($.throttle(function(){
		// if this is the first item, go to the last item
		if($('.carousel-item.js-currentMovie').hasClass('js-first')) {
			selectMovie($('.carousel-item').last());
		}
		// else highlight previous
		else {
			selectMovie($('.carousel-item.js-currentMovie').prev());
		}
	}, 500));


	function windowResize(){
		//measure the page width
		pageWidth = $(window).width();
		moveOver();
	}


	function countItems() {
		//count the carousel items
		itemNumber = $('.carousel-item').length;
	}


	function countToCurrent(){
		//counts how many are before the selected div
		numBeforeCurrent = $('.js-currentMovie').prevAll().length
	}


	$('.carousel-item').each(function() {
		//measure the width of each item
		itemWidth = $(this).outerWidth(true);
	});


	function calcfullWidth() {
		fullWidth = 0;
		// add the sum of all of the widths of each carousel item
		$('.carousel-item').each(function(index) {
			fullWidth += parseInt($(this).outerWidth(true),10)
		});

		//set width of container to sum of all carousel items
		$('ul#carousel-items').css({'width' : fullWidth + '2em'}); //couldn't get it to measure AFTER animation so added 2em hack
	}

	function moveOver() {
		var thisFar = (numBeforeCurrent * itemWidth) - (pageWidth * 0.5) + (n / 2); 
		$('.carousel-item').css({'left' : -thisFar + 'px'});
	}

	function animateOver() {
		var thisFar = (numBeforeCurrent * itemWidth) - (pageWidth * 0.5) + (n / 2); 
		$('.carousel-item').animate({'left' : -thisFar + 'px'});
	}


	//=INNER GALLERY CAROUSEL
	function thisDetailGalleryShowFirst(){
		var currentDetailGallery = $('.js-currentDetail .gallery');
		currentDetailGallery.children(':first-child').addClass('js-gallery-active');
	}

	function rotateClass() {
		var currentDetailGallery = $('.js-currentDetail .gallery');
		$('.gallery > li.js-gallery-active').appendTo(currentDetailGallery).removeClass('js-gallery-active');
		currentDetailGallery.children(':first-child').addClass('js-gallery-active');
	}

	//Set the Delay Time
	setInterval(function () {
	  rotateClass();
	}, 5000);
	

	
	loadCarouselImages();
	detirmineInitialMovie();
	windowResize();
	countItems();
	calcfullWidth();
	countToCurrent();
	moveOver();

});





