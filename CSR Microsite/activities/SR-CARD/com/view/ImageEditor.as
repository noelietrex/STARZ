package com.view {
	import flash.display.MovieClip;
	import flash.display.DisplayObjectContainer;
	import flash.events.MouseEvent;
	import com.events.AppEvent;
	import com.greensock.TweenLite;

	public class ImageEditor extends MovieClip {

		private static const TOTAL_STEPS: Number = 3;
		private static const ZOOM_STEP: Number = 0.1;
		private var _stepCount = 0;
		private var _instance: MovieClip;
		private var _image: * ;
		private var _imgContainer: * ;

		public function ImageEditor(mc, img) {
			// the mc holding the image editing buttons
			_instance = mc;

			// the actual image we'll be moving around
			_imgContainer = img;

			// setup
			buildEditor();
		}

		private function buildEditor(): void {
			// add listeners to all the buttons in the mc
			_instance.mc_1.b_zoomin.addEventListener(MouseEvent.CLICK, handleClick);
			_instance.mc_1.b_zoomout.addEventListener(MouseEvent.CLICK, handleClick);
			_instance.mc_3.b_save.addEventListener(MouseEvent.CLICK, handleClick);
			_instance.b_next.addEventListener(MouseEvent.CLICK, handleClick);
			_instance.b_prev.addEventListener(MouseEvent.CLICK, handleClick);

			_instance.b_prev.hide();

			destroy();
		}

		private function handleClick(e: MouseEvent): void {
			var t = e.target.name;
			switch (t) {
				case 'b_zoomin':
					zoomImage(ZOOM_STEP);
					break;
				case 'b_zoomout':
					zoomImage(-1 * ZOOM_STEP);
					break;
				case 'b_save':
					dispatchEvent(new AppEvent(AppEvent.SAVE));
					break;
				case 'b_next':
					changeStep(1);
					break;
				case 'b_prev':
					changeStep(-1);
					break;
			}
		}

		private function addDrag(): void {
			_imgContainer.addEventListener(MouseEvent.MOUSE_DOWN, startImgDrag);
			_imgContainer.addEventListener(MouseEvent.MOUSE_UP, stopImgDrag);
		}

		private function removeDrag(): void {
			_imgContainer.removeEventListener(MouseEvent.MOUSE_DOWN, startImgDrag);
			_imgContainer.removeEventListener(MouseEvent.MOUSE_UP, stopImgDrag);
		}

		private function startImgDrag(e: MouseEvent): void {
			_image.startDrag();
		}

		private function stopImgDrag(e: MouseEvent): void {
			_image.stopDrag();
		}

		private function zoomImage(step): void {
			var newScale = _image.scaleX + step;
			TweenLite.to(_image, .5, {
				scaleX: newScale,
				scaleY: newScale
			});
		}

		private function changeStep(step): void {
			var currentStep = _stepCount;

			_stepCount += step;

			if (_stepCount < 0) {
				_stepCount = 0;
			} else if (_stepCount == TOTAL_STEPS) {
				_stepCount = TOTAL_STEPS - 1;
			} else {
				loadStep(_stepCount, currentStep);
			}

			// toggle buttons
			if (_stepCount == 0) {
				_instance.b_prev.hide();
			} else {
				_instance.b_prev.show();
			}

			if (_stepCount == TOTAL_STEPS - 1) {
				_instance.b_next.hide();
			} else {
				_instance.b_next.show();
			}
		}

		private function loadStep(a, b): void {
			// hide the previous, show the new
			_instance.getChildAt(b).visible = false;
			_instance.getChildAt(a).visible = true;

			// setup drag if it's the first screen
			if (a == 0) {
				addDrag();
			} else {
				removeDrag();
			}

			// setup text if it's the last screen
			if (a == (TOTAL_STEPS - 1)) {
				// get the text
				var myText = _instance.mc_2.t_username.text;
				if (myText == '') myText = "Super CSR";
				// if it's the last step, show the card and add the text they entered for a username
				_imgContainer.mc_card.visible = true;
				_imgContainer.mc_card.t_name.text = myText;
			} else {
				// if it's not the last step, keep the card hidden
				_imgContainer.mc_card.visible = false;
			}
		}

		private function reset(): void {
			// hide the menu options, then show the first one
			for (var i = 0; i < TOTAL_STEPS; i++) {
				_instance.getChildAt(i).visible = false;
				_stepCount = 0;
				loadStep(0, 1);
			}

			_instance.b_prev.hide();
			_instance.b_next.show();

			// reset the image scale if they load a new one
			try {
				_image.scaleX = 1;
				_image.scaleY = 1;
			} catch (e: Error) {

			}

		}

		public function hide(): void {
			TweenLite.to(_instance, .25, {
				alpha: 0,
				onComplete: destroy
			});
		}

		public function show(): void {
			reset();

			_instance.visible = true;
			_image = _imgContainer.getChildAt(2);
			_imgContainer.addEventListener(MouseEvent.MOUSE_OUT, stopImgDrag);

			TweenLite.to(_instance, .25, {
				alpha: 1
			});
		}

		public function destroy(): void {
			_instance.visible = false;
			_imgContainer.removeEventListener(MouseEvent.MOUSE_OUT, stopImgDrag);
		}

	}

}