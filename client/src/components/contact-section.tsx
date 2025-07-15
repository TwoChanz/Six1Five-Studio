import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  projectDetails: z.string().min(10, "Please provide project details (minimum 10 characters)"),
});

type ContactForm = z.infer<typeof contactSchema>;

const serviceOptions = [
  { id: "drone-mapping", label: "Drone Mapping" },
  { id: "interior-scan", label: "Interior Scan" },
  { id: "lidar-survey", label: "LiDAR Survey" },
  { id: "construction-monitoring", label: "Construction Monitoring" },
];

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      services: [],
      projectDetails: "",
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
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 grid-overlay">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8">
              Let's capture your site in <span className="text-[hsl(24,95%,53%)]">3D</span>
            </h2>
            <p className="text-xl text-gray-300">
              Now booking for: <span className="text-[hsl(199,89%,48%)] font-semibold">Nashville, TN + Surrounding Areas</span>
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
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
                            className="bg-gray-800 border-gray-700 focus:border-[hsl(24,95%,53%)]"
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
                            className="bg-gray-800 border-gray-700 focus:border-[hsl(24,95%,53%)]"
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
                        <FormLabel className="text-sm font-medium">Services Needed</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {serviceOptions.map((service) => (
                            <FormField
                              key={service.id}
                              control={form.control}
                              name="services"
                              render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
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
                                      className="border-gray-700"
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
                            className="bg-gray-800 border-gray-700 focus:border-[hsl(24,95%,53%)] h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {contactMutation.isPending ? "Sending..." : "Request Quote"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-xl p-8 scanline-effect">
                <h3 className="text-2xl font-semibold mb-6">Ready to Start?</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-[hsl(24,95%,53%)]" />
                    <div>
                      <p className="font-semibold">Call Direct</p>
                      <p className="text-gray-400">(615) 555-0123</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-[hsl(199,89%,48%)]" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-400">chandler@six1five.studio</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-[hsl(158,64%,52%)]" />
                    <div>
                      <p className="font-semibold">Service Area</p>
                      <p className="text-gray-400">Nashville, TN + 100 mi radius</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-700">
                  <h4 className="font-semibold mb-4">Recent Equipment</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                      alt="Professional drone equipment setup" 
                      className="rounded-lg" 
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300" 
                      alt="3D scanning technology equipment" 
                      className="rounded-lg" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
