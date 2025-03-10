
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Notification, User } from "@/types";

const Notifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      recipient: "1", // Current user
      sender: "2",
      type: "like",
      entityId: "1", // Post ID
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      recipient: "1",
      sender: "3",
      type: "comment",
      entityId: "1", // Post ID
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      recipient: "1",
      sender: "4",
      type: "invite",
      entityId: "2", // Club ID
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "4",
      recipient: "1",
      sender: "5",
      type: "reply",
      entityId: "2", // Comment ID
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: "5",
      recipient: "1",
      sender: "6",
      type: "mention",
      entityId: "3", // Post ID
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
  ]);

  // Mock users data
  const users: Record<string, User> = {
    "2": {
      id: "2",
      email: "jane.doe@umt.edu.al",
      username: "janedoe",
      avatar: "",
      role: "student",
      university: "Metropolitan",
      joinedAt: new Date("2022-09-15"),
    },
    "3": {
      id: "3",
      email: "mark.johnson@umt.edu.al",
      username: "markj",
      avatar: "",
      role: "student",
      university: "Metropolitan",
      joinedAt: new Date("2022-10-05"),
    },
    "4": {
      id: "4",
      email: "emma.wilson@umt.edu.al",
      username: "emmaw",
      avatar: "",
      role: "student",
      university: "Metropolitan",
      joinedAt: new Date("2022-11-10"),
    },
    "5": {
      id: "5",
      email: "david.brown@umt.edu.al",
      username: "davidb",
      avatar: "",
      role: "teacher",
      university: "Metropolitan",
      joinedAt: new Date("2022-08-20"),
    },
    "6": {
      id: "6",
      email: "sarah.miller@umt.edu.al",
      username: "sarahm",
      avatar: "",
      role: "student",
      university: "Metropolitan",
      joinedAt: new Date("2022-09-25"),
    },
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All notifications marked as read",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast({
      title: "Notification removed",
    });
  };

  const getNotificationContent = (notification: Notification) => {
    const user = users[notification.sender];
    
    if (!user) return { title: "New notification", link: "/" };
    
    switch (notification.type) {
      case "like":
        return {
          title: `${user.username} liked your post`,
          link: `/post/${notification.entityId}`,
        };
      case "comment":
        return {
          title: `${user.username} commented on your post`,
          link: `/post/${notification.entityId}`,
        };
      case "reply":
        return {
          title: `${user.username} replied to your comment`,
          link: `/post/${notification.entityId}`,
        };
      case "mention":
        return {
          title: `${user.username} mentioned you in a post`,
          link: `/post/${notification.entityId}`,
        };
      case "invite":
        return {
          title: `${user.username} invited you to join a club`,
          link: `/clubs/${notification.entityId}`,
        };
      default:
        return {
          title: "New notification",
          link: "/",
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-muted-foreground mt-1">{unreadCount} unread notifications</p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const { title, link } = getNotificationContent(notification);
                const user = users[notification.sender];
                
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 flex items-start gap-4 rounded-md transition-colors hover:bg-accent/50 ${!notification.read ? 'bg-accent/30' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Avatar>
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={link} className="font-medium hover:text-primary">
                        {title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground" 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        deleteNotification(notification.id);
                      }}
                    >
                      <span className="sr-only">Delete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You have no notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
