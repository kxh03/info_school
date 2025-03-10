import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Submit handler
  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    try {
      await login({
        email: data.email,
        password: data.password
      });
      
      // Note: The toast is now handled inside the login function in AuthContext
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Note: Error toast is now handled inside the login function in AuthContext
    } finally {
      setIsLoading(false);
    }
  }

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-16 page-transition">
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="username@university.edu.al" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12.0004 7.83331C10.8613 7.83331 9.90555 8.32419 9.23429 9.10496L9.11963 9.24039L9.10978 9.25399L7.24839 7.39186L7.28226 7.35156C8.36776 6.12441 9.99306 5.33331 12.0004 5.33331C13.9875 5.33331 15.5566 6.10301 16.6559 7.35156L16.6898 7.39186L14.8284 9.25399C14.1241 8.37925 13.1514 7.83331 12.0004 7.83331ZM12.0004 9.66669C13.4734 9.66669 14.6671 10.8604 14.6671 12.3333C14.6671 13.8062 13.4734 15 12.0004 15C10.5275 15 9.33377 13.8062 9.33377 12.3333C9.33377 10.8604 10.5275 9.66669 12.0004 9.66669ZM5.50063 12.3333C5.50063 13.3321 5.69113 14.2428 6.0136 15.0529C6.17966 14.2871 6.66168 13.6211 7.33409 13.2501L9.38343 14.217C9.30232 14.7222 9.23377 15.2622 9.23377 15.8333C9.23377 16.5821 10.1987 17.1667 11.3337 17.1667H12.6671C13.8021 17.1667 14.7671 16.5821 14.7671 15.8333C14.7671 15.2622 14.6985 14.7222 14.6174 14.217L16.6668 13.2501C17.3392 13.6211 17.8212 14.2871 17.9873 15.0529C18.3097 14.2428 18.5002 13.3321 18.5002 12.3333C18.5002 11.3346 18.3097 10.4239 17.9873 9.61382C17.8212 10.3796 17.3392 11.0456 16.6668 11.4166L14.6174 10.4497C14.6985 9.94447 14.7671 9.40455 14.7671 8.83331C14.7671 8.08456 13.8021 7.49998 12.6671 7.49998H11.3337C10.1987 7.49998 9.23377 8.08456 9.23377 8.83331C9.23377 9.40455 9.30232 9.94447 9.38343 10.4497L7.33409 11.4166C6.66168 11.0456 6.17966 10.3796 6.0136 9.61382C5.69113 10.4239 5.50063 11.3346 5.50063 12.3333Z" fill="currentColor"/>
                </svg>
                Sign in with Google
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
