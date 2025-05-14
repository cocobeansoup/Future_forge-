import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// Define form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters long",
  }),
  category: z.string().min(1, {
    message: "Please select a category",
  }),
  status: z.string().min(1, {
    message: "Please select a status",
  }),
  fundingGoal: z.string().optional(),
  patentStatus: z.string().optional(),
  forSale: z.boolean().default(false),
  salePrice: z.string().optional(),
  aiAssistance: z.boolean().default(false),
  tags: z.string().optional(),
});

export default function CreateInvention() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "in-progress",
      fundingGoal: "",
      patentStatus: "none",
      forSale: false,
      salePrice: "",
      aiAssistance: false,
      tags: "",
    },
  });

  // Check subscription status - inventor can only post if they have an active subscription
  const { data: subscriptionStatus } = useAuth.useQuery({
    queryKey: ["/api/subscription/status", user?.id],
    enabled: isAuthenticated && !!user?.id && user.isInventor,
  });

  // Handler for form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an invention",
        variant: "destructive",
      });
      return;
    }

    if (!user.isInventor) {
      toast({
        title: "Error",
        description: "Only inventors can create inventions",
        variant: "destructive",
      });
      return;
    }

    if (user.isInventor && !subscriptionStatus?.active) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to create inventions",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    try {
      setIsSubmitting(true);

      // Process tags
      const tagsArray = values.tags
        ? values.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        : [];

      // Prepare the data
      const inventionData = {
        ...values,
        inventorId: user.id,
        tags: tagsArray,
      };

      // Send the data to the API
      const response = await fetch("/api/inventions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create invention");
      }

      const invention = await response.json();

      toast({
        title: "Success",
        description: "Your invention has been created successfully",
      });

      // Navigate to the invention page
      navigate(`/inventions/${invention.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invention. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Categories
  const categories = [
    "Technology",
    "Health",
    "Energy",
    "Transportation",
    "Home",
    "Environment",
    "Food",
    "Education",
    "Entertainment",
    "Other",
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">You need to log in to create an invention</h1>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  if (!user?.isInventor) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Only inventors can create inventions</h1>
        <p className="text-gray-500 mb-4">Your account is not registered as an inventor.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (user.isInventor && !subscriptionStatus?.active) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Subscription Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 mb-4">
              You need an active subscription to create inventions. Start your 7-day free trial or subscribe now.
            </p>
            <Button asChild className="w-full">
              <Link href="/dashboard">Subscribe Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Invention</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter invention title" {...field} />
                    </FormControl>
                    <FormDescription>
                      A catchy, descriptive name for your invention
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your invention in detail"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your invention, its purpose, and how it works
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="prototype">Prototype</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fundingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Goal ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 5000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional. How much funding do you need?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patent Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patent status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="granted">Granted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="forSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>For Sale</FormLabel>
                      <FormDescription>
                        Is this invention available for purchase?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("forSale") && (
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 1000"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How much are you selling this invention for?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="aiAssistance"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>AI Assistance</FormLabel>
                      <FormDescription>
                        Would you like AI to analyze and provide feedback on your invention?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., eco-friendly, solar, sustainable" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords related to your invention
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Invention"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}