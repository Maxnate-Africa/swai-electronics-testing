import argparse
import json
from pathlib import Path
from PIL import Image

"""
Responsive image variant generator.
Keeps only original PNGs in version control (variants ignored by .gitignore).
Generates WebP + PNG resized derivatives for performance in CI.

Usage examples:
  python generate_images.py
  python generate_images.py --widths 300,600,900 --webp-quality 80 --webp-quality-original 85
"""

PRODUCTS_DIR = Path('assets/images/products')

parser = argparse.ArgumentParser(description='Generate responsive image variants (PNG + WebP).')
parser.add_argument('--widths', default='300,600', help='Comma-separated list of target widths (integers).')
parser.add_argument('--webp-quality-original', type=int, default=88, help='Quality for original (full size) WebP.')
parser.add_argument('--webp-quality', type=int, default=82, help='Quality for resized WebP variants.')
parser.add_argument('--png-compress-level', type=int, default=6, help='PNG compress_level (0-9).')
parser.add_argument('--lossless-threshold', type=int, default=900, help='Width threshold above which original WebP saved lossless.')
args = parser.parse_args()

try:
    TARGET_WIDTHS = [int(w.strip()) for w in args.widths.split(',') if w.strip()]
except ValueError:
    print('Invalid --widths argument, falling back to [300, 600]')
    TARGET_WIDTHS = [300, 600]

manifest = {}

def human_size(num_bytes: int) -> str:
    for unit in ['B','KB','MB','GB']:
        if num_bytes < 1024.0:
            return f"{num_bytes:3.1f}{unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f}TB"

for img_path in PRODUCTS_DIR.glob('*.png'):
    try:
        img = Image.open(img_path)
        # Prevent accidental upscaling; keep only widths smaller than original
        valid_widths = [w for w in TARGET_WIDTHS if w < img.width]
        stem = img_path.stem
        original_webp_path = PRODUCTS_DIR / f'{stem}.webp'

        # Convert to RGB for consistent encoding
        rgb = img.convert('RGB')

        webp_kwargs = {
            'format': 'WEBP',
            'method': 6
        }
        if img.width >= args.lossless_threshold:
            # For very large originals prefer visually lossless higher quality
            webp_kwargs['quality'] = min(args.webp_quality_original + 4, 100)
        else:
            webp_kwargs['quality'] = args.webp_quality_original

        rgb.save(original_webp_path, **webp_kwargs)

        variant_entries = []
        for w in valid_widths:
            ratio = w / img.width
            new_h = max(1, int(img.height * ratio))
            resized = rgb.resize((w, new_h), Image.LANCZOS)

            webp_variant = PRODUCTS_DIR / f'{stem}-{w}.webp'
            png_variant = PRODUCTS_DIR / f'{stem}-{w}.png'

            resized.save(webp_variant, 'WEBP', quality=args.webp_quality, method=6)
            resized.save(png_variant, optimize=True, compress_level=args.png_compress_level)

            variant_entries.append({
                'width': w,
                'height': new_h,
                'webp': webp_variant.name,
                'png': png_variant.name,
            })

        manifest[img_path.name] = {
            'original': img_path.name,
            'original_webp': original_webp_path.name,
            'original_dimensions': {'width': img.width, 'height': img.height},
            'variants': variant_entries
        }

        sizes = [original_webp_path.stat().st_size] + [ (PRODUCTS_DIR / v['webp']).stat().st_size for v in variant_entries ]
        print(f"Generated {len(variant_entries)} variant(s) for {img_path.name} | original webp {human_size(sizes[0])}")
    except Exception as e:
        print(f'Failed {img_path}: {e}')

# Write manifest (ignored by git if desired)
manifest_path = PRODUCTS_DIR / 'variants-manifest.json'
try:
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    print(f'Wrote manifest: {manifest_path}')
except Exception as e:
    print(f'Could not write manifest: {e}')

print('Image generation complete.')
