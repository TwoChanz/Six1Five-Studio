import { Link } from "wouter";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import logoCircular from "@/assets/logo-circular-large.webp";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 pt-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={logoCircular}
              alt="Six1Five Studio"
              className="w-32 h-32 opacity-80"
            />
          </div>

          {/* 404 Message */}
          <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] bg-clip-text text-transparent">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>

          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Looks like this page got lost in the point cloud. Don't worry, we'll help you find your way back.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Link href="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 w-full sm:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                View Gallery
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/pricing" className="text-[hsl(199,89%,48%)] hover:underline text-sm">
                Pricing
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/insights" className="text-[hsl(199,89%,48%)] hover:underline text-sm">
                Insights
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/faq" className="text-[hsl(199,89%,48%)] hover:underline text-sm">
                FAQ
              </Link>
              <span className="text-gray-600">•</span>
              <a href="/#contact" className="text-[hsl(199,89%,48%)] hover:underline text-sm">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
