
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, ThumbsUp, MessageSquare, Eye } from 'lucide-react';
import { postsAPI } from '@/services/api';
import { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function FeaturedPosts() {
  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Fetch featured posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: async () => {
      const response = await postsAPI.getAllPosts();
      // Filter for published posts and sort by views or likes to get "featured" ones
      return response.data
        .filter((post: Post) => post.status === 'published' && post.approvalStatus === 'approved')
        .sort((a: Post, b: Post) => b.views - a.views)
        .slice(0, 3); // Take top 3 posts
    }
  });
  
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="text-center p-6 border border-destructive/20 bg-destructive/10 rounded-lg">
            <p className="text-muted-foreground">Unable to load featured posts</p>
          </div>
        </div>
      </section>
    );
  }
  
  if (posts.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="text-center p-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No posts available yet</p>
            <Link to="/post/new" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90">
              Create the first post
            </Link>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Card key={post._id} className="hover-scale overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={post.coverImage || '/placeholder.svg'} 
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {post.clubName || "General"}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <Link to={`/post/${post._id}`} className="hover:underline">
                  <CardTitle>{post.title}</CardTitle>
                </Link>
                <CardDescription className="flex items-center mt-2">
                  {post.authorData ? (
                    <>
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={post.authorData.avatar} alt={post.authorData.fullName} />
                        <AvatarFallback>{post.authorData.fullName?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <Link to={`/profile/${post.authorData.username}`} className="text-sm hover:underline">
                        {post.authorData.fullName}
                      </Link>
                    </>
                  ) : (
                    <span className="text-sm">Anonymous</span>
                  )}
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="text-xs">{formatDate(post.createdAt)}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags && post.tags.map((tag: string) => (
                    <Link key={tag} to={`/tag/${tag}`}>
                      <Badge variant="secondary" className="hover:bg-secondary/80">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{post.comments || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{post.views || 0}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/explore" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
            Explore More Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
