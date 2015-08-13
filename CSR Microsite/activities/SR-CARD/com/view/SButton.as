package com.view {
	import flash.display.MovieClip;
	
	public class SButton extends MovieClip {

		public function SButton() {
			this.buttonMode = true;
		}
		
		public function show():void {
			this.visible = true;
		}
		
		public function hide():void {
			this.visible = false;
		}

	}
	
}
