
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Club, Post, User } from "@/types";
import { clubsAPI, postsAPI, authAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Helper component for displaying club admins
const ClubAdminsList = ({ admins = [] }) => {
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      if (!admins || !admins.length) {
        setAdminUsers([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch all users and filter by admin IDs
        const response = await authAPI.getUsers();
        const allUsers = response.data;
        const adminUsersData = allUsers.filter((user: User) => 
          admins.includes(user._id) || admins.includes(user.id)
        );
        
        console.log("Admin users found:", adminUsersData);
        setAdminUsers(adminUsersData);
      } catch (error) {
        console.error("Failed to fetch admin users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [admins]);

  if (loading) {
    return <p className="text-muted-foreground">Loading admins...</p>;
  }

  return (
    <>
      {adminUsers && adminUsers.length > 0 ? (
        <div className="space-y-3">
          {adminUsers.map(user => (
            <div key={user._id || user.id} className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No admins found</p>
      )}
    </>
  );
};

// Helper component for displaying club members
const ClubMembersList = ({ members = [] }) => {
  const [memberUsers, setMemberUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!members || !members.length) {
        setMemberUsers([]);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching members with IDs:", members);
        // Get all users and filter by member IDs
        const response = await authAPI.getUsers();
        const allUsers = response.data;
        const memberUsersData = allUsers.filter((user: User) => 
          members.includes(user._id) || members.includes(user.id)
        );
        
        console.log("Members found:", memberUsersData.length);
        setMemberUsers(memberUsersData);
      } catch (error) {
        console.error("Failed to fetch member users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [members]);

  if (loading) {
    return <p className="text-center text-muted-foreground py-4">Loading members...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memberUsers && memberUsers.length > 0 ? (
        memberUsers.map(user => (
          <div key={user._id || user.id} className="flex items-center gap-2 p-2 border rounded">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{user.username}</span>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-muted-foreground py-4">
          No members yet
        </p>
      )}
    </div>
  );
};

const ClubDetails = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Redirect if no clubId
  React.useEffect(() => {
    if (!clubId) {
      navigate("/clubs");
      toast({
        title: "Error",
        description: "Club not found",
        variant: "destructive",
      });
    }
  }, [clubId, navigate]);
  
  // Fetch club data
  const { 
    data: club,
    isLoading: isClubLoading,
    error: clubError 
  } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("Club ID is required");
      const response = await clubsAPI.getClubById(clubId);
      console.log("Club data:", response.data);
      return response.data;
    },
    enabled: !!clubId
  });
  
  // Fetch club posts
  const { 
    data: posts = [],
    isLoading: isPostsLoading
  } = useQuery({
    queryKey: ['clubPosts', clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("Club ID is required");
      // Get all posts and filter by club ID
      const response = await postsAPI.getAllPosts();
      return response.data.filter((post: Post) => {
        if (typeof post.club === 'string') {
          return post.club === clubId;
        } else if (post.club && typeof post.club === 'object') {
          return post.club._id === clubId || post.club.id === clubId;
        }
        return false;
      });
    },
    enabled: !!clubId
  });
  
  // Check if current user is a member
  const isMember = club?.members?.some(memberId => 
    memberId === currentUser?.id || 
    memberId === currentUser?._id || 
    memberId?.toString() === currentUser?.id?.toString() || 
    memberId?.toString() === currentUser?._id?.toString()
  );
  
  // Check if current user is an admin
  const isAdmin = club?.admins?.some(adminId => 
    adminId === currentUser?.id || 
    adminId === currentUser?._id || 
    adminId?.toString() === currentUser?.id?.toString() || 
    adminId?.toString() === currentUser?._id?.toString()
  );
  
  // Join club mutation
  const joinClubMutation = useMutation({
    mutationFn: () => clubsAPI.joinClub(clubId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      toast({
        title: "Success",
        description: "You have joined the club",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to join club",
        variant: "destructive",
      });
    }
  });
  
  // Leave club mutation
  const leaveClubMutation = useMutation({
    mutationFn: () => clubsAPI.leaveClub(clubId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      toast({
        title: "Success",
        description: "You have left the club",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to leave club",
        variant: "destructive",
      });
    }
  });

  const handleJoinClub = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to join this club",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    joinClubMutation.mutate();
  };

  const handleLeaveClub = () => {
    leaveClubMutation.mutate();
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    navigate(`/post/new?club=${clubId}`);
  };

  if (isClubLoading) {
    return (
      <div className="container py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading club details...</p>
        </div>
      </div>
    );
  }

  if (clubError || !club) {
    return (
      <div className="container py-8">
        <div className="text-center p-6 border border-destructive/20 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Club not found</h2>
          <p className="text-muted-foreground mb-4">The club you're looking for doesn't exist or has been removed.</p>
          <Link to="/clubs">
            <Button>Back to Clubs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div 
        className="h-60 bg-cover bg-center rounded-lg mb-6"
        style={{ backgroundImage: `url(${club.coverImage || '/placeholder.svg'})` }}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{club.name}</h1>
          <p className="text-muted-foreground mt-1">{club.university || "Metropolitan"}</p>
        </div>
        
        <div className="flex gap-3">
          {isMember ? (
            <>
              <Button variant="outline" onClick={handleLeaveClub} disabled={leaveClubMutation.isPending}>
                {leaveClubMutation.isPending ? "Leaving..." : "Leave Club"}
              </Button>
              <Button onClick={handleCreatePost}>New Post</Button>
            </>
          ) : (
            <Button onClick={handleJoinClub} disabled={joinClubMutation.isPending}>
              {joinClubMutation.isPending ? "Joining..." : "Join Club"}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="about">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Club</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{club.description}</p>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Club Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(club.createdAt).toLocaleDateString()}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">University:</span>
                      <span>{club.university || "Metropolitan"}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Members:</span>
                      <span>{club.members?.length || 0}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Club Admins</h3>
                  <ClubAdminsList admins={club.admins} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="posts" className="mt-6">
          {isPostsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post: Post) => {
                const postId = post._id || post.id;
                return (
                  <Link to={`/post/${postId}`} key={postId}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags?.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                {isMember && (
                  <Button onClick={handleCreatePost}>Create the first post</Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="members" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Club Members</CardTitle>
              <CardDescription>
                {club.members?.length || 0} members in this club
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClubMembersList members={club.members} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubDetails;
