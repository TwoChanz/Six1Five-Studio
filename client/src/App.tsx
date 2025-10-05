import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "@/components/loading-screen";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA, trackPageView } from "@/lib/analytics";
import Home from "@/pages/home";

// Lazy load non-critical pages
const Gallery = lazy(() => import("@/pages/gallery"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const FAQ = lazy(() => import("@/pages/faq"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // Track page views on route change
    trackPageView(location);
  }, [location]);

  return (
    <ErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/gallery">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Gallery />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/pricing">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Pricing />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/blog">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Blog />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/blog/:slug">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <BlogPost />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/faq">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <FAQ />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route>
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <NotFound />
            </ErrorBoundary>
          </Suspense>
        </Route>
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize analytics
    initGA();

    // Check if app is actually ready instead of arbitrary delay
    const checkReady = async () => {
      // Wait for critical resources to load
      await Promise.all([
        // Wait for fonts to load
        document.fonts.ready,
        // Wait for DOM to be ready
        new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve(true);
          } else {
            window.addEventListener('load', resolve);
          }
        })
      ]);
      
      // Minimal delay to show the loading screen briefly
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    checkReady();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingScreen 
          isLoading={isLoading} 
          onLoadingComplete={() => setIsLoading(false)} 
        />
        {!isLoading && (
          <>
            <Toaster />
            <Router />
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
