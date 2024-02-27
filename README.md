# png2webp

This is a simple WASM library designed to convert PNG images to WebP format.

## How it works

The main functionality of this project is provided by the `png2webp` function in the [src/lib.rs](src/lib.rs) file. This function takes a PNG image data as input and returns the converted WebP image data.

The function uses `image` crate for handling the image conversion. The `wasm-bindgen` crate is used to provide a bridge between Rust and JavaScript, allowing the `png2webp` function to be called from JavaScript code as WASM.

## Building the Project

To build the project, you can use the `cargo` command-line tool:

```sh
cargo build