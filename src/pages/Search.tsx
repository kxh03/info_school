
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Club, Post, User } from "@/types";

// Mock data for search results
const allPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    excerpt: "Learn how to set up and use React with TypeScript for type-safe web development.",
    content: {},
    coverImage: "https://via.placeholder.com/600x300",
    author: "1",
    club: "1",
    likes: ["2", "3", "4"],
    comments: 5,
    status: "published",
    approvalStatus: "approved",
    visibility: "public",
    tags: ["react", "typescript", "programming"],
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
    views: 257,
  },
  {
    id: "2",
    title: "Introduction to Machine Learning with Python",
    excerpt: "A beginner-friendly guide to understanding the basics of machine learning.",
    content: {},
    coverImage: "https://via.placeholder.com/600x300",
    author: "2",
    club: "1",
    likes: ["1", "3"],
    comments: 3,
    status: "published",
    approvalStatus: "approved",
    visibility: "public",
    tags: ["machine learning", "python", "data science"],
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-05-10"),
    views: 185,
  },
  {
    id: "3",
    title: "The Future of Web Development: WASM and Beyond",
    excerpt: "Exploring the next frontier in web development technologies.",
    content: {},
    coverImage: "https://via.placeholder.com/600x300",
    author: "3",
    club: "1",
    likes: ["1", "2", "4", "5"],
    comments: 7,
    status: "published",
    approvalStatus: "approved",
    visibility: "public",
    tags: ["webassembly", "web development", "future tech"],
    createdAt: new Date("2023-06-05"),
    updatedAt: new Date("2023-06-06"),
    views: 312,
  },
];

const allClubs: Club[] = [
  {
    id: "1",
    name: "Computer Science Club",
    description: "For students interested in computer science, programming, and technology.",
    university: "University of Tirana",
    coverImage: "https://via.placeholder.com/600x200",
    admins: ["1"],
    members: ["1", "2", "3", "4", "5"],
    createdAt: new Date("2022-09-01"),
  },
  {
    id: "2",
    name: "Debate Club",
    description: "Forum for structured discussion of issues from multiple perspectives.",
    university: "University of Tirana",
    coverImage: "https://via.placeholder.com/600x200",
    admins: ["3"],
    members: ["3", "4", "6", "7"],
    createdAt: new Date("2022-10-15"),
  },
];

