"""
Makes web-sized copies of your product photos.

    products/garlic_powder.jpg  (original, any size)
        -> images/products/garlic_powder.jpg  (1200px, ~150-300 KB, used by the website)

Run it after adding or replacing any photo in the products/ folder:
    double-click update-images.bat   (or run:  python optimize-images.py)

Needs Pillow:  pip install pillow
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "products"
OUTPUT = ROOT / "images" / "products"
MAX_SIZE = 1200  # px, longest side
QUALITY = 82  # JPEG quality (1-95)
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    photos = sorted(p for p in SOURCE.iterdir() if p.suffix.lower() in EXTENSIONS)
    if not photos:
        print(f"No photos found in {SOURCE}")
        return

    for src in photos:
        dest = OUTPUT / (src.stem + ".jpg")
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
            im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        print(f"  {src.name:<28} -> images/products/{dest.name}  ({dest.stat().st_size // 1024} KB)")

    print(f"\nDone. {len(photos)} photo(s) ready for the website.")


if __name__ == "__main__":
    main()
