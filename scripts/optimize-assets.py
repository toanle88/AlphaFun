"""Convert the large RGBA learning PNGs to display-sized WebP files.

This intentionally uses only the Python standard library plus the system
libwebp encoder so the checked-in assets can be regenerated without adding a
runtime dependency to the app.
"""

from __future__ import annotations

import ctypes
import struct
import sys
import zlib
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "images"
TARGET_WIDTH = 512
LANCZOS_FILTER = 22


def read_png(path: Path) -> tuple[int, int, bytearray]:
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"not a PNG: {path}")

    width = height = None
    color_type = bit_depth = None
    compressed = bytearray()
    offset = 8
    while offset < len(data):
        size = struct.unpack_from(">I", data, offset)[0]
        chunk_type = data[offset + 4 : offset + 8]
        chunk = data[offset + 8 : offset + 8 + size]
        offset += 12 + size
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type = struct.unpack(">IIBB", chunk[:10])
        elif chunk_type == b"IDAT":
            compressed.extend(chunk)
        elif chunk_type == b"IEND":
            break

    if (width, height, bit_depth, color_type) != (width, height, 8, 6):
        raise ValueError(f"expected 8-bit RGBA PNG: {path}")

    raw = zlib.decompress(compressed)
    stride = width * 4
    rows = bytearray(height * stride)
    previous = bytearray(stride)
    cursor = 0

    for row_index in range(height):
        filter_type = raw[cursor]
        cursor += 1
        encoded = raw[cursor : cursor + stride]
        cursor += stride
        decoded = bytearray(stride)
        for index, value in enumerate(encoded):
            left = decoded[index - 4] if index >= 4 else 0
            up = previous[index]
            upper_left = previous[index - 4] if index >= 4 else 0
            if filter_type == 0:
                decoded[index] = value
            elif filter_type == 1:
                decoded[index] = (value + left) & 255
            elif filter_type == 2:
                decoded[index] = (value + up) & 255
            elif filter_type == 3:
                decoded[index] = (value + ((left + up) // 2)) & 255
            elif filter_type == 4:
                estimate = left + up - upper_left
                distances = abs(estimate - left), abs(estimate - up), abs(estimate - upper_left)
                predictor = left if distances[0] <= distances[1] and distances[0] <= distances[2] else up if distances[1] <= distances[2] else upper_left
                decoded[index] = (value + predictor) & 255
            else:
                raise ValueError(f"unsupported PNG filter {filter_type}: {path}")
        start = row_index * stride
        rows[start : start + stride] = decoded
        previous = decoded

    return width, height, rows


def resize_rgba(width: int, height: int, source: bytearray) -> tuple[int, int, bytearray]:
    if width <= TARGET_WIDTH:
        return width, height, source
    target_width = TARGET_WIDTH
    target_height = round(height * target_width / width)
    target = bytearray(target_width * target_height * 4)
    x_scale = width / target_width
    y_scale = height / target_height

    for target_y in range(target_height):
        source_y = min(height - 1, int((target_y + 0.5) * y_scale))
        for target_x in range(target_width):
            source_x = min(width - 1, int((target_x + 0.5) * x_scale))
            source_offset = (source_y * width + source_x) * 4
            target_offset = (target_y * target_width + target_x) * 4
            target[target_offset : target_offset + 4] = source[source_offset : source_offset + 4]
    return target_width, target_height, target


def encode_webp(width: int, height: int, rgba: bytearray, output: Path) -> None:
    encoder = ctypes.CDLL("libwebp.so.7")
    encoder.WebPEncodeRGBA.argtypes = [ctypes.POINTER(ctypes.c_uint8), ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_float, ctypes.POINTER(ctypes.POINTER(ctypes.c_uint8))]
    encoder.WebPEncodeRGBA.restype = ctypes.c_size_t
    encoder.WebPFree.argtypes = [ctypes.POINTER(ctypes.c_uint8)]

    pixels = (ctypes.c_uint8 * len(rgba)).from_buffer(rgba)
    encoded = ctypes.POINTER(ctypes.c_uint8)()
    size = encoder.WebPEncodeRGBA(pixels, width, height, width * 4, ctypes.c_float(90), ctypes.byref(encoded))
    if not size:
        raise RuntimeError(f"WebP encoding failed: {output}")
    try:
        output.write_bytes(ctypes.string_at(encoded, size))
    finally:
        encoder.WebPFree(encoded)


def convert_jpeg(source: Path, output: Path) -> tuple[int, int]:
    wand_library = ctypes.CDLL("libMagickWand-7.Q16.so.10")
    wand_library.MagickWandGenesis()
    wand_library.NewMagickWand.restype = ctypes.c_void_p
    wand_library.MagickReadImage.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
    wand_library.MagickReadImage.restype = ctypes.c_int
    wand_library.MagickGetImageWidth.argtypes = [ctypes.c_void_p]
    wand_library.MagickGetImageWidth.restype = ctypes.c_size_t
    wand_library.MagickGetImageHeight.argtypes = [ctypes.c_void_p]
    wand_library.MagickGetImageHeight.restype = ctypes.c_size_t
    wand_library.MagickResizeImage.argtypes = [ctypes.c_void_p, ctypes.c_size_t, ctypes.c_size_t, ctypes.c_int]
    wand_library.MagickResizeImage.restype = ctypes.c_int
    wand_library.MagickSetImageFormat.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
    wand_library.MagickSetImageFormat.restype = ctypes.c_int
    wand_library.MagickSetImageCompressionQuality.argtypes = [ctypes.c_void_p, ctypes.c_size_t]
    wand_library.MagickSetImageCompressionQuality.restype = ctypes.c_int
    wand_library.MagickWriteImage.argtypes = [ctypes.c_void_p, ctypes.c_char_p]
    wand_library.MagickWriteImage.restype = ctypes.c_int
    wand_library.DestroyMagickWand.argtypes = [ctypes.c_void_p]

    wand = wand_library.NewMagickWand()
    try:
        if not wand or not wand_library.MagickReadImage(wand, str(source).encode()):
            raise RuntimeError(f"ImageMagick could not read {source}")
        source_width = wand_library.MagickGetImageWidth(wand)
        source_height = wand_library.MagickGetImageHeight(wand)
        target_height = round(source_height * TARGET_WIDTH / source_width)
        if not wand_library.MagickResizeImage(wand, TARGET_WIDTH, target_height, LANCZOS_FILTER):
            raise RuntimeError(f"ImageMagick could not resize {source}")
        if not wand_library.MagickSetImageFormat(wand, b"webp"):
            raise RuntimeError(f"ImageMagick could not set WebP format for {source}")
        if not wand_library.MagickSetImageCompressionQuality(wand, 90):
            raise RuntimeError(f"ImageMagick could not set WebP quality for {source}")
        if not wand_library.MagickWriteImage(wand, str(output).encode()):
            raise RuntimeError(f"ImageMagick could not write {output}")
        return TARGET_WIDTH, target_height
    finally:
        wand_library.DestroyMagickWand(wand)
        wand_library.MagickWandTerminus()


def main() -> None:
    for source in sorted(SOURCE_DIR.glob("*.jpg")):
        target = source.with_suffix(".webp")
        width, height = convert_jpeg(source, target)
        print(f"{source.name}: {width}x{height} -> {target.name} ({target.stat().st_size} bytes)")

    for source in sorted(SOURCE_DIR.glob("*.png")):
        if source.read_bytes()[:8] != b"\x89PNG\r\n\x1a\n":
            print(f"{source.name}: skipped (not a PNG)")
            continue
        width, height, rgba = read_png(source)
        width, height, rgba = resize_rgba(width, height, rgba)
        target = source.with_suffix(".webp")
        encode_webp(width, height, rgba, target)
        print(f"{source.name}: {width}x{height} -> {target.name} ({target.stat().st_size} bytes)")


if __name__ == "__main__":
    sys.exit(main())
