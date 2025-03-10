
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Edit, 
  AlertTriangle 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for pending posts
const pendingPosts = [
  {
    id: "1",
    title: "New Research Findings in Computer Science",
    excerpt: "Our club's latest research project has yielded interesting results...",
    author: {
      id: "1",
      username: "johndoe",
      fullName: "John Doe",
      avatar: ""
    },
    club: {
      id: "1",
      name: "Research Club"
    },
    createdAt: new Date("2023-06-15T10:30:00Z"),
    status: "published",
    visibility: "public"
  },
  {
    id: "2",
    title: "Campus Sustainability Initiative",
    excerpt: "Our plan to make the campus more environmentally friendly...",
    author: {
      id: "2",
      username: "janesmith",
      fullName: "Jane Smith",
      avatar: ""
    },
    club: {
      id: "3",
      name: "Environmental Club"
    },
    createdAt: new Date("2023-06-14T14:45:00Z"),
    status: "published",
    visibility: "private"
  }
];

export default function PendingApprovals() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(pendingPosts);
  
  // Function to approve a post
  const handleApprove = (postId: string) => {
    // In a real app, this would be an API call
    setPosts(posts.filter(post => post.id !== postId));
    
    toast({
      title: "Post Approved",
      description: "The post has been approved and is now published.",
    });
  };
  
  // Function to reject a post
  const handleReject = (postId: string) => {
    // In a real app, this would be an API call
    setPosts(posts.filter(post => post.id !== postId));
    
    toast({
      title: "Post Rejected",
      description: "The post has been rejected and returned to the author.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pending Approvals</h2>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Pending</TabsTrigger>
          <TabsTrigger value="research">Research Club</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Club</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          Submitted by {post.author.fullName} on {post.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p>{post.excerpt}</p>
                    
                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{post.author.fullName}</span>
                      </div>
                      
                      <Separator orientation="vertical" className="h-6" />
                      
                      <Badge>{post.club.name}</Badge>
                      
                      <Separator orientation="vertical" className="h-6" />
                      
                      <Badge variant={post.visibility === "public" ? "default" : "secondary"}>
                        {post.visibility === "public" ? "Public" : "Private"}
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/post/${post.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleReject(post.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleApprove(post.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Pending Posts</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There are no posts waiting for your approval at this moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="research">
          {/* Similar content, filtered for Research Club */}
        </TabsContent>
        
        <TabsContent value="environmental">
          {/* Similar content, filtered for Environmental Club */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
