package com.images {
	import flash.display.BitmapData;
	import flash.display.MovieClip;
	import flash.display.Bitmap;
	import flash.display.Stage;
	import flash.geom.Rectangle;
	import flash.display.PixelSnapping;
	import flash.geom.Matrix;
	import com.adobe.images.JPGEncoder;
	import flash.utils.ByteArray;

	public class ImageManager {

		private var _image: Bitmap;
		private var _imageHolder:MovieClip;
		private var _target: MovieClip;
		private var _stage: MovieClip;
		private var _imageLoaded: Boolean = false;
		private var _previewImage: Bitmap;
		private var _encoder:JPGEncoder;
		private var _bitmapData:BitmapData;
		private var _imgHeight:Number;
		private var _imgWidth:Number;

		public function ImageManager(mc: MovieClip, mcContainer:MovieClip) {
			_target = mc;
			_imageHolder = mcContainer;
			
			// these must be set while the movieclip is empty
			_imgHeight = _target.height;
			_imgWidth = _target.width;
			
			// jpg quality set to full
			_encoder = new JPGEncoder(100);
		}

		public function formatUserImage(i: Bitmap): void {
			// clear an existing image out
			if (_imageLoaded) clearImage();
			_imageLoaded = true;

			_image = i;

			var w = _image.width;
			var h = _image.height;

			// center the image before placing it
			_image.x = (-1*w) / 2;
			_image.y = (-1*h) / 2;

			_imageHolder.addChild(_image);
		}

		public function captureImage(): Bitmap {
			// specify the capture region
			var crop: Rectangle = new Rectangle(0, 0, _imgWidth, _imgHeight);
			
			// size the data
			_bitmapData = new BitmapData(_imgWidth, _imgHeight);
			
			// create new bmp for preview image
			_previewImage = new Bitmap(_bitmapData, PixelSnapping.ALWAYS, true);
			
			var cropMatrix:Matrix = new Matrix();
			cropMatrix.translate(0, 0);
			
			_bitmapData.draw(_target, cropMatrix, null, null, crop, true);
			
			return _previewImage;
		}
		
		public function createJPG():ByteArray {
			// create the data for file save
			var jpeg:ByteArray = _encoder.encode(_bitmapData);
			return jpeg;
		}

		public function clearImage(): void {
			if (_image) _imageHolder.removeChild(_image);
			_imageLoaded = false;
		}

	}

}