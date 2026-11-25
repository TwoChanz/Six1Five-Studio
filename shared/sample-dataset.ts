/**
 * The free stockpile photogrammetry sample dataset.
 *
 * The zip is about 109 MB, which is over GitHub's 100 MB per-file limit, so it
 * can't ship in the repo (client/public/downloads/*.zip is gitignored) and
 * Vercel never sees it. It has to be hosted somewhere else and linked here.
 *
 * This is the one place the site gets the dataset's address from: the home
 * page banner, the download modal, the Resources page and the email that
 * POST /api/dataset-download sends all read it. To change where the dataset
 * lives, change `url` below.
 */

export interface SampleDataset {
  /** Recorded on the lead as resource_requested. */
  title: string;
  /**
   * Where the zip is downloaded from: an absolute https URL to the hosted
   * file, or a site path under /downloads/ when it is served by the site.
   */
  url: string;
  /** File name offered to the browser when downloading. */
  fileName: string;
  /** Size shown on buttons and in the email. */
  sizeLabel: string;
}

export const SAMPLE_DATASET: SampleDataset = {
  title: "Stockpile Photogrammetry Sample Dataset",
  url: "/downloads/stockpile-photogrammetry-sample-dataset.zip",
  fileName: "Six1Five-Stockpile-Photogrammetry-Sample-Dataset.zip",
  sizeLabel: "109 MB",
};

/**
 * Turns the dataset URL into an absolute one for places that leave the site,
 * such as the download email. A site path is joined to `origin`.
 */
export function absoluteDatasetUrl(origin: string): string {
  return /^https?:\/\//i.test(SAMPLE_DATASET.url)
    ? SAMPLE_DATASET.url
    : `${origin.replace(/\/$/, "")}${SAMPLE_DATASET.url}`;
}
