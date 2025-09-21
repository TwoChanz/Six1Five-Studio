import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, Upload, X } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  projectType: z.string().min(1, "Please select a project type"),
  location: z.string().min(1, "Location is required for service area verification"),
  projectDetails: z.string().min(10, "Please provide project details (minimum 10 characters)"),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  referenceFiles: z.array(z.string()).optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

const serviceOptions = [
  { id: "drone-mapping", label: "Drone Mapping" },
  { id: "interior-scan", label: "Interior Scan" },
  { id: "lidar-survey", label: "LiDAR Survey" },
  { id: "construction-monitoring", label: "Construction Monitoring" },
  { id: "photogrammetry", label: "Photogrammetry" },
  { id: "heritage-documentation", label: "Heritage Documentation" },
];

const projectTypeOptions = [
  { value: "drone-mapping", label: "Drone Mapping" },
  { value: "heritage", label: "Heritage Documentation" },
  { value: "bim", label: "BIM/Construction" },
  { value: "real-estate", label: "Real Estate" },
  { value: "inspection", label: "Inspection/Survey" },
  { value: "other", label: "Other" },
];

const timelineOptions = [
  { value: "asap", label: "ASAP (Rush)" },
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "3-4-weeks", label: "3-4 weeks" },
  { value: "1-2-months", label: "1-2 months" },
  { value: "flexible", label: "Flexible timeline" },
];

const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "over-50k", label: "Over $50,000" },
  { value: "discuss", label: "Let's discuss" },
];

export default function ContactSection() {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      services: [],
      projectType: "",
      location: "",
      projectDetails: "",
      timeline: "",
      budgetRange: "",
      referenceFiles: [],
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your interest. We will contact you soon.",
      });
      form.reset();
      setUploadedFiles([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload images (JPEG, PNG, GIF), PDF, or text files only.",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Please keep files under 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Convert files to base64 for form submission
    const filePromises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(base64Files => {
      form.setValue('referenceFiles', [...(form.getValues('referenceFiles') || []), ...base64Files]);
    });
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    const currentFormFiles = form.getValues('referenceFiles') || [];
    const newFormFiles = currentFormFiles.filter((_, i) => i !== index);
    form.setValue('referenceFiles', newFormFiles);
  };

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's capture your site in <span className="text-[var(--primary-blue)]">3D</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to transform your project with Reality Capture technology? Get started with a custom quote.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Get Started Form */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6">Get Started</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Your name"
                          className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          placeholder="your@email.com"
                          className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Project Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {projectTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-600">
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Project Location</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="City, State (e.g., Nashville, TN)"
                          className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium mb-3 block">Services Needed</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {serviceOptions.map((service) => (
                          <FormField
                            key={service.id}
                            control={form.control}
                            name="services"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(service.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, service.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== service.id)
                                          );
                                    }}
                                    className="border-gray-600 data-[state=checked]:bg-[hsl(24,95%,53%)]"
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {service.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Project Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell me about your project..."
                          className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] h-32 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Project Timeline</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timelineOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-700 border-gray-600 focus:border-[hsl(24,95%,53%)] text-white">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {budgetOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel className="text-sm font-medium mb-3 block">Reference Files</FormLabel>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-1">Upload reference images or documents</p>
                      <p className="text-xs text-gray-500">Drag files here or click to browse (Max 10MB each)</p>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                          <span className="text-sm text-white truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {contactMutation.isPending ? "Sending..." : "Request Quote"}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Contact Info Sidebar */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold mb-6">Ready to Start?</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                <div>
                  <span className="font-semibold">Call Direct:</span> (931) 588-8997
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <div>
                  <span className="font-semibold">Email:</span> admin@six1fivestudio.com
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[hsl(158,64%,52%)]" />
                <div>
                  <span className="font-semibold">Service Area:</span> Tennessee + Regional Coverage
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
