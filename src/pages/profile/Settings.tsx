
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(160).optional(),
  university: z.string().optional(),
});

const accountFormSchema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).optional(),
});

const socialFormSchema = z.object({
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

const Settings = () => {
  const { toast } = useToast();
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "John Doe",
      username: "johndoe",
      bio: "Computer Science student at University of Tirana. Passionate about web development and AI.",
      university: "University of Tirana",
    },
  });

  // Account form
  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      email: "john.doe@umt.edu.al",
      currentPassword: "",
      newPassword: "",
    },
  });

  // Social links form
  const socialForm = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      twitter: "johndoe",
      linkedin: "johndoe",
      github: "johndoe",
      website: "",
    },
  });

  function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  }

  function onAccountSubmit(data: z.infer<typeof accountFormSchema>) {
    toast({
      title: "Account updated",
      description: "Your account settings have been updated.",
    });
  }

  function onSocialSubmit(data: z.infer<typeof socialFormSchema>) {
    toast({
      title: "Social links updated",
      description: "Your social links have been updated.",
    });
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information shown to other users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form id="profile-form" onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University</FormLabel>
                        <FormControl>
                          <Input placeholder="University of Tirana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Brief description for your profile. Max 160 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="profile-form">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and security.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...accountForm}>
                <form id="account-form" onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-6">
                  <FormField
                    control={accountForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@umt.edu.al" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={accountForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave empty if you don't want to change your password.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="account-form">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Update your social media links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...socialForm}>
                <form id="social-form" onSubmit={socialForm.handleSubmit(onSocialSubmit)} className="space-y-6">
                  <FormField
                    control={socialForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="bg-muted px-3 py-2 text-sm rounded-l-md border border-r-0">twitter.com/</span>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={socialForm.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="bg-muted px-3 py-2 text-sm rounded-l-md border border-r-0">linkedin.com/in/</span>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={socialForm.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="bg-muted px-3 py-2 text-sm rounded-l-md border border-r-0">github.com/</span>
                            <Input className="rounded-l-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={socialForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourwebsite.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" form="social-form">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
