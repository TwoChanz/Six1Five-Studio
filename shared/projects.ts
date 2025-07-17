export interface ProjectConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  viewerType: 'glb' | 'iframe' | 'sketchfab';
  viewerUrl?: string;
  modelFile?: string;
  thumbnail: string;
  tools: string[];
  category: string;
  featured: boolean;
}

export const projects: ProjectConfig[] = [
  {
    id: "murphy-center",
    title: "Murphy Center Arena – MTSU",
    slug: "murphy-center-mtsu",
    description: "3D reconstruction and documentation for the Murphy Center Arena using aerial photogrammetry and RTX-powered mesh generation. High-resolution capture showcases architectural details with precise geometric accuracy.",
    tags: ["RealityCapture", "Photogrammetry", "Architecture"],
    viewerType: "iframe",
    viewerUrl: "https://poly.cam/capture/f74d19f9-a7f2-4efa-aa04-129282900374/embed",
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tools: ["DJI Mini 4 Pro", "Agisoft Metashape", "RealityCapture"],
    category: "construction",
    featured: true
  },
  {
    id: "historic-farmhouse",
    title: "Historic Farmhouse Heritage Documentation",
    slug: "historic-farmhouse-heritage",
    description: "Complete photogrammetric documentation of a historic farmhouse structure featuring detailed texture mapping and geometric reconstruction. Demonstrates precision heritage documentation techniques for preservation records.",
    tags: ["Heritage", "Photogrammetry", "Preservation"],
    viewerType: "iframe",
    viewerUrl: "https://poly.cam/capture/ae64129e-7bfa-4ea4-845c-1e05dc17d04c/embed",
    thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tools: ["DJI Mini 4 Pro", "Agisoft Metashape", "CloudCompare"],
    category: "heritage",
    featured: true
  },
  {
    id: "freedom-bell-memorial",
    title: "Freedom Bell Memorial Documentation",
    slug: "freedom-bell-memorial",
    description: "Critical documentation of vandalism damage to the Freedom Bell memorial using high-precision photogrammetry. Provides detailed evidence for restoration planning and serves as permanent record for legal documentation.",
    tags: ["Documentation", "Legal", "Restoration"],
    viewerType: "iframe",
    viewerUrl: "https://poly.cam/capture/f74d19f9-a7f2-4efa-aa04-129282900374/embed",
    thumbnail: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tools: ["DJI Mini 4 Pro", "Agisoft Metashape", "AutoDesk ReCap"],
    category: "heritage",
    featured: true
  },
  {
    id: "watchtower-shooting-house",
    title: "Watchtower Shooting House - Interactive Model",
    slug: "watchtower-shooting-house",
    description: "Complete photogrammetry reconstruction of a shooting house watchtower using aerial drone mapping. Interactive 3D model showcases precise detail capture and texture mapping for structural analysis.",
    tags: ["Photogrammetry", "Interactive", "Structural"],
    viewerType: "sketchfab",
    viewerUrl: "https://sketchfab.com/models/f066d332c0d145c3b90ad32efde4b4a9/embed",
    thumbnail: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    tools: ["DJI Mini 4 Pro", "Agisoft Metashape", "Sketchfab"],
    category: "photogrammetry",
    featured: true
  }
];

export const getProjectBySlug = (slug: string): ProjectConfig | undefined => {
  return projects.find(project => project.slug === slug);
};

export const getFeaturedProjects = (): ProjectConfig[] => {
  return projects.filter(project => project.featured);
};

export const getProjectsByCategory = (category: string): ProjectConfig[] => {
  return projects.filter(project => project.category === category);
};