
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { clubsAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

// Define form schema
const clubSchema = z.object({
  name: z.string().min(3, { message: "Club name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  university: z.string().min(3, { message: "University name is required" }),
  coverImage: z.string().optional(),
});

type ClubFormValues = z.infer<typeof clubSchema>;

const CreateClub = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form
  const form = useForm<ClubFormValues>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: "",
      description: "",
      university: currentUser?.university || "",
      coverImage: "",
    },
  });

  const onSubmit = async (data: ClubFormValues) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a club",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare club data including current user as admin
      const clubData = {
        ...data,
        admins: [currentUser.id],
        members: [currentUser.id],
      };
      
      const response = await clubsAPI.createClub(clubData);
      
      toast({
        title: "Club created successfully",
        description: "Your new club has been created",
      });
      
      // Navigate to the new club page
      navigate(`/clubs/${response.data.id}`);
    } catch (error: any) {
      toast({
        title: "Error creating club",
        description: error.response?.data?.message || "An error occurred while creating the club",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Club</CardTitle>
          <CardDescription>
            Start a new club at your university and invite members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Programming Club" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Tirana" {...field} />
                    </FormControl>
                    <FormDescription>
                      The university where this club is based
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
                        placeholder="Describe the purpose and activities of your club" 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL to an image that represents your club
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/clubs")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Club"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateClub;
