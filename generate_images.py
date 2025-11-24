import os
from pathlib import Path
from PIL import Image

PRODUCTS_DIR = Path('assets/images/products')
TARGET_WIDTHS = [300, 600]

for img_path in PRODUCTS_DIR.glob('*.png'):
    try:
        img = Image.open(img_path).convert('RGB')
        stem = img_path.stem  # filename without extension
        # Save original webp
        original_webp = PRODUCTS_DIR / f'{stem}.webp'
        img.save(original_webp, 'WEBP', quality=85, method=6)
        # Generate resized variants
        for w in TARGET_WIDTHS:
            ratio = w / img.width
            new_h = int(img.height * ratio)
            resized = img.resize((w, new_h), Image.LANCZOS)
            resized.save(PRODUCTS_DIR / f'{stem}-{w}.webp', 'WEBP', quality=80, method=6)
            resized.save(PRODUCTS_DIR / f'{stem}-{w}.png')  # png fallback variant
        print(f'Generated variants for {img_path.name}')
    except Exception as e:
        print(f'Failed {img_path}: {e}')
