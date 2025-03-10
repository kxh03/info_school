
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Bell, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 shadow-sm animate-fade-in">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold">Campus Connections</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/explore" className="story-link px-3 py-2">
            Explore
          </Link>
          <Link to="/clubs" className="story-link px-3 py-2">
            Clubs
          </Link>
          <Link to="/about" className="story-link px-3 py-2">
            About
          </Link>
          
          <div className="ml-4 flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-3 bg-muted/50 mb-1 rounded">
                        <div className="text-sm font-medium">Alex commented on your post</div>
                        <div className="text-xs text-muted-foreground">2 minutes ago</div>
                      </div>
                      <div className="p-3 mb-1">
                        <div className="text-sm font-medium">Mark liked your post</div>
                        <div className="text-xs text-muted-foreground">1 hour ago</div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <Link to="/notifications" className="w-full">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <img 
                        src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${currentUser?.username || 'User'}&background=random`} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg z-50 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <Link 
              to="/explore" 
              className="px-3 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/clubs" 
              className="px-3 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubs
            </Link>
            <Link 
              to="/about" 
              className="px-3 py-2 hover:bg-muted rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="border-t border-border my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-3 py-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center px-3 py-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/notifications" 
                    className="flex items-center px-3 py-2 hover:bg-muted rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="w-full mt-4"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                    asChild
                  >
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                    asChild
                  >
                    <Link to="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
