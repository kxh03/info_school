
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Club, Post } from "@/types";
import { clubsAPI, postsAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch posts from API
  const { 
    data: posts = [], 
    isLoading: isPostsLoading 
  } = useQuery({
    queryKey: ['explore-posts'],
    queryFn: async () => {
      const response = await postsAPI.getAllPosts();
      return response.data;
    }
  });

  // Fetch clubs from API
  const { 
    data: clubs = [], 
    isLoading: isClubsLoading 
  } = useQuery({
    queryKey: ['explore-clubs'],
    queryFn: async () => {
      const response = await clubsAPI.getAllClubs();
      return response.data;
    }
  });
  
  // Filter posts based on search term
  const filteredPosts = searchTerm 
    ? posts.filter((post: Post) => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : posts;

  // Filter clubs based on search term
  const filteredClubs = searchTerm
    ? clubs.filter((club: Club) =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.university.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : clubs;

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground">Discover posts and clubs</p>
        </div>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {isPostsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPosts.map((post: Post) => (
                <Link to={`/post/${post._id}`} key={post._id} className="block group">
                  <Card className="h-full hover:shadow-md transition-all overflow-hidden">
                    {post.coverImage && (
                      <div 
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.coverImage})` }}
                      />
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                      <CardDescription>
                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags?.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <span className="text-sm">{post.likes?.length || 0} likes • {post.comments} comments</span>
                      <span className="text-sm">{post.views} views</span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your search.</p>
              {searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clubs">
          {isClubsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading clubs...</p>
            </div>
          ) : filteredClubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club: Club) => (
                <Link to={`/clubs/${club._id}`} key={club._id} className="block group">
                  <Card className="h-full hover:shadow-md transition-all overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center"
                      style={{ backgroundImage: `url(${club.coverImage || '/placeholder.svg'})` }}
                    />
                    <CardHeader className="pb-2">
                      <CardTitle className="group-hover:text-primary transition-colors">{club.name}</CardTitle>
                      <CardDescription>{club.university}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">{club.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="outline">{club.members?.length || 0} members</Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No clubs found matching your search.</p>
              {searchTerm && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
