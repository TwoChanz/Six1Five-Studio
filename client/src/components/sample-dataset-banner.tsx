import { Database, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SampleDatasetBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-[hsl(158,64%,52%)]/10 to-[hsl(199,89%,48%)]/10 border-y border-[hsl(158,64%,52%)]/20">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Icon & Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="p-3 rounded-lg bg-[hsl(158,64%,52%)]/20 border border-[hsl(158,64%,52%)]/30">
                  <Database className="w-8 h-8 text-[hsl(158,64%,52%)]" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Free Sample Dataset
                </h2>
              </div>
              <p className="text-lg text-gray-300 mb-2">
                <strong>28 high-resolution aerial photos</strong> with Ground Control Points
              </p>
              <p className="text-gray-400">
                Perfect for testing RealityCapture, Pix4D, or Agisoft Metashape workflows. Complete stockpile photogrammetry dataset ready for processing.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <a href="/downloads/stockpile-photogrammetry-sample-dataset.zip" download>
                <Button
                  size="lg"
                  className="bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,42%)] text-white font-semibold px-8"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download (109 MB)
                </Button>
              </a>
              <Link href="/resources">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[hsl(158,64%,52%)] text-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,52%)] hover:text-white"
                >
                  More Resources
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
