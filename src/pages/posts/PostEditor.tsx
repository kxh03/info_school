import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  PenBox, 
  Image, 
  Tag, 
  LayoutDashboard, 
  Trash, 
  Save, 
  BookOpen,
  Upload,
  Eye,
  Clock,
  Lock,
  Globe,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clubsAPI, postsAPI } from "@/services/api";
import { Club } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Form schema
const postFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  excerpt: z
    .string()
    .min(10, { message: "Excerpt must be at least 10 characters" })
    .max(200, { message: "Excerpt cannot exceed 200 characters" }),
  content: z.string().min(20, { message: "Content is required and must be meaningful" }),
  coverImage: z.string().optional(),
  club: z.string({ required_error: "Please select a club" }),
  status: z.enum(["published", "draft"], { 
    required_error: "Please select a status"
  }),
  visibility: z.enum(["public", "private"], {
    required_error: "Please select visibility"
  })
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function PostEditor() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEditMode = !!postId;
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string>("pending");
  const [clubs, setClubs] = useState<Club[]>([]);
  
  // Initialize form with default values
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      club: "",
      status: "draft",
      visibility: "private",
    },
  });
  
  // Fetch clubs and post data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch clubs
        const clubsResponse = await clubsAPI.getAllClubs();
        setClubs(clubsResponse.data);
        
        // If editing, fetch post data
        if (isEditMode && postId) {
          const postResponse = await postsAPI.getPostById(postId);
          const post = postResponse.data;
          
          form.reset({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage || "",
            club: post.club,
            status: post.status,
            visibility: post.visibility,
          });
          
          setTags(post.tags || []);
          setApprovalStatus(post.approvalStatus);
          
          // Check if user is admin of this club
          if (clubsResponse.data && post.club) {
            const club = clubsResponse.data.find((c: any) => c._id === post.club);
            if (club && club.admins.includes(currentUser?.id)) {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isEditMode, postId, form, currentUser]);
  
  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to create or edit posts.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Add tags to the data object
    const postData = {
      ...data,
      tags,
      author: currentUser.id
    };
    
    try {
      if (isEditMode && postId) {
        await postsAPI.updatePost(postId, postData);
        
        toast({
          title: "Post updated",
          description: data.status === "published" 
            ? (isAdmin ? "Your post has been updated successfully." : "Your changes have been submitted for approval by club admins.")
            : "Your draft has been updated.",
        });
      } else {
        const response = await postsAPI.createPost(postData);
        const newPostId = response.data._id;
        
        toast({
          title: "Post created",
          description: data.status === "published"
            ? (isAdmin ? "Your post has been published successfully." : "Your post has been submitted for approval by club admins.")
            : "Your post has been saved as a draft.",
        });
        
        // Set the new post ID for navigation
        if (newPostId) {
          navigate(data.status === "published" ? `/post/${newPostId}` : "/dashboard");
          return;
        }
      }
      
      // Redirect to dashboard or post view
      navigate(data.status === "published" ? `/post/${postId || "new"}` : "/dashboard");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle adding tags
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };
  
  // Handle tag input with Enter key
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Handle removing tags
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!isEditMode || !postId || !confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postsAPI.deletePost(postId);
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        {isEditMode && approvalStatus === "pending" && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertTitle>Pending Approval</AlertTitle>
            <AlertDescription>
              This post is waiting for approval from club admins before it can be published.
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* Main post fields */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a compelling title..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be displayed at the top of your post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write a short summary of your post..." 
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed in post previews and search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        {/* In a real app, you would integrate a rich text editor here like Editor.js */}
                        <Textarea 
                          placeholder="Write your post content here..." 
                          className="min-h-[300px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Use rich formatting to make your post engaging.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-8">
                {/* Sidebar post settings */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Draft</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Published</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Draft posts are only visible to you. Published posts are visible to everyone.
                        {!isAdmin && (
                          <span className="block mt-1 text-amber-600">
                            Note: Published posts require approval from club admins.
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Lock className="mr-2 h-4 w-4" />
                              Private (Requires Login)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="public" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              Public (Visible to Everyone)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Private posts are only visible to logged-in users.
                        Public posts can be seen by anyone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="club"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select club" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clubs.map(club => (
                            <SelectItem key={club.id} value={club.id}>
                              <div className="flex items-center">
                                <BookOpen className="mr-2 h-4 w-4" />
                                <span>{club.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The club that this post is associated with.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input 
                            placeholder="Enter image URL..." 
                            {...field} 
                          />
                          {field.value && (
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                              <img 
                                src={field.value} 
                                alt="Cover" 
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <Button type="button" variant="outline" className="w-full">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        This image will be displayed at the top of your post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Tags</FormLabel>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground">
                      Press Enter or click the tag button to add. Add up to 5 tags.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                className="text-destructive"
                disabled={isSubmitting}
                onClick={handleDeletePost}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Post
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : isEditMode ? "Update Post" : "Save Post"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
