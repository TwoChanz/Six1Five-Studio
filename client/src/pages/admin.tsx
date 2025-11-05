import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Mail,
  FileText,
  Folder,
  Lock,
  LogOut,
  PlusCircle,
  Star,
  MessageSquare
} from "lucide-react";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  substackEmbedCode?: string | null;
  tags?: string[];
  published: boolean;
  createdAt: string;
};

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
};

type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  projectType: string;
  location: string;
  services?: string[];
  timeline?: string | null;
  budgetRange?: string | null;
  projectDetails: string;
  referenceFiles?: string[];
  createdAt: string;
};

type Review = {
  id: number;
  name: string;
  email?: string | null;
  company?: string | null;
  role?: string | null;
  rating: number;
  reviewText: string;
  projectType: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
};

// Helper to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem('adminToken');
}

// Helper to create Authorization header
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Verify JWT token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/verify', {
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem('adminToken');
          window.dispatchEvent(new Event('storage'));
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('storage'));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, []);

  // JWT-based login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        window.dispatchEvent(new Event('storage')); // Notify navbar
        setIsAuthenticated(true);
        setAuthError("");
        toast({
          title: "Access granted",
          description: "Welcome to the admin dashboard",
        });
      } else {
        setAuthError(data.message || "Invalid password");
        toast({
          title: "Access denied",
          description: data.message || "Invalid password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthError("Login failed. Please try again.");
      toast({
        title: "Login error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event('storage')); // Notify navbar
    setIsAuthenticated(false);
    setPassword("");
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
  };

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center">
        <div className="text-white text-lg">Verifying authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-12 h-12 text-[hsl(24,95%,53%)]" />
            </div>
            <CardTitle className="text-2xl text-center text-white">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter password to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {authError && (
                  <p className="text-red-400 text-sm mt-2">{authError}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]">
                <Lock className="w-4 h-4 mr-2" />
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[hsl(24,95%,53%)]">Admin Dashboard</h1>
            <Badge variant="outline" className="border-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]">
              Six1Five Studio
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="bg-gray-800 mb-8">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-[hsl(24,95%,53%)]">
              <Mail className="w-4 h-4 mr-2" />
              Contact Submissions
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[hsl(24,95%,53%)]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-[hsl(24,95%,53%)]">
              <FileText className="w-4 h-4 mr-2" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-[hsl(24,95%,53%)]">
              <Folder className="w-4 h-4 mr-2" />
              Portfolio Items
            </TabsTrigger>
          </TabsList>

          {/* Contact Submissions Tab */}
          <TabsContent value="contacts">
            <ContactsManager />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <ReviewsManager />
          </TabsContent>

          {/* Blog Posts Tab */}
          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ContactsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/contact"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({
        title: "Success",
        description: "Contact submission deleted",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <Badge variant="secondary">{contacts?.length || 0} total</Badge>
      </div>

      {(!contacts || contacts.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Mail className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No contact submissions yet</h3>
            <p className="text-gray-400 max-w-md">
              When potential clients submit the contact form on your website, their inquiries will appear here for you to review and respond to.
            </p>
          </CardContent>
        </Card>
      )}

      {contacts?.map((contact) => (
        <Card key={contact.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-white">{contact.name}</CardTitle>
                <CardDescription>
                  <a href={`mailto:${contact.email}`} className="text-[hsl(199,89%,48%)] hover:underline">
                    {contact.email}
                  </a>
                </CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(contact.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Project Type:</span>
                <p className="text-white font-medium">{contact.projectType}</p>
              </div>
              <div>
                <span className="text-gray-400">Location:</span>
                <p className="text-white font-medium">{contact.location}</p>
              </div>
              {contact.timeline && (
                <div>
                  <span className="text-gray-400">Timeline:</span>
                  <p className="text-white font-medium">{contact.timeline}</p>
                </div>
              )}
              {contact.budgetRange && (
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <p className="text-white font-medium">{contact.budgetRange}</p>
                </div>
              )}
            </div>
            {contact.services && contact.services.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm">Services:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {contact.services.map((service, idx) => (
                    <Badge key={idx} variant="outline" className="border-[hsl(199,89%,48%)]">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className="text-gray-400 text-sm">Project Details:</span>
              <p className="text-white mt-1 whitespace-pre-wrap">{contact.projectDetails}</p>
            </div>
            {contact.referenceFiles && contact.referenceFiles.length > 0 && (
              <div>
                <span className="text-gray-400 text-sm">Reference Files ({contact.referenceFiles.length}):</span>
                <div className="space-y-1 mt-1">
                  {contact.referenceFiles.map((file, idx) => (
                    <a
                      key={idx}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[hsl(199,89%,48%)] hover:underline text-sm block"
                    >
                      {file.split('/').pop()}
                    </a>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Submitted: {new Date(contact.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}

      {contacts?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No contact submissions yet
        </div>
      )}
    </div>
  );
}

function BlogManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Success",
        description: "Blog post deleted",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newPost: { title: string; slug: string; excerpt?: string; content: string; substackEmbedCode?: string; tags?: string[]; published: boolean }) => {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Blog post created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ published }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Success",
        description: "Blog post updated",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <Badge variant="secondary">{posts?.length || 0} total</Badge>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Post
        </Button>
      </div>

      {(!posts || posts.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No blog posts yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Start publishing insights and thought leadership to engage your audience. Click "Add New Post" to create your first blog post.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      )}

      {posts?.map((post) => (
        <Card key={post.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-white">{post.title}</CardTitle>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <CardDescription>Slug: /{post.slug}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPost(post)}
                  className="border-gray-600"
                  title="Edit post"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublishedMutation.mutate({ id: post.id, published: !post.published })}
                  className="border-gray-600"
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      deleteMutation.mutate(post.id);
                    }
                  }}
                  title="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {post.excerpt && (
              <p className="text-gray-300 text-sm">{post.excerpt}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="border-[hsl(158,64%,52%)]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500">
              Created: {new Date(post.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}

      {posts?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">No blog posts yet</p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
            className="border-gray-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      )}

      {/* Add New Blog Post Dialog */}
      <AddBlogPostDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={(newPost) => createMutation.mutate(newPost)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Blog Post Dialog */}
      <Dialog open={!!editingPost} onOpenChange={() => setEditingPost(null)}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editingPost.slug}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="url-friendly-slug"
                />
              </div>
              <div>
                <Label>Excerpt (optional)</Label>
                <Textarea
                  value={editingPost.excerpt || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                  placeholder="Short description for blog listing"
                />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={10}
                  placeholder="Markdown or HTML content"
                />
              </div>
              <div>
                <Label>Substack Embed Code (optional)</Label>
                <Textarea
                  value={editingPost.substackEmbedCode || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, substackEmbedCode: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  rows={6}
                  placeholder="Paste Substack embed code here (includes <div> and <script> tags)"
                />
                <p className="text-xs text-gray-400 mt-1">If provided, the Substack embed will be shown instead of the content field.</p>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                <Button variant="outline" onClick={() => setEditingPost(null)} className="border-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    togglePublishedMutation.mutate(
                      { 
                        id: editingPost.id, 
                        published: editingPost.published,
                        title: editingPost.title,
                        slug: editingPost.slug,
                        excerpt: editingPost.excerpt,
                        content: editingPost.content
                      } as any,
                      {
                        onSuccess: () => setEditingPost(null)
                      }
                    );
                  }}
                  className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
                  disabled={!editingPost.title || !editingPost.slug || !editingPost.content}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Blog Post Dialog Component
function AddBlogPostDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: { title: string; slug: string; excerpt?: string; content: string; substackEmbedCode?: string; tags?: string[]; published: boolean }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    substackEmbedCode: '',
    tags: '',
    published: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title), // Only auto-generate if slug is empty
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    }
    
    // Content is required only if Substack embed code is not provided
    if (!formData.content.trim() && !formData.substackEmbedCode.trim()) {
      newErrors.content = 'Either content or Substack embed code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const tags = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    onSubmit({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      substackEmbedCode: formData.substackEmbedCode || undefined,
      tags: tags.length > 0 ? tags : undefined,
      published: formData.published,
    });

    // Reset form
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      substackEmbedCode: '',
      tags: '',
      published: false,
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Blog Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., How to Use Drone Mapping for Construction"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <Label>Slug * <span className="text-gray-400 text-xs">(URL: /blog/{formData.slug || 'your-slug'})</span></Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              placeholder="how-to-use-drone-mapping"
            />
            {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
          </div>
          
          <div>
            <Label>Excerpt <span className="text-gray-400 text-xs">(shown on blog listing)</span></Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
              placeholder="Brief summary of the post (optional but recommended)"
            />
          </div>
          
          <div>
            <Label>Content</Label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              rows={10}
              placeholder="Post content (supports Markdown or HTML)"
            />
            {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
            <p className="text-xs text-gray-400 mt-1">Leave blank if using Substack embed</p>
          </div>
          
          <div>
            <Label>Substack Embed Code (alternative to content)</Label>
            <Textarea
              value={formData.substackEmbedCode}
              onChange={(e) => setFormData(prev => ({ ...prev, substackEmbedCode: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              rows={6}
              placeholder="Paste full Substack embed code here (includes <div> and <script> tags)"
            />
            <p className="text-xs text-gray-400 mt-1">💡 Get this from your Substack post's share menu → Embed</p>
          </div>
          
          <div>
            <Label>Tags <span className="text-gray-400 text-xs">(comma-separated)</span></Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="drone mapping, lidar, photogrammetry"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="published" className="cursor-pointer">
              Publish immediately (uncheck to save as draft)
            </Label>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} className="border-gray-600" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : formData.published ? 'Publish Post' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PortfolioManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: items, isLoading} = useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: { title: string; description: string; category: string; published: boolean; featured: boolean }) => {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error("Failed to create");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Portfolio item created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create portfolio item",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Success",
        description: "Portfolio item deleted",
      });
    },
  });

  const togglePublishedMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ published }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Success",
        description: "Portfolio item updated",
      });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify({ featured }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Success",
        description: "Featured status updated",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">Loading portfolio items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Portfolio Items</h2>
          <Badge variant="secondary">{items?.length || 0} total</Badge>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {(!items || items.length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Folder className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No portfolio items yet</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Showcase your best work to potential clients. Add your first portfolio item to start building your showcase.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}

      {items?.map((item) => (
        <Card key={item.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-white">{item.title}</CardTitle>
                  <Badge variant={item.published ? "default" : "secondary"}>
                    {item.published ? "Published" : "Draft"}
                  </Badge>
                  {item.featured && (
                    <Badge className="bg-[hsl(24,95%,53%)]">Featured</Badge>
                  )}
                </div>
                <CardDescription>Category: {item.category}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(item)}
                  className="border-gray-600"
                  title="Edit item"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFeaturedMutation.mutate({ id: item.id, featured: !item.featured })}
                  className="border-gray-600"
                  title={item.featured ? "Remove from featured" : "Add to featured"}
                >
                  ⭐
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublishedMutation.mutate({ id: item.id, published: !item.published })}
                  className="border-gray-600"
                  title={item.published ? "Unpublish" : "Publish"}
                >
                  {item.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this portfolio item?')) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-300 text-sm">{item.description}</p>
            <div className="text-xs text-gray-500">
              Created: {new Date(item.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}

      {items?.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-4">No portfolio items yet</p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
            className="border-gray-600"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Your First Portfolio Item
          </Button>
        </div>
      )}

      {/* Add New Portfolio Item Dialog */}
      <AddPortfolioItemDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={(newItem) => createMutation.mutate(newItem)}
        isLoading={createMutation.isPending}
      />

      {/* Edit Portfolio Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Portfolio Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="e.g., Drone Mapping, LiDAR Scanning"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={5}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.published}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Featured (Homepage)</span>
                </label>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                <Button variant="outline" onClick={() => setEditingItem(null)} className="border-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    togglePublishedMutation.mutate(
                      { 
                        id: editingItem.id, 
                        published: editingItem.published,
                        title: editingItem.title,
                        category: editingItem.category,
                        description: editingItem.description,
                        featured: editingItem.featured
                      } as any,
                      {
                        onSuccess: () => setEditingItem(null)
                      }
                    );
                  }}
                  className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
                  disabled={!editingItem.title || !editingItem.category || !editingItem.description}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Portfolio Item Dialog Component
function AddPortfolioItemDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: { title: string; description: string; category: string; published: boolean; featured: boolean }) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    published: false,
    featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      published: formData.published,
      featured: formData.featured,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      published: false,
      featured: false,
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Portfolio Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Murphy Center Arena Mapping"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <Label>Category *</Label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Drone Mapping, LiDAR Scanning, 3D Reconstruction"
            />
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            <p className="text-gray-400 text-xs mt-1">Common: Drone Mapping | LiDAR Scanning | Photogrammetry | 3D Reconstruction</p>
          </div>
          
          <div>
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              rows={6}
              placeholder="Describe the project, location, challenges, deliverables, etc."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-300 font-medium">📝 Note: Basic fields only</p>
            <p className="text-xs text-gray-400">
              After creating, add 3D models (Sketchfab, Luma AI, Polycam), images, and videos using database scripts or future UI updates.
            </p>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4"
              />
              <span>Published (visible in gallery)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4"
              />
              <span>⭐ Featured (shown on homepage)</span>
            </label>
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <Button variant="outline" onClick={onClose} className="border-gray-600" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Portfolio Item'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ReviewsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const response = await fetch('/api/admin/reviews', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
  });

  const approveReview = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to approve review');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      toast({ title: "Review approved and published" });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/reviews/${id}/featured`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle featured status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews/featured'] });
      toast({ title: "Featured status updated" });
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({ title: "Review deleted" });
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading reviews...</div>;
  }

  const pendingReviews = reviews?.filter(r => !r.approved) || [];
  const approvedReviews = reviews?.filter(r => r.approved) || [];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews ({pendingReviews.length})</CardTitle>
          <CardDescription>Reviews awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingReviews.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No pending reviews</p>
          ) : (
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      {review.company && <p className="text-sm text-gray-400">{review.role && `${review.role}, `}{review.company}</p>}
                      <div className="flex items-center mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]" />
                        ))}
                        <Badge variant="outline" className="ml-2 text-xs">{review.projectType}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approveReview.mutate(review.id)} className="bg-green-600 hover:bg-green-700" disabled={approveReview.isPending}>
                        <Eye className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteReview.mutate(review.id)} disabled={deleteReview.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-2">"{review.reviewText}"</p>
                  <p className="text-xs text-gray-500 mt-2">Submitted {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Reviews ({approvedReviews.length})</CardTitle>
          <CardDescription>Published reviews visible to customers</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedReviews.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No approved reviews</p>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((review) => (
                <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      {review.company && <p className="text-sm text-gray-400">{review.role && `${review.role}, `}{review.company}</p>}
                      <div className="flex items-center mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]" />
                        ))}
                        <Badge variant="outline" className="ml-2 text-xs">{review.projectType}</Badge>
                        {review.featured && <Badge className="ml-2 text-xs bg-[hsl(24,95%,53%)]">Featured</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant={review.featured ? "secondary" : "outline"} onClick={() => toggleFeatured.mutate(review.id)} disabled={toggleFeatured.isPending}>
                        <Star className={`w-4 h-4 ${review.featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteReview.mutate(review.id)} disabled={deleteReview.isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-2">"{review.reviewText}"</p>
                  <p className="text-xs text-gray-500 mt-2">Published {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

