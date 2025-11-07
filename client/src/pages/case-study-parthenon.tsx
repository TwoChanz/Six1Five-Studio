import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { trackPageView } from "@/lib/analytics";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SEOHead, getCanonicalUrl } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ParthenonCaseStudy() {
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Analytics tracking
  useEffect(() => {
    trackPageView('/case-study/parthenon');
  }, []);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible && visible.intersectionRatio > 0.3) {
          const step = visible.target.getAttribute("data-step");
          if (step) {
            setActiveSection(Number.parseInt(step));
          }
        }
      },
      {
        root: container,
        threshold: [0.3, 0.5, 0.7],
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleSectionChange = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const progressPercentage = ((activeSection + 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <SEOHead
        title="Nashville Parthenon Case Study - Six1Five Studio | Architectural Analysis"
        description="Conceptual case study: Solar path analysis, structural assessment, and photovoltaic retrofit proposal for the historic Nashville Parthenon. Demonstrates architectural analysis methodology."
        keywords="architectural analysis, solar path study, structural assessment, heritage building retrofit, photovoltaic integration, conceptual design"
        canonicalUrl={getCanonicalUrl('/case-study/parthenon')}
      />

      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[hsl(218,11%,12%)] to-[hsl(218,11%,18%)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-contrast-medium hover:text-contrast-high">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/50 text-sm px-4 py-1">
            CONCEPTUAL STUDY
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-contrast-high mb-6">
            Nashville Parthenon
          </h1>
          <p className="text-xl sm:text-2xl text-contrast-medium max-w-3xl mx-auto mb-4">
            Architectural Site Analysis & Solar Retrofit Strategy
          </p>
          <p className="text-sm text-contrast-low max-w-2xl mx-auto">
            A comprehensive analysis demonstrating solar path evaluation, structural assessment, and sustainable retrofit methodology for historic landmark buildings.
          </p>
        </div>
      </div>

      {/* Navigation Rail */}
      <div className="sticky top-20 z-30 bg-[hsl(218,11%,15%)]/95 backdrop-blur-sm border-b border-[hsl(218,11%,25%)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex gap-2 overflow-x-auto">
              {['Site Context', 'Sun Path', 'Structural Load', 'Solar Retrofit'].map((title, index) => (
                <button
                  key={index}
                  onClick={() => handleSectionChange(index)}
                  className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${
                    activeSection === index
                      ? 'bg-orange-500 text-white'
                      : 'text-contrast-medium hover:text-contrast-high hover:bg-[hsl(218,11%,20%)]'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
            <div className="text-sm text-contrast-low ml-4 whitespace-nowrap">
              {activeSection + 1} / 4
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[hsl(218,11%,20%)]">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <main
        ref={scrollContainerRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
      >
        {/* Section 1: Site Context */}
        <section
          ref={(el) => { sectionRefs.current[0] = el }}
          data-step="0"
          className="scroll-mt-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-4 bg-gray-500/20 text-gray-400 border-gray-500/50">
                01 — SITE CONTEXT
              </Badge>
              <h2 className="text-3xl font-bold text-contrast-high mb-4">
                Historic Full-Scale Replica
              </h2>
              <p className="text-contrast-medium leading-relaxed mb-6">
                The Nashville Parthenon is a full-scale replica of the original Parthenon in Athens, Greece. Built in 1897 for
                Tennessee's Centennial Exposition, it stands as the only full-scale reproduction of the ancient structure.
                Located in Centennial Park, the building serves as an art museum and iconic landmark.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                  <div className="text-xs text-contrast-low mb-1">LOCATION</div>
                  <div className="text-sm font-medium text-contrast-high">36.15° N, 86.81° W</div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                  <div className="text-xs text-contrast-low mb-1">CONSTRUCTED</div>
                  <div className="text-sm font-medium text-contrast-high">1897</div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                  <div className="text-xs text-contrast-low mb-1">STYLE</div>
                  <div className="text-sm font-medium text-contrast-high">Greek Revival</div>
                </div>
              </div>

              <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                <h3 className="text-sm font-bold text-contrast-high mb-2">KEY INSIGHTS</h3>
                <ul className="space-y-2 text-sm text-contrast-medium">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Only full-scale Parthenon replica in the world
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Serves dual purpose as museum and architectural monument
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Strategic park location provides unobstructed solar access
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/case-studies/parthenon/parthenon-photo.png"
                alt="Nashville Parthenon full-scale replica"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-xs text-contrast-low mt-3 text-center">
                SITE PHOTOGRAPH — Full-scale replica (1897) of Ancient Greek Parthenon
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Sun Path */}
        <section
          ref={(el) => { sectionRefs.current[1] = el }}
          data-step="1"
          className="scroll-mt-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="relative order-2 lg:order-1">
              <img
                src="/images/case-studies/parthenon/sun-path.png"
                alt="Sun path diagram showing azimuth and shadow bearings"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-xs text-contrast-low mt-3 text-center">
                SUN AZIMUTH & SHADOW BEARINGS — Nashville Parthenon (36.15° N, 86.81° W)
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/50">
                02 — SUN PATH ANALYSIS
              </Badge>
              <h2 className="text-3xl font-bold text-contrast-high mb-4">
                Daily Solar Exposure Analysis
              </h2>
              <p className="text-contrast-medium leading-relaxed mb-6">
                The building's east-west orientation creates distinct shadow patterns throughout the day. Morning sun (115°
                ESE) produces long WNW shadows (~300°), while the high noon sun (180° due south) creates minimal north-facing
                shadows. Evening sun (255° WSW) generates extended ENE shadows (~75°).
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-orange-500">
                  <div className="text-xs font-bold text-contrast-high mb-1">MORNING (8 AM) — 115° ESE</div>
                  <div className="text-xs text-contrast-medium">
                    Low sun angle creates extended WNW shadows (~300°). West pediment receives minimal direct exposure.
                  </div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-blue-500">
                  <div className="text-xs font-bold text-contrast-high mb-1">NOON (12 PM) — 180° DUE SOUTH</div>
                  <div className="text-xs text-contrast-medium">
                    High noon sun position creates short north-facing shadows. Maximum roof exposure for solar collection.
                  </div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-orange-500">
                  <div className="text-xs font-bold text-contrast-high mb-1">EVENING (6 PM) — 255° WSW</div>
                  <div className="text-xs text-contrast-medium">
                    Extended evening exposure on west pediment. ENE shadows (~75°) indicate optimal west-facing solar
                    orientation.
                  </div>
                </div>
              </div>

              <div className="relative mb-6">
                <img
                  src="/images/case-studies/parthenon/context-views.png"
                  alt="Morning, noon, and evening shadow studies"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                <h3 className="text-sm font-bold text-contrast-high mb-2">KEY INSIGHTS</h3>
                <ul className="space-y-2 text-sm text-contrast-medium">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    West pediment receives optimal evening solar exposure (255° WSW)
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    East-west building axis maximizes daily sun path coverage
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Extended evening exposure ideal for peak energy demand periods
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Structural Load Paths */}
        <section
          ref={(el) => { sectionRefs.current[2] = el }}
          data-step="2"
          className="scroll-mt-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <Badge className="mb-4 bg-gray-500/20 text-gray-400 border-gray-500/50">
                03 — STRUCTURAL ANALYSIS
              </Badge>
              <h2 className="text-3xl font-bold text-contrast-high mb-4">
                Classical Load-Bearing System
              </h2>
              <p className="text-contrast-medium leading-relaxed mb-6">
                The Parthenon employs a classical post-and-lintel structural system. Doric columns (peristyle) support
                horizontal entablature beams, which in turn carry the pediment and roof structure. The naos (inner chamber)
                provides additional structural support and houses the main gallery space.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-contrast-high mb-3">STRUCTURAL COMPONENTS</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-contrast-high">PERISTYLE</div>
                        <div className="text-xs text-contrast-low">Outer colonnade of Doric columns</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-contrast-high">NAOS</div>
                        <div className="text-xs text-contrast-low">Inner chamber and gallery space</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-contrast-high">ROOF STRUCTURE</div>
                        <div className="text-xs text-contrast-low">Spanning timber trusses and beams</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-contrast-high">PEDIMENT</div>
                        <div className="text-xs text-contrast-low">Triangular gable with sculptural elements</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-contrast-high mb-3">LOAD PATH HIERARCHY</h3>
                  <div className="space-y-2 text-xs text-contrast-medium">
                    <p>1. Roof loads transfer through timber trusses to entablature</p>
                    <p>2. Entablature distributes loads to column capitals</p>
                    <p>3. Columns carry vertical loads to stylobate (platform)</p>
                    <p>4. Foundation distributes loads to ground</p>
                  </div>
                  <div className="mt-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/30 border-l-4 border-l-blue-500">
                    <div className="text-xs font-medium text-contrast-high mb-1">STRUCTURAL CAPACITY</div>
                    <div className="text-xs text-contrast-medium">
                      Existing roof structure can accommodate additional distributed loads from solar panel integration with
                      minimal reinforcement.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                <h3 className="text-sm font-bold text-contrast-high mb-2">KEY INSIGHTS</h3>
                <ul className="space-y-2 text-sm text-contrast-medium">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Post-and-lintel system provides clear load paths
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Roof structure capable of supporting solar panel loads
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Pediment orientation ideal for west-facing solar integration
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/case-studies/parthenon/structural-axon.png"
                alt="Structural axonometric showing naos, peristyle, and pediment"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-xs text-contrast-low mt-3 text-center">
                STRUCTURAL AXONOMETRIC — Naos, Peristyle, Pediment with Sculpture
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Conceptual Retrofit */}
        <section
          ref={(el) => { sectionRefs.current[3] = el }}
          data-step="3"
          className="scroll-mt-32"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="relative order-2 lg:order-1">
              <img
                src="/images/case-studies/parthenon/solar-retrofit.png"
                alt="Solar panel retrofit on west pediment roof plane"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-xs text-contrast-low mt-3 text-center">
                SOLAR RETROFIT CONCEPT — Integrated photovoltaic panels on pediment
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/50">
                04 — CONCEPTUAL RETROFIT
              </Badge>
              <h2 className="text-3xl font-bold text-contrast-high mb-4">
                West Pediment Solar Integration
              </h2>
              <p className="text-contrast-medium leading-relaxed mb-6">
                The conceptual retrofit proposes integrating photovoltaic panels on the west pediment roof plane, taking
                advantage of the optimal 255° WSW evening sun orientation. This approach maximizes energy generation during
                peak demand hours while requiring minimal structural intervention to the historic building.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-orange-500">
                  <div className="text-xs font-bold text-orange-500 mb-1">OPTIMAL ORIENTATION</div>
                  <div className="text-xs text-contrast-medium">
                    West pediment faces 255° WSW, capturing extended evening sun exposure during peak energy demand
                    periods (4-8 PM).
                  </div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-blue-500">
                  <div className="text-xs font-bold text-blue-500 mb-1">MINIMAL INTERVENTION</div>
                  <div className="text-xs text-contrast-medium">
                    Solar panels integrate with existing roof structure without modifying historic columns or pediment
                    sculpture.
                  </div>
                </div>
                <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)] border-l-4 border-l-gray-500">
                  <div className="text-xs font-bold text-gray-400 mb-1">REVERSIBLE INSTALLATION</div>
                  <div className="text-xs text-contrast-medium">
                    Mounting system designed for future removal without permanent alterations to historic fabric.
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-contrast-high mb-3">TECHNICAL SPECIFICATIONS</h3>
              <div className="bg-[hsl(218,11%,18%)] rounded-lg border border-[hsl(218,11%,25%)] overflow-hidden mb-6">
                <div className="grid grid-cols-2 divide-x divide-[hsl(218,11%,25%)]">
                  <div className="p-3 border-b border-[hsl(218,11%,25%)]">
                    <div className="text-xs text-contrast-low mb-1">Panel Area</div>
                    <div className="text-sm font-medium text-contrast-high">~320 m²</div>
                  </div>
                  <div className="p-3 border-b border-[hsl(218,11%,25%)]">
                    <div className="text-xs text-contrast-low mb-1">Orientation</div>
                    <div className="text-sm font-medium text-contrast-high">255° WSW</div>
                  </div>
                  <div className="p-3 border-b border-[hsl(218,11%,25%)]">
                    <div className="text-xs text-contrast-low mb-1">Roof Pitch</div>
                    <div className="text-sm font-medium text-contrast-high">~15°</div>
                  </div>
                  <div className="p-3 border-b border-[hsl(218,11%,25%)]">
                    <div className="text-xs text-contrast-low mb-1">Peak Generation</div>
                    <div className="text-sm font-medium text-contrast-high">4-8 PM</div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30 border-l-4 border-l-orange-500 mb-6">
                <div className="text-xs font-medium text-orange-400 mb-1">ENERGY IMPACT</div>
                <div className="text-xs text-contrast-medium">
                  Estimated annual generation: 45-55 MWh, offsetting ~40% of building's current energy consumption while
                  demonstrating sustainable retrofit strategies for historic structures.
                </div>
              </div>

              <div className="bg-[hsl(218,11%,18%)] p-4 rounded-lg border border-[hsl(218,11%,25%)]">
                <h3 className="text-sm font-bold text-contrast-high mb-2">KEY INSIGHTS</h3>
                <ul className="space-y-2 text-sm text-contrast-medium">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    West pediment orientation maximizes evening peak energy generation
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Reversible installation preserves historic architectural integrity
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    Demonstrates viable solar retrofit strategy for landmark buildings
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="bg-[hsl(218,11%,18%)] rounded-lg border border-[hsl(218,11%,25%)] p-8">
          <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/50">
            METHODOLOGY
          </Badge>
          <h2 className="text-2xl font-bold text-contrast-high mb-4">
            Analysis Approach
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-contrast-medium">
            <div>
              <h3 className="font-bold text-contrast-high mb-2">Site Survey</h3>
              <p>Photographic documentation, geolocation data, and contextual analysis of existing conditions</p>
            </div>
            <div>
              <h3 className="font-bold text-contrast-high mb-2">Solar Analysis</h3>
              <p>Sun path modeling, shadow studies, and orientation analysis for peak energy capture periods</p>
            </div>
            <div>
              <h3 className="font-bold text-contrast-high mb-2">Structural Assessment</h3>
              <p>Load path evaluation, capacity analysis, and integration strategy for minimal intervention</p>
            </div>
          </div>
        </section>
      </main>

      {/* Navigation Footer */}
      <div className="bg-[hsl(218,11%,18%)] border-t border-[hsl(218,11%,25%)] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleSectionChange(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>
            <Button
              onClick={() => handleSectionChange(Math.min(3, activeSection + 1))}
              disabled={activeSection === 3}
              variant="outline"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
