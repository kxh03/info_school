
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/profile/Settings";
import ClubsList from "./pages/clubs/ClubsList";
import ClubDetails from "./pages/clubs/ClubDetails";
import CreateClub from "./pages/clubs/CreateClub";
import PostEditor from "./pages/posts/PostEditor";
import PostDetails from "./pages/posts/PostDetails";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              {/* Public routes accessible to everyone */}
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<Search />} />
              <Route path="/clubs" element={<ClubsList />} />
              <Route path="/clubs/:clubId" element={<ClubDetails />} />
              <Route path="/post/:postId" element={<PostDetails />} />
              
              {/* Auth routes - only for non-authenticated users */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              
              {/* Protected routes - only for authenticated users */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/post/new" element={<PostEditor />} />
                <Route path="/post/:postId/edit" element={<PostEditor />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/clubs/create" element={<CreateClub />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
