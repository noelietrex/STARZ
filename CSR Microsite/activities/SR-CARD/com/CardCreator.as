package com {
	import com.files.FileManager;
	import flash.events.MouseEvent;
	import flash.display.MovieClip;
	import com.images.ImageManager;
	import flash.events.Event;
	import flash.display.Bitmap;
	import flash.utils.ByteArray;
	import com.view.ImageEditor;
	import com.events.AppEvent;
	
	public class CardCreator extends MovieClip {
		
		private var _file:FileManager;
		private var _image:ImageManager;
		private var _editor:ImageEditor;

		public function CardCreator() {
			_file = new FileManager();
			_file.addEventListener(Event.COMPLETE, imageReady);
			_file.addEventListener(AppEvent.SAVE_COMPLETE, saveComplete);
			
			_image = new ImageManager(mc_image, mc_image.mc_holder);
			
			_editor = new ImageEditor(mc_editor, mc_image);
			_editor.addEventListener(AppEvent.SAVE, processImage);
			_editor.hide();
			
			mc_image.mc_card.visible = false;
			
			// buttons
			b_select.addEventListener(MouseEvent.CLICK, selectFile);
			
			b_replay.addEventListener(MouseEvent.CLICK, replay);
			b_replay.hide();
			
			b_close.addEventListener(MouseEvent.CLICK, clearImage);
			b_close.hide();
		}
		
		private function selectFile(e:MouseEvent):void {
			mc_loader.show();
			_file.load();
		}
		
		private function clearImage(e:MouseEvent = null):void {
			_image.clearImage();
			mc_image.mc_card.visible = false;
			_editor.hide();
			b_select.show();
			b_close.hide();
		}
		
		private function processImage(e:AppEvent):void {
			var img:Bitmap = _image.captureImage();
			saveImage();
		}
		
		private function saveImage():void {
			mc_loader.show();
			var jpg:ByteArray = _image.createJPG();
			_file.save(jpg);
		}
		
		private function imageReady(e:Event):void {
			mc_loader.hide();
			_image.formatUserImage(_file.fileData);
			
			b_select.hide();
			b_close.show();
			_editor.show();
		}
		
		private function saveComplete(e:AppEvent):void {
			mc_loader.hide();
			b_close.hide();
			b_replay.show();
			_editor.hide();
		}
		
		private function replay(e:MouseEvent):void {
			b_replay.hide();
			clearImage();
		}

	}
	
}
