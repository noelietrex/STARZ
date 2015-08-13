package com.events {
	import flash.events.Event;
	
	public class AppEvent extends Event {
		
		public static const SAVE:String = 'save';
		public static const SAVE_COMPLETE:String = 'save_complete';

		public function AppEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false):void {
			super(type, bubbles, cancelable);
		}

	}
	
}
