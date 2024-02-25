use wasm_bindgen::prelude::*;

use image::{ DynamicImage, ImageOutputFormat };
use image::codecs::png::PngDecoder;

use std::io::Cursor;

#[wasm_bindgen]
// Errors in this function will be handled by JS
pub fn png2webp(png_data: &[u8]) -> Vec<u8> {
  let png_decoder = PngDecoder::new(png_data).unwrap();

  let dynamic_png = DynamicImage::from_decoder(png_decoder).unwrap();

  // Pre-allocated memory for header
  // Reference: https://www.iana.org/assignments/media-types/image/webp
  let mut webp_data = Cursor::new(vec![0u8; 15]);
  // This will construct a WebP image using WebP encoder and write the result into webp_data
  // Note that the source PNG's color_type must be L8, La8 Rgb8 or Rgba8
  dynamic_png.write_to(&mut webp_data, ImageOutputFormat::WebP).unwrap();

  webp_data.into_inner()
}