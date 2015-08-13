package com {
	import com.greensock.TweenLite;
	import com.greensock.easing.Quad;
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.display.Loader;
	import flash.events.Event;
	import flash.net.URLRequest;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.net.navigateToURL;

	public class Main extends MovieClip {

		private static const TWEEN: Number = .5;
		private var _introAssets: Array;
		private var _instructionAssets: Array;
		private var _holderMC: MovieClip;

		public function Main() {
			_introAssets = new Array(mc_players, mc_card, mc_ta, mc_starz, mc_tunein, b_start);
			_instructionAssets = new Array(mc_instructions, b_create);

			// the other swfs will load here
			_holderMC = new MovieClip();
			addChild(_holderMC);

			// buttons
			b_start.addEventListener(MouseEvent.CLICK, playInstructions);
			b_create.addEventListener(MouseEvent.CLICK, playCardBuilder);
			//b_terms.addEventListener(MouseEvent.CLICK, showTerms);

			// fire it up
			hideAssets(_introAssets);
			hideAssets(_instructionAssets);
			playIntro();
		}
		
		private function showTerms(e:MouseEvent):void {
			//navigateToURL(new URLRequest("terms.html"), "_blank");
		}

		private function playIntro(): void {
			showAssets(_introAssets);

			TweenLite.from(mc_key, TWEEN * 3, {
				alpha: 0,
				y: 0,
				delay: TWEEN,
				ease: Quad.easeOut
			});
			TweenLite.to(mc_dimmer, TWEEN * 3, {
				alpha: .5,
				delay: TWEEN * 4
			});
			TweenLite.from(mc_players, TWEEN / 2, {
				alpha: 0,
				x: -500,
				delay: TWEEN * 4,
				ease: Quad.easeOut
			});
			TweenLite.from(mc_card, TWEEN / 2, {
				alpha: 0,
				x: stage.stageWidth + 500,
				delay: TWEEN * 4,
				ease: Quad.easeOut
			});
			TweenLite.from(mc_ta, TWEEN / 2, {
				alpha: 0,
				x: -100,
				delay: TWEEN * 5,
				ease: Quad.easeOut
			});
			TweenLite.from(mc_tunein, TWEEN / 2, {
				alpha: 0,
				x: stage.stageWidth,
				delay: TWEEN * 5,
				ease: Quad.easeOut
			});
			TweenLite.from(mc_starz, TWEEN / 2, {
				alpha: 0,
				x: stage.stageWidth,
				delay: TWEEN * 5,
				ease: Quad.easeOut
			});
			TweenLite.from(b_start, TWEEN, {
				alpha: 0,
				delay: TWEEN * 6
			});
		}

		private function playInstructions(e: MouseEvent): void {
			cleanupScreen(_introAssets);
			showAssets(_instructionAssets);

			TweenLite.from(mc_instructions, TWEEN * 3, {
				alpha: 0,
				y: 100,
				delay: TWEEN,
				ease: Quad.easeOut
			});
			TweenLite.to(mc_dimmer, TWEEN * 3, {
				alpha: .8,
				delay: TWEEN
			});
			TweenLite.from(b_create, TWEEN / 2, {
				alpha: 0,
				x: 40,
				ease: Quad.easeOut,
				delay: TWEEN * 3
			});
		}

		private function playCardBuilder(e: MouseEvent): void {
			cleanupScreen(_instructionAssets);
			loadSWF("CardCreator.swf");

			TweenLite.to(mc_dimmer, TWEEN * 3, {
				alpha: .5,
				delay: TWEEN
			});
		}

		private function hideAssets(a): void {
			// remove the intro screen
			for (var i = 0; i < a.length; i++) {
				a[i].visible = false;
			}
		}

		private function showAssets(a): void {
			// remove the intro screen
			for (var i = 0; i < a.length; i++) {
				a[i].visible = true;
			}
		}

		private function cleanupScreen(a): void {
			// remove the intro screen
			for (var i = 0; i < a.length; i++) {
				var asset = a[i];
				TweenLite.to(asset, .5, {
					alpha: 0,
					onComplete: function () {
						asset.visible = false;
					}
				});
			}
		}

		private function loadSWF(swf): void {
			var my_swfLoader: Loader = new Loader();

			// event complete method with arguments
			var swfLoaded: Function = function (e: Event): void {
				my_swfLoader.removeEventListener(Event.COMPLETE, swfLoaded);
				mc_loader.hide();

				// remove any other loaded content
				if (_holderMC.numChildren == 1) {
					_holderMC.removeChildAt(0);
				}

				// load it and show it
				_holderMC.addChild(my_swfLoader);
				_holderMC.alpha = 0;

				TweenLite.to(_holderMC, TWEEN * 2, {
					alpha: 1,
					delay: TWEEN * 3
				});
			}

			my_swfLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, swfLoaded);
			my_swfLoader.load(new URLRequest(swf));

			mc_loader.show();
		}

		private function reset(): void {

		}
	}

}