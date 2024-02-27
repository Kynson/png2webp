use wasm_bindgen::prelude::{ JsValue, JsError };

use image::ImageError;

#[derive(Debug)]
pub enum ConversionError {
  Decoding(String),
  Encoding(String),
  Parameter(String),
  Limits(String),
  Unsupported(String),
  IoError(String),
}

impl From<ImageError> for ConversionError {
  fn from(image_error: ImageError) -> Self {
    let error_description = image_error.to_string();

    match image_error {
      ImageError::Decoding(_) => Self::Decoding(error_description),
      ImageError::Encoding(_) => Self::Encoding(error_description),
      ImageError::Parameter(_) => Self::Parameter(error_description),
      ImageError::Limits(_) => Self::Limits(error_description),
      ImageError::Unsupported(_) => Self::Unsupported(error_description),
      ImageError::IoError(_) => Self::IoError(error_description),
    }
  }
}

impl From<ConversionError> for JsValue {
  fn from(conversion_error: ConversionError) -> Self {
    JsError::new(
      // Use debug formatting so that we have the variant name printed
      &format!("{conversion_error:?}")
    ).into()
  }
}