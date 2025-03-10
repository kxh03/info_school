
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { postsAPI } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Determine if we're viewing our own profile or someone else's
  const isOwnProfile = !username || (currentUser?.username === username);
  
  // User data to display - either our own (from auth context) or fetched for another user
  const userToDisplay = isOwnProfile ? currentUser : null;
  
  // Fetch posts for the current user
  const { 
    data: posts = [],
    isLoading: isPostsLoading
  } = useQuery({
    queryKey: ['user-posts', userToDisplay?.id || userToDisplay?._id],
    queryFn: async () => {
      if (!userToDisplay?.id && !userToDisplay?._id) return [];
      const userId = userToDisplay?.id || userToDisplay?._id;
      // Use the updated endpoint format
      const response = await postsAPI.getAllPosts();
      // Filter posts by author ID
      return response.data.filter(post => 
        post.author === userId || 
        (typeof post.author === 'object' && 
         (post.author.id === userId || post.author._id === userId))
      );
    },
    enabled: !!isAuthenticated && !!(userToDisplay?.id || userToDisplay?._id)
  });

  // If user is not logged in and trying to view their own profile
  if (!isAuthenticated && isOwnProfile) {
    return (
      <div className="container max-w-4xl py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  if (!userToDisplay && isOwnProfile) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="flex items-center justify-center h-40">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={userToDisplay?.avatar} alt={userToDisplay?.username} />
            <AvatarFallback className="text-4xl">
              {userToDisplay?.username ? userToDisplay.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold">{userToDisplay?.username}</h1>
            <p className="text-muted-foreground">@{userToDisplay?.username}</p>
            <p className="text-sm mt-1">{userToDisplay?.university || "Metropolitan"}</p>
          </div>
          
          {isOwnProfile && (
            <Button variant="outline" className="w-full" asChild>
              <Link to="/settings">Edit Profile</Link>
            </Button>
          )}
        </div>
        
        <div className="flex-1">
          <Tabs defaultValue="about">
            <TabsList className="w-full">
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
              <TabsTrigger value="clubs" className="flex-1">Clubs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{userToDisplay?.bio || "No bio available."}</p>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Social Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {userToDisplay?.socialLinks ? (
                        Object.entries(userToDisplay.socialLinks).map(([platform, handle]) => (
                          <Button key={platform} variant="outline" size="sm" asChild>
                            <a href={`https://${platform}.com/${handle}`} target="_blank" rel="noopener noreferrer">
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </a>
                          </Button>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No social links added.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="posts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Posts</CardTitle>
                  <CardDescription>
                    {isOwnProfile 
                      ? "Your recent posts" 
                      : `Recent posts by ${userToDisplay?.username}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPostsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map(post => (
                        <div key={post.id || post._id} className="border p-4 rounded-md">
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>{post.views} views</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No posts yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clubs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clubs</CardTitle>
                  <CardDescription>
                    {isOwnProfile 
                      ? "Clubs you've joined" 
                      : `Clubs that ${userToDisplay?.username} is a member of`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No clubs joined yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
