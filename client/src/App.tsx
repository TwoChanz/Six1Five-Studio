import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA, trackPageView } from "@/lib/analytics";
import Home from "@/pages/home";

// Lazy load non-critical pages
const Gallery = lazy(() => import("@/pages/gallery"));
const PortfolioDetail = lazy(() => import("@/pages/portfolio-detail"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const FAQ = lazy(() => import("@/pages/faq"));
const Resources = lazy(() => import("@/pages/resources"));
const Links = lazy(() => import("@/pages/links"));
const Admin = lazy(() => import("@/pages/admin"));
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
        <Route path="/portfolio">
          <Redirect to="/gallery" />
        </Route>
        <Route path="/gallery">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Gallery />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/portfolio/:id">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <PortfolioDetail />
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
        <Route path="/resources">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Resources />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/links">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Links />
            </ErrorBoundary>
          </Suspense>
        </Route>
        <Route path="/admin">
          <Suspense fallback={<div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
            <ErrorBoundary>
              <Admin />
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
  useEffect(() => {
    // Initialize analytics
    initGA();
  }, []);

  // No full-screen splash: the page renders as soon as the JS bundle runs,
  // so visitors (and Google's renderer) see real content on first paint
  // instead of a progress bar.
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
