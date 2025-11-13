# PWA Icons Required

The following icon sizes are needed for the PWA to work properly:

## Required Sizes
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate

### Option 1: Using ImageMagick
```bash
cd assets/icons
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Option 2: Using Online Tools
1. Visit https://realfavicongenerator.net/
2. Upload the icon.svg file
3. Download the generated icons package
4. Extract to this directory

### Option 3: Using Inkscape
```bash
for size in 72 96 128 144 152 192 384 512; do
  inkscape icon.svg -w $size -h $size -o icon-${size}x${size}.png
done
```

## Temporary Workaround

Until proper icons are generated, the PWA will work but may show:
- Browser default icon in install prompts
- Missing icon warnings in browser console

The app functionality is not affected by missing icons.
