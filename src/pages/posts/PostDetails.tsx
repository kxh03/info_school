import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Post, User, Comment } from "@/types";
import { postsAPI, authAPI, clubsAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  
  // Redirect if no postId
  React.useEffect(() => {
    if (!postId) {
      navigate("/");
      toast({
        title: "Error",
        description: "Post not found",
        variant: "destructive",
      });
    }
  }, [postId, navigate]);
  
  // Fetch post data
  const { 
    data: post,
    isLoading: isPostLoading,
    error: postError 
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const response = await postsAPI.getPostById(postId);
      return response.data;
    },
    enabled: !!postId
  });
  
  // Fetch author data
  const { 
    data: author,
    isLoading: isAuthorLoading 
  } = useQuery({
    queryKey: ['user', post?.author],
    queryFn: async () => {
      const authorId = typeof post?.author === 'object' ? post.author?._id || post.author?.id : post.author;
      if (!authorId || typeof authorId !== 'string') throw new Error("Author ID is required");
      const response = await authAPI.getUserById(authorId);
      return response.data;
    },
    enabled: !!post?.author
  });
  
  // Fetch club data
  const { 
    data: club,
    isLoading: isClubLoading 
  } = useQuery({
    queryKey: ['club', post?.club],
    queryFn: async () => {
      const clubId = typeof post?.club === 'object' ? post.club?._id || post.club?.id : post.club;
      if (!clubId || typeof clubId !== 'string') throw new Error("Club ID is required");
      const response = await clubsAPI.getClubById(clubId);
      return response.data;
    },
    enabled: !!post?.club
  });
  
  // Fetch comments
  const { 
    data: comments = [],
    isLoading: areCommentsLoading 
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID is required");
      const response = await postsAPI.getCommentsByPostId(postId);
      return response.data;
    },
    enabled: !!postId
  });
  
  // Fetch users for comments
  const commentUserIds = React.useMemo(() => {
    if (!comments.length) return [];
    const ids = comments.map(comment => {
      if (typeof comment.author === 'object') {
        return comment.author?._id || comment.author?.id;
      }
      return comment.author;
    }).filter(id => typeof id === 'string') as string[];
    
    return [...new Set(ids)];
  }, [comments]);
  
  const { 
    data: commentUsers = {},
    isLoading: areCommentUsersLoading 
  } = useQuery({
    queryKey: ['commentUsers', commentUserIds.join(',')],
    queryFn: async () => {
      if (!commentUserIds.length) return {};
      
      // Create a map of user id to user by fetching users individually
      const usersMap: Record<string, User> = {};
      
      await Promise.all(
        commentUserIds.map(async (userId) => {
          try {
            const response = await authAPI.getUserById(userId);
            usersMap[userId] = response.data;
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
          }
        })
      );
      
      return usersMap;
    },
    enabled: commentUserIds.length > 0
  });
  
  if (isPostLoading || isAuthorLoading || isClubLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading post details...</p>
        </div>
      </div>
    );
  }

  if (postError || !post) {
    return (
      <div className="container py-8">
        <div className="text-center p-6 border border-destructive/20 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container py-10 max-w-4xl">
      {post.coverImage && (
        <img 
          src={post.coverImage} 
          alt={post.title}
          className="w-full h-80 object-cover rounded-lg mb-8"
        />
      )}
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {author && (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Link to={`/profile/${author.username}`} className="font-medium hover:text-primary">
                {author.username}
              </Link>
              <p className="text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()} 
                {post.updatedAt > post.createdAt && ` (Updated: ${new Date(post.updatedAt).toLocaleDateString()})`}
              </p>
            </div>
          </div>
        )}
        
        <div className="ml-auto flex gap-3">
          <Button variant="outline" size="sm">
            {post.likes?.length || 0} Likes
          </Button>
          <Button size="sm">
            Share
          </Button>
          {author && author._id === post.author && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/post/${post._id || post.id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {club && (
          <Link to={`/clubs/${club._id || club.id}`} className="hover:text-primary">
            <Badge variant="outline">{club.name}</Badge>
          </Link>
        )}
        {post.tags?.map(tag => (
          <Badge key={tag} variant="secondary">{tag}</Badge>
        ))}
      </div>
      
      <div className="prose prose-lg max-w-none mb-10">
        {post.content ? (
          // If post.content is an object (EditorJS data), we'd need a renderer
          <div>{typeof post.content === 'object' ? 'Complex content' : post.content}</div>
        ) : (
          <p>{post.excerpt}</p>
        )}
      </div>
      
      <Separator className="my-8" />
      
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex gap-3 items-start">
              <Avatar>
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <Textarea placeholder="Add a comment..." className="min-h-[100px] resize-none" />
            </div>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button>Post Comment</Button>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {areCommentsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            comments.map(comment => {
              const commentId = comment._id || comment.id;
              const authorId = typeof comment.author === 'object' 
                ? comment.author?._id || comment.author?.id 
                : comment.author;
              
              // Only try to access commentUsers with string keys
              const commentAuthor = typeof authorId === 'string' ? commentUsers[authorId] : undefined;
              
              return (
                <div key={commentId} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      <AvatarImage src={commentAuthor?.avatar} />
                      <AvatarFallback>{commentAuthor?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      {commentAuthor ? (
                        <Link to={`/profile/${commentAuthor.username}`} className="font-medium hover:text-primary">
                          {commentAuthor.username}
                        </Link>
                      ) : (
                        <span className="font-medium">Unknown User</span>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="ml-10">{comment.content}</p>
                  <div className="flex justify-end gap-3 mt-2">
                    <Button variant="ghost" size="sm">
                      {comment.likes?.length || 0} Likes
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostDetails;
