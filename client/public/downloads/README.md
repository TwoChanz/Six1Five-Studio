# Downloads Directory

This directory contains large downloadable assets that are too big for git.

## Files Not in Git (Upload Separately)

### `stockpile-photogrammetry-sample-dataset.zip` (109 MB)
- **Source**: `C:\Users\Overlord\Downloads\StockpileScanPhotos&GCPs\StockpileScanPhotos&GCPs\Dataset sample 1`
- **Contents**: 28 DJI aerial photos + 2 GCP files
- **Purpose**: Free sample dataset for photogrammetry learning
- **Deploy Location**: This file must be manually uploaded to production

## Manual Upload Instructions

### Option 1: Vercel CLI (Recommended)
Since Vercel builds from git and this file is gitignored, you need to:

1. After deployment completes, manually copy the file to the production server
2. Or use Vercel Blob Storage for large files

### Option 2: Build-time Copy
The file is already in this directory locally and will be included in the Vite build output to `dist/downloads/`.

When you run `npm run build`:
- Vite copies `client/public/*` to `dist/`
- Including `client/public/downloads/stockpile-photogrammetry-sample-dataset.zip`
- This file will be deployed with the build

**Verification**: After deployment, check https://six1fivestudio.com/downloads/stockpile-photogrammetry-sample-dataset.zip
