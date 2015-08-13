package com.files {
	import flash.net.FileReference;
	import flash.events.Event;
	import flash.net.FileFilter;
	import flash.events.ProgressEvent;
	import flash.display.Loader;
	import flash.events.EventDispatcher;
	import flash.display.Sprite;
	import flash.utils.ByteArray;
	import com.events.AppEvent;

	public class FileManager extends Sprite {

		private var _loadFile: FileReference;
		private var _filter: FileFilter = new FileFilter("Images: (*.jpeg, *.jpg)", "*.jpeg; *.jpg");
		private var _progress: Number;
		private var _loader: Loader;
		private var _fileData:*;

		public function FileManager() {
			_loadFile = new FileReference();
			_loader = new Loader();
		}

		public function load(): void {
			// select the file using the filter defined
			_loadFile = new FileReference();
			_loadFile.addEventListener(Event.SELECT, selectHandler);
			_loadFile.browse([_filter]);
		}
		
		public function save(jpg:ByteArray):void {
			var finalFile:FileReference = new FileReference();
			finalFile.addEventListener(Event.COMPLETE, saveCompleteHandler);
			finalFile.save(jpg, "SurvivorsRemorse.jpg");
		}

		private function selectHandler(e: Event): void {
			// load the selected file
			cleanupListeners();

			_loadFile.addEventListener(Event.COMPLETE, loadCompleteHandler);
			_loadFile.addEventListener(ProgressEvent.PROGRESS, progressHandler);
			_loadFile.load();
		}

		private function loadCompleteHandler(e: Event): void {
			// load the data with a loader to create a bitmap object
			cleanupListeners();

			_loader = new Loader();
			_loader.contentLoaderInfo.addEventListener(Event.COMPLETE, loadBytesHandler);
			_loader.contentLoaderInfo.addEventListener(ProgressEvent.PROGRESS, progressHandler);

			_loader.loadBytes(_loadFile.data);
		}
		
		private function loadBytesHandler(e:Event) {
			// store the bitmap data
			_fileData = _loader.contentLoaderInfo.content;
			
			cleanupListeners();
			imageReady();
		}

		private function progressHandler(e: ProgressEvent): void {
			var loaded = e.bytesLoaded;
			var total = e.bytesTotal;

			_progress = Math.round(100 * (loaded / total));
		}
		
		private function saveCompleteHandler(e:Event):void {
			e.target.removeEventListener(Event.COMPLETE, saveCompleteHandler);
			this.dispatchEvent(new AppEvent(AppEvent.SAVE_COMPLETE));
		}

		private function cleanupListeners(): void {
			if (_loadFile.hasEventListener(Event.SELECT)) _loadFile.removeEventListener(Event.SELECT, selectHandler);
			if (_loadFile.hasEventListener(Event.COMPLETE)) _loadFile.removeEventListener(Event.COMPLETE, loadCompleteHandler);
			if (_loadFile.hasEventListener(ProgressEvent.PROGRESS)) _loadFile.removeEventListener(ProgressEvent.PROGRESS, progressHandler);
			if (_loader.hasEventListener(Event.COMPLETE)) _loader.removeEventListener(Event.COMPLETE, loadBytesHandler);
			if (_loader.hasEventListener(ProgressEvent.PROGRESS)) _loader.removeEventListener(ProgressEvent.PROGRESS, progressHandler);
		}
		
		private function imageReady():void {
			this.dispatchEvent(new Event(Event.COMPLETE));
		}

		public function get progress(): Number {
			return _progress;
		}
		
		public function get fileData():* {
			return _fileData;
		}

	}

}