# Downloads Directory

Files here are served by the site at `/downloads/...`. Only what is committed to
git gets deployed, because Vercel builds from the repo.

## Stockpile sample dataset (not in git)

`stockpile-photogrammetry-sample-dataset.zip` is about 109 MB: 28 DJI aerial
photos and 2 GCP files. That is over GitHub's 100 MB per-file limit, so it is
gitignored (`client/public/downloads/*.zip`) and never reaches Vercel.

Copying it here locally does not help the live site. Host the zip somewhere
that serves large files (for example Vercel Blob, Supabase Storage, or a
GitHub Release asset), then put its https address in `url` in
`shared/sample-dataset.ts`. Every download button and the download email read
the address from there.

If a file under `/downloads/` is missing, the site now returns a 404 instead of
the home page (see the rewrite in `vercel.json`), so a missing file can't be
saved as a broken `.zip` of the home page again.
