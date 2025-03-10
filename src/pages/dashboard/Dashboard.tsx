
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  PenBox, 
  BookOpen, 
  User, 
  Settings, 
  Filter, 
  Search,
  Edit,
  Trash,
  Eye,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Post } from "@/types";
import { postsAPI } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all posts and filter by current user
  const {
    data: posts = [],
    isLoading: isPostsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['userPosts', currentUser?._id || currentUser?.id],
    queryFn: async () => {
      if (!currentUser?._id && !currentUser?.id) return [];
      const userId = currentUser?._id || currentUser?.id;
      // Get all posts and filter client-side by the current user
      const response = await postsAPI.getAllPosts();
      return response.data.filter(post => 
        post.author === userId || 
        (typeof post.author === 'object' && 
         (post.author.id === userId || post.author._id === userId))
      );
    },
    enabled: !!isAuthenticated && !!(currentUser?._id || currentUser?.id)
  });
  
  useEffect(() => {
    // Redirect to login if not authenticated and loading is complete
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    try {
      await postsAPI.deletePost(postId);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      refetchPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };
  
  // Get unique club IDs from posts
  const clubIds = [...new Set(posts.map((post: Post) => {
    if (typeof post.club === 'string') {
      return post.club;
    } else if (post.club && typeof post.club === 'object') {
      return post.club._id || post.club.id;
    }
    return null;
  }).filter(Boolean))];
  
  // Get unique clubs from posts
  const clubs = [...new Set(posts.map((post: Post) => {
    if (typeof post.club === 'object' && post.club !== null) {
      return { id: post.club._id || post.club.id, name: post.club.name };
    }
    return null;
  }).filter(Boolean))];
  
  // Filter posts based on search, club, and tab
  const filteredPosts = posts.filter((post: Post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClub = selectedClub ? (
      (typeof post.club === 'string' && post.club === selectedClub) ||
      (typeof post.club === 'object' && post.club !== null && 
       (post.club._id === selectedClub || post.club.id === selectedClub))
    ) : true;
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "published" && post.status === "published") || 
                      (activeTab === "drafts" && post.status === "draft");
    
    return matchesSearch && matchesClub && matchesTab;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // If still loading or not authenticated, don't render the dashboard
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <img 
                  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username || 'User'}&background=random`} 
                  alt={currentUser?.username || 'User'} 
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <CardTitle className="text-lg">{currentUser?.username || 'User'}</CardTitle>
                  <CardDescription>@{currentUser?.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <nav className="space-y-1">
                <Link to="/dashboard" className="flex items-center py-2 px-3 rounded-md bg-primary/10 text-primary font-medium">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/post/new" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                  <PenBox className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
                <Link to="/clubs" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Clubs
                </Link>
                <Link to="/profile" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link to="/settings" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Posts</h1>
            <Button asChild>
              <Link to="/post/new">Create New Post</Link>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter by Club
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Club</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedClub(null)}>
                  All Clubs
                </DropdownMenuItem>
                {clubs.map((club: any) => (
                  <DropdownMenuItem key={club.id} onClick={() => setSelectedClub(club.id)}>
                    {club.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>All Posts</CardTitle>
                  <CardDescription>
                    {filteredPosts.length} posts found
                    {selectedClub && " (filtered by club)"}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPostsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                          <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPosts.map((post: Post) => {
                        const postId = post._id || post.id;
                        const clubName = typeof post.club === 'object' && post.club ? post.club.name : 'Unknown Club';
                        
                        return (
                          <div key={postId} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{post.title}</h3>
                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                  {post.status}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <span>Club: {clubName}</span>
                                {post.status === 'published' && (
                                  <>
                                    <span>Published: {formatDate(post.createdAt.toString())}</span>
                                  </>
                                )}
                                {post.status === 'draft' && (
                                  <span>Last updated: {formatDate(post.updatedAt.toString())}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                              {post.status === 'published' && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/post/${postId}`}>
                                    <Eye className="mr-1 h-4 w-4" />
                                    View
                                  </Link>
                                </Button>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/post/${postId}/edit`}>
                                  <Edit className="mr-1 h-4 w-4" />
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeletePost(postId)}
                              >
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      {postsError ? (
                        <p>Error loading posts. Please try again later.</p>
                      ) : (
                        <p>No posts found matching your criteria.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="published" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Published Posts</CardTitle>
                  <CardDescription>
                    {filteredPosts.length} published posts found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPostsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                          <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPosts.map((post: Post) => {
                        const postId = post._id || post.id;
                        const clubName = typeof post.club === 'object' && post.club ? post.club.name : 'Unknown Club';
                        
                        return (
                          <div key={postId} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{post.title}</h3>
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <span>Club: {clubName}</span>
                                <span>Published: {formatDate(post.createdAt.toString())}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/post/${postId}`}>
                                  <Eye className="mr-1 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/post/${postId}/edit`}>
                                  <Edit className="mr-1 h-4 w-4" />
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeletePost(postId)}
                              >
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No published posts found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="drafts" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Posts</CardTitle>
                  <CardDescription>
                    {filteredPosts.length} draft posts found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPostsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                          <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPosts.map((post: Post) => {
                        const postId = post._id || post.id;
                        const clubName = typeof post.club === 'object' && post.club ? post.club.name : 'Unknown Club';
                        
                        return (
                          <div key={postId} className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{post.title}</h3>
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                                <span>Club: {clubName}</span>
                                <span>Last updated: {formatDate(post.updatedAt.toString())}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/post/${postId}/edit`}>
                                  <Edit className="mr-1 h-4 w-4" />
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeletePost(postId)}
                              >
                                <Trash className="mr-1 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No draft posts found.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}