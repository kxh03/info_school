
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Club } from "@/types";
import { clubsAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const ClubsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Fetch clubs data using React Query
  const { data: clubs = [], isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await clubsAPI.getAllClubs();
      return response.data;
    }
  });
  
  // Filter clubs based on search term
  const filteredClubs = clubs.filter((club: Club) => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (club.university && club.university.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateClub = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a club",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Navigate to create club page
    navigate("/clubs/create");
  };

  if (isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="text-center p-6 border border-destructive/20 bg-destructive/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error loading clubs</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">University Clubs</h1>
          <p className="text-muted-foreground mt-1">Discover and join clubs at universities in Albania</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <Input 
            placeholder="Search clubs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[300px]"
          />
          <Button onClick={handleCreateClub}>
            Create Club
          </Button>
        </div>
      </div>
      
      {clubs.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <h3 className="text-xl font-medium mb-2">No clubs found</h3>
          <p className="text-muted-foreground mb-6">Be the first to create a club!</p>
          <Button onClick={handleCreateClub}>Create Club</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club: Club, index: number) => {
            // Handle MongoDB _id field if present
            const clubId = club._id || club.id;
            
            return (
              <Link to={`/clubs/${clubId}`} key={clubId || index}>
                <Card className="h-full transition-all hover:shadow-md overflow-hidden">
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${club.coverImage || '/placeholder.svg'})` }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle className="group-hover:text-primary transition-colors">{club.name}</CardTitle>
                    <CardDescription>{club.university || "Metropolitan"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">{club.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Badge variant="outline">{club.members?.length || 0} members</Badge>
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(club.createdAt).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
          
          {filteredClubs.length === 0 && searchTerm && (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No clubs found matching your search.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubsList;