const allUsers: User[] = [
  {
    id: "1",
    email: "alan.smith@umt.edu.al",
    username: "alansmith",
    avatar: "",
    role: "student",
    university: "University of Tirana",
    joinedAt: new Date("2022-09-01"),
  },
  {
    id: "2",
    email: "jane.doe@umt.edu.al",
    username: "janedoe",
    avatar: "",
    role: "student",
    university: "University of Tirana",
    joinedAt: new Date("2022-09-15"),
  },
  {
    id: "3",
    email: "mark.johnson@umt.edu.al",
    username: "markj",
    avatar: "",
    role: "teacher",
    university: "University of Tirana",
    joinedAt: new Date("2022-10-05"),
  },
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all");
  
  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);
  
  // Filter data based on search term
  const filterData = () => {
    const term = searchTerm.toLowerCase();
    
    const posts = allPosts.filter(post => 
      post.title.toLowerCase().includes(term) || 
      post.excerpt.toLowerCase().includes(term) || 
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
    
    const clubs = allClubs.filter(club => 
      club.name.toLowerCase().includes(term) || 
      club.description.toLowerCase().includes(term) || 
      club.university.toLowerCase().includes(term)
    );
    
    const users = allUsers.filter(user => 
      user.username.toLowerCase().includes(term) || 
      user.university?.toLowerCase().includes(term)
    );
    
    return { posts, clubs, users };
  };
  
  const { posts, clubs, users } = filterData();
  const totalResults = posts.length + clubs.length + users.length;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search happens automatically via the useEffect
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for posts, clubs, people..."
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
        
        {searchTerm && (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">Search Results for "{searchTerm}"</h2>
              <p className="text-muted-foreground">{totalResults} results found</p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 mb-8">
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
                <TabsTrigger value="clubs">Clubs ({clubs.length})</TabsTrigger>
                <TabsTrigger value="people">People ({users.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {totalResults > 0 ? (
                  <div className="space-y-12">
                    {posts.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Posts</h3>
                          {posts.length > 2 && (
                            <Button variant="link" onClick={() => setActiveTab("posts")}>
                              See all posts
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {posts.slice(0, 2).map((post) => (
                            <Link key={post.id} to={`/post/${post.id}`} className="block group">
                              <Card className="h-full hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                  <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                                  <CardDescription>
                                    By {allUsers.find(u => u.id === post.author)?.username} • {post.createdAt.toLocaleDateString()}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {post.tags.slice(0, 3).map(tag => (
                                      <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {clubs.length > 0 && (
                      <div>
                        <Separator className="mb-8" />
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Clubs</h3>
                          {clubs.length > 2 && (
                            <Button variant="link" onClick={() => setActiveTab("clubs")}>
                              See all clubs
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {clubs.slice(0, 3).map((club) => (
                            <Link key={club.id} to={`/clubs/${club.id}`} className="block group">
                              <Card className="h-full hover:shadow-md transition-all">
                                <CardHeader className="pb-2">
                                  <CardTitle className="group-hover:text-primary transition-colors">{club.name}</CardTitle>
                                  <CardDescription>{club.university}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="line-clamp-2 text-muted-foreground">{club.description}</p>
                                </CardContent>
                                <CardFooter>
                                  <Badge variant="outline">{club.members.length} members</Badge>
                                </CardFooter>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {users.length > 0 && (
                      <div>
                        <Separator className="mb-8" />
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">People</h3>
                          {users.length > 3 && (
                            <Button variant="link" onClick={() => setActiveTab("people")}>
                              See all people
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {users.slice(0, 3).map((user) => (
                            <Link key={user.id} to={`/profile/${user.username}`} className="block group">
                              <Card className="hover:shadow-md transition-all h-full">
                                <CardHeader>
                                  <div className="flex items-center gap-4">
                                    <Avatar>
                                      <AvatarImage src={user.avatar} />
                                      <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <CardTitle className="group-hover:text-primary transition-colors text-lg">
                                        {user.username}
                                      </CardTitle>
                                      <CardDescription>@{user.username}</CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-sm">
                                    <Badge variant="outline">{user.role}</Badge>
                                    {user.university && <p className="mt-2 text-muted-foreground">{user.university}</p>}
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                    <p className="text-sm text-muted-foreground mt-2">Try using different keywords or check your spelling</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="posts">
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Link key={post.id} to={`/post/${post.id}`} className="block group">
                        <Card className="h-full hover:shadow-md transition-all">
                          {post.coverImage && (
                            <div 
                              className="h-40 bg-cover bg-center"
                              style={{ backgroundImage: `url(${post.coverImage})` }}
                            />
                          )}
                          <CardHeader className="pb-2">
                            <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                            <CardDescription>
                              By {allUsers.find(u => u.id === post.author)?.username} • {post.createdAt.toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <span className="text-sm">{post.likes.length} likes • {post.comments} comments</span>
                            <span className="text-sm">{post.views} views</span>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No posts found matching "{searchTerm}"</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="clubs">
                {clubs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map((club) => (
                      <Link key={club.id} to={`/clubs/${club.id}`} className="block group">
                        <Card className="h-full hover:shadow-md transition-all overflow-hidden">
                          <div 
                            className="h-32 bg-cover bg-center"
                            style={{ backgroundImage: `url(${club.coverImage})` }}
                          />
                          <CardHeader className="pb-2">
                            <CardTitle className="group-hover:text-primary transition-colors">{club.name}</CardTitle>
                            <CardDescription>{club.university}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-2 text-muted-foreground">{club.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Badge variant="outline">{club.members.length} members</Badge>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No clubs found matching "{searchTerm}"</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="people">
                {users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <Link key={user.id} to={`/profile/${user.username}`} className="block group">
                        <Card className="hover:shadow-md transition-all h-full">
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="group-hover:text-primary transition-colors text-lg">
                                  {user.username}
                                </CardTitle>
                                <CardDescription>@{user.username}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline">{user.role}</Badge>
                              {user.university && <span className="text-muted-foreground">{user.university}</span>}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {!searchTerm && (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Search for Content</h2>
            <p className="text-muted-foreground mb-8">Enter keywords to find posts, clubs, or people</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Find Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Search for posts by title, content, or tags</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Discover Clubs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Find clubs at your university or by interest</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Connect with People</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Search for students, teachers, and other users</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
