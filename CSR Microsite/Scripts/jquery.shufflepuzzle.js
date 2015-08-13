(function($) {
	$.fn.extend({
		shufflepuzzle: function(options) {
			var defaults = {
				img_puzzle: 'img/puzzle.jpg',
				tilesH: 4,
				tilesV: 4,
				gap: true,
				duration: 100,
				bgColor: '#fff',
				bgOpacity: 1,
				imgBgOpacity: .2,
				shuffleNum: 5,
				shuffleSpeed: 60,
				menuVisible: true,
				menuNameShuffle: 'Shuffle',
				menuNameGrid: 'Grid',
				menu_shuffle:{
					Easy: 10,
					Medium: 30,
					Hard: 60
				},
				menu_grid: ['3x3', '4x4', '5x5'],
				onCompleted : null
			};
			options = $.extend(defaults, options);
			var rand = Math.round(Math.random() * 999999);

			return this.each(function() {
				var o = options,
					tiles = [],
					tilesShuffle = [],
					grid = [],
					sum = o.tilesV*o.tilesH,
					lineWidth = o.gap ? 1 : 0,
					i = 0,
					ii = false,
					cl = sum-1,
					cl1 = -1,
					cl2 = cl,
					i_w = 0,
					i_h = 0,
					obj = $(this),
					m_shuffle = '',
					m_grid = '',
					m_img = '';

				var img = new Image();
				img.onload = function() {
					o.width = this.width;
					o.height = this.height;
					StartPuzzle();
				}
				img.src = o.img_puzzle;
				
				function StartPuzzle(){
					for(var key in o.menu_shuffle) {
						m_shuffle += '<li>'+key+'</li>';
					}
					for (var i = 0; i < o.menu_grid.length; i++) {
						m_grid += '<li>'+o.menu_grid[i]+'</li>';
					}
					for (var key in o.menu_image) {
						m_img += '<li>'+key+'</li>';
					}

					var mNS ='';
					var mNG='';
					var mNI='';

					if(o.menuNameShuffle){
						mNS = '<li>'+o.menuNameShuffle+'<ul class="pz_shuffle' + rand + '">'+m_shuffle+'</ul></li>';
					}

					if(o.menuNameGrid){
						mNG = '<li>'+o.menuNameGrid+'<ul class="pz_grid' + rand + '">'+m_grid+'</ul></li>';
					}

					if(o.menuNameImage){
						mNI = '<li>'+o.menuNameImage+'<ul class="pz_img' + rand + '">'+m_img+'</ul></li>';
					}

					$(obj).width(o.width).height(o.height).css({'overflow': 'hidden','position': 'relative','padding': '0'});
					$(obj).prepend('<div id="bg' + rand + '"><img id="imgbg' + rand + '" width="' + o.width + '" height="' + o.height + '" src="' + o.img_puzzle + '" /></div>');
					
					if (o.menuVisible){
						$(obj).prepend('<div id="menu' + rand + '">'+
							'<ul id="puzzle-navigation">' + mNS + mNG + mNI + '</ul>'+
						'</div>');
					}

					$('ul.pz_shuffle' + rand + ' li').click(function(e) {
						$('.img_title' + rand).remove();
						o.shuffleNum = o.menu_shuffle[$(this).text()];
						Create();
					});

					$('ul.pz_grid' + rand + ' li').click(function(e) {
						$('.img_title' + rand).remove();
						grid = $(this).text().replace(/[^A-Za-z0-9#:;-]/g,'').split('x');
						o.tilesV = parseInt(grid[0]);
						o.tilesH = parseInt(grid[1]);
						sum = o.tilesV*o.tilesH;
						Create();
					});

					$('ul.pz_img' + rand + ' li').click(function(e) {
						if(o.img_puzzle != o.menu_image[$(this).text()]){
							$('.img_title' + rand).remove();
							img.src = o.img_puzzle = o.menu_image[$(this).text()];
							$('#imgbg' + rand).attr('src', o.img_puzzle);
							img.onload = function() {
								Create();
							}
						}
					});

					$(obj).bind('selectstart',function(){ return false; }).css({
						'user-select': 'none',
						'-o-user-select': 'none',
						'-moz-user-select': 'none', 
						'-khtml-user-select': 'none',
						'-webkit-user-select': 'none'
					});

					$('#bg' + rand).css({
						'position': 'absolute',
						'overflow': 'hidden',
						'background-color': o.bgColor,
						'opacity': o.bgOpacity
					});

					$('#menu' + rand).css({
						'height': 20 + 'px',
						'background-image': 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEUAAACnej3aAAAAAXRSTlO4hVzj2AAAAA1JREFUeNoBAgD9/wAAAAIAAVMrnDAAAAAASUVORK5CYII=)',
						'color': 'white',
						'position': 'absolute',
						'z-index': 50
					});
					Create();
				}

				
				function Create(){
					ii = false;
					cl = sum-1;
					cl1 = -1;
					cl2 = cl;

					tiles = [];
					tilesShuffle = [];

					$('#bg' + rand).css({
						'background-color': o.bgColor,
						'opacity': o.bgOpacity
					});

					$('#imgbg' + rand).css({
						'opacity': o.imgBgOpacity
					});

					for(i_h=0; i_h<sum; i_h++){
						tiles.push(i_h);
						tilesShuffle.push(i_h);				
					}
					
					i=0;

					var vs_h = Math.floor((o.width - (Math.floor(o.width/o.tilesH)*o.tilesH))/2);
					var vs_v = Math.floor((o.height - (Math.floor(o.height/o.tilesV)*o.tilesV))/2);

					for(i_h=0; i_h<o.tilesV; i_h++){
						for(i_w=0; i_w<o.tilesH; i_w++){
							$(obj).prepend('<div class="img_title' + rand + '" id="img_num' + i + rand + '"></div>');
							$('#img_num' + i + rand).css({
								'background': 'url('+o.img_puzzle+') -'+(i_w*Math.floor(o.width/o.tilesH)+vs_h)+'px -'+(i_h*Math.floor(o.height/o.tilesV)+vs_v)+'px no-repeat',						
								'width': Math.floor(o.width/o.tilesH)-lineWidth + 'px',
								'height': Math.floor(o.height/o.tilesV)-lineWidth + 'px',
								'position': 'absolute',
								'overflow': 'hidden',
								'left': vs_h+i_w*Math.floor(o.width/o.tilesH) + 'px',
								'top': vs_v+i_h*Math.floor(o.height/o.tilesV) + 'px',
								'z-index': 1
							}).data({
								'name': tiles[i],
								'etalon': tiles[i]
							}).bind('mousedown touchstart', function(e) {
								if( ($(this).data().name+1 == cl  && cl % o.tilesH != 0) ||  ($(this).data().name-1 == cl && cl % o.tilesH != o.tilesH-1)){
									cl2 = $(this).data().name;
									$(this).data('name', cl).animate({'left': vs_h+(cl%o.tilesH * Math.floor(o.width/o.tilesH))+ 'px'}, o.duration);
									cl = cl2;
								}else if($(this).data().name+o.tilesH == cl || $(this).data().name-o.tilesH == cl){
									cl2 = $(this).data().name;
									$(this).data('name', cl).animate({'top': vs_v+(Math.floor(cl/o.tilesH) * Math.floor(o.height/o.tilesV))+ 'px'}, o.duration);
									cl = cl2;
								}
								
								if (Sort()){
									$('#bg' + rand).animate({'opacity': 1}, o.duration);
									$('#imgbg' + rand).animate({'opacity': 1}, o.duration, function(){ $('.img_title' + rand + '').css({'z-index':0}) });
									if(o.onCompleted) setTimeout(function() {o.onCompleted()}, o.duration+50);
								}
							});
							i++;
							if(i==sum-1){
								i_w = o.tilesH;
							}
						}
					}


					cl = tiles[tiles[sum-1]];

					var m_rand=0;
					i=0;

					if(o.shuffleNum!=0) setTimeout(Step, 100);
					function Step(){
						m_rand = Math.round(Math.random()*(sum-2));
						var parm_n = $('#img_num' + m_rand + rand).data().name;
						ii=false;
						while(!ii){
							if(cl1!=parm_n){
								if( (parm_n+1 == cl && cl % o.tilesH != 0) || (parm_n-1 == cl && cl % o.tilesH != o.tilesH-1) ){
									cl2 = parm_n;
									cl1 = cl;
									$('#img_num' + m_rand + rand).data('name', cl).animate({'left': vs_h+(cl%o.tilesH * Math.floor(o.width/o.tilesH))+ 'px'}, o.shuffleSpeed, Comp);
									cl = cl2;
									ii = true;
								}else if(parm_n+o.tilesH == cl || parm_n-o.tilesH == cl){						
									cl2 = parm_n;
									cl1 = cl;
									$('#img_num' + m_rand + rand).data('name', cl).animate({'top': vs_v+(Math.floor(cl/o.tilesH) * Math.floor(o.height/o.tilesV)) + 'px'}, o.shuffleSpeed, Comp);
									cl = cl2;
									ii = true;
								}
							}
							
							m_rand = Math.round(Math.random()*(sum-2));
							parm_n = $('#img_num' + m_rand + rand).data().name;
						}
						i++;
					}

					function Comp() {
						if(i<o.shuffleNum){
							setTimeout(Step, o.duration/5);
						}
					}
					function Sort() {
						for(i_h=0; i_h<sum-1; i_h++){
							if ($('#img_num' + i_h + rand).data().etalon == $('#img_num' + i_h + rand).data().name == false) {
								return false;
							}
						}
						return true;
					}
				}
			});
		}
	});
})(jQuery);