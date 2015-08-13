var Microsite = Microsite || {};

(function ($, page) {
	page.Twitter = (function () {
		var _users = ["boss_starz", "spartacus_starz", "starz_channel", "magiccity_starz", "DaVincis_Starz"],
			_path = "http://search.twitter.com/search.json?rpp=15&q=",
			_data = {},
			_since = 0,
			_current = 0,
			_count = 1,
			_first = true,
			_order = true,
			$t, $ul,
			_t = {}, 
			_ie = false;
		
		/****************************
		*SETTINGS
		*
		*Change these VARS
		****************************/
		//CONTAINER HEIGHT is controlled in the CSS
		var _amount = 3;
		//SETTING THE AMOUNT IS HOW YOU DEFINE THE ITEM HEIGHT+SPACING.
		var _delay = 6500;
		var _type = "vertical";
		/**** TYPES ****
		*horizontal
		*vertical
		*************/
		

		
		/****************************
		*INIT
		*
		*Constuctor. Build Path then Load
		****************************/
		function init (){
			_ie = $.browser.msie;
			
			setupPath();
			loadFeed();
			
			$('.twitter-links a').click ( function() {
				$('.twitter-container ul').html("");
				
				clearTimeout(_t.time)
				
				_t.p.removeClass("twitter-horzscroll");
				_t.p.removeClass("twitter-vertscroll");
				
				_count = 1;
				_order = true;
				_type = $(this).attr( 'name' );
				_first = true;
				_since = 0;
				loadFeed();
			}); 
		}
		
		/****************************
		*Set Up Path
		*
		*Build Path based on users. 
		****************************/
		function setupPath() {
			for ( var i=0;i<_users.length;i++){
				if(i==0) _path+="from:"+_users[i];
				else _path+=" OR from:"+_users[i];
			}
		}
		
		/****************************
		*Load Feed
		*
		*Get us content
		****************************/
		function loadFeed(){
			$('.twitter-time').each(function() {
				var t = $(this);
				var d = new Date( t.attr("t") );
				t.text(jQuery.timeago(d));
			});
			
			$.ajax ({
				type:'GET',
				url: _path+"&since_id="+_since,
				dataType:'jsonp',
				success: dataLoaded, 
				fail: failSend
			}); 
		}
		
		function startModule() {
			if ( _type=="horizontal") startHorizontal();
			else if ( _type=="vertical") startVertical();
		}

		/****************************
		*Data Is Loaded
		*
		*Great success!
		****************************/
		function dataLoaded(data){
		
			_data = data.results;
			
			_since = data.max_id_str
			
			addResults();
			startModule();
			
			_first = false;
			
			//$('.twitter-title').show();
		}
		
		function failSend(){
			if( !_first ) {
				startModule();
			}
		}
		
		
		/****************************
		*Add Results
		*
		*Build the div and add it!
		****************************/
		function addResults() {
			var v = 0;
			
			for ( var i in _data ){
				if ( _data[i].text.substr(0,1)!="@" ){
					var ti = makeTwitterItem( _data[i], i )
				
					if ( _first || _order  ) $('.twitter ul').append( ti );
					else {
					
						_t.items.eq((_t.amount-1)+v).after( ti );
						_t.items = _t.p.find( '.twitter-item');
						v++;
					} 
				}
			}
		}
		
		/****************************
		*Make Item
		*
		*Build the div and return it!
		****************************/
		function makeTwitterItem( item, i ){
			var ti = '<li class="twitter-item">';
			//IMAGE
			ti += '<div class="twitter-image"><a href="http://www.twitter.com/'+item.from_user+'" target="_blank"><img src="'+item.profile_image_url+'" width="48" height="48" border="0"/></a></div>';
				
			ti += '<div class="twitter-text">'
			//Name
			ti += '<div class="twitter-user"><a href="http://www.twitter.com/'+item.from_user+'" target="_blank">'+item.from_user+'</a></div>';
			//Time
			var d = new Date (item.created_at);
			ti += '<div class="twitter-time" t="'+item.created_at+'">'+jQuery.timeago(d)+'</div>';
			//Tweet_data[i].text
			var text = item.text;
			//console.log( text );
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    		text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    		exp = /(^|\s)#(\w+)/g;
    		text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
    		exp = /@(\w+)/g;
    		text = text.replace(exp, "<a href='http://www.twitter.com/$1' target='_blank'>@$1</a>");
				
			ti += '<div class="twitter-tweet">'+text+'</div>';
			ti += '</div>';
				
			ti += '</li>';
						
			ti = $(ti);
			ti.attr ( 'v', _count );
			
			_count++;
			
			return ti;
		}
		
		
		//-----------------------------------HORIZONTAL-------------------------------------------//
		
		/****************************
		*Horizontal Setup
		*
		*Build the div and add it!
		****************************/
		function startHorizontal(){
			_t.delay = _delay;
			_t.amount = _amount;
			
			_order = false;
			_t.p = $('.twitter').show();
			
			_t.p.addClass("twitter-horzscroll");
			
			_t.cont = _t.p.find('.twitter-container');
			_t.ul = _t.p.find('.ul');
			
			_t.width = _t.p.width();
			_t.iw = _t.width/_t.amount;
			_t.items = _t.p.find( '.twitter-item').width( _t.iw ); 
			_t.items.find('.twitter-text').width( _t.iw-75 );
			
			_t.length = _t.items.length;
			
			_t.cont.width( (_t.length+5)*_t.width );
			
			_t.current = 0;
			
			if (_first) _t.time = setTimeout(horizontalDelay, _t.delay);
		}
		
		/****************************
		*Horizontal Slide
		*
		*and repeat
		****************************/
		function horizontalDelay() {
			_t.cont.animate({
				'margin-left':"-"+_t.iw+"px"
			}, "slow", function(){
				
				var l = _t.items.eq(0)
				l.remove();
				_t.items.eq(_t.length-1).after ( l );
				_t.items = _t.p.find( '.twitter-item');
				 
				
				_t.cont.css({"margin-left":"0px"});
				
				if ( Number( _t.items.eq(_t.amount-1).attr("v") ) == _count-1 ) loadFeed();
				
				_t.time = setTimeout(horizontalDelay, _t.delay);
			});
		}
		
		//-----------------------------------VERTICAL-------------------------------------------//
		
		/****************************
		*Vertical Setup
		*
		*Build the div and add it!
		****************************/
		function startVertical(){
			_t.delay = _delay;
			_t.amount = _amount;
			
			_order = false;
			_t.p = $('.twitter').show();
			
			_t.p.addClass("twitter-verticalscroll");
			
			_t.cont = _t.p.find('.twitter-container');
			_t.ul = _t.p.find('.ul');
			
			_t.width = _t.p.width();
			_t.height = _t.p.height();
			
			_t.ih = _t.height/_t.amount;
			_t.items = _t.p.find( '.twitter-item').height( _t.ih ); 
			_t.items.width( _t.width );
			_t.items.find('.twitter-text').width( _t.width-75 );
			
			_t.length = _t.items.length;
			
			_t.cont.width( (_t.length+5)*_t.width );
			_t.cont.height( (_t.length+5)*_t.height );
			
			_t.current = 0;
			
			if (_first) _t.time = setTimeout(verticalDelay, _t.delay);
		}
		
		/****************************
		*Vertical Slide
		*
		*and repeat
		****************************/
		function verticalDelay() {
			_t.cont.animate({
				'margin-top':"-"+_t.ih+"px"
			}, "slow", function(){
				
				var l = _t.items.eq(0)
				l.remove();
				_t.items.eq(_t.length-1).after ( l );
				_t.items = _t.p.find( '.twitter-item');
				
				
				_t.cont.css({"margin-top":"0px"});
				
				if ( Number( _t.items.eq(_t.amount-1).attr("v") ) == _count-1 ) loadFeed();
				
				_t.time = setTimeout(verticalDelay, _t.delay);
			});
		}
		
		/****************************
		*Public
		****************************/
		return {
			init:init
		}
	})();
	
	this.Construct = (function(){
		$(document).ready(function(){
			page.Twitter.init();
		});
	})();	
	
}) (jQuery, Microsite);