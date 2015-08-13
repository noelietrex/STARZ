package com.view {
	import flash.display.MovieClip;
	import com.greensock.TweenLite;

	public class LoadScreen extends MovieClip {

		public function LoadScreen() {
			destroy();
		}

		public function show(): void {
			TweenLite.to(this, .25, {
				alpha: 1
			});
		}

		public function hide(): void {
			TweenLite.to(this, .25, {
				alpha: 0,
				onComplete: destroy
			});
		}

		private function destroy(): void {
			this.visible = false;
		}

	}

}