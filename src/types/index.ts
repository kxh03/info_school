
export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin' | 'external';

export interface User {
  id?: string;
  _id?: string;
  email: string;
  username: string;
  fullName?: string; // Adding this property to fix the TypeScript errors
  avatar?: string;
  bio?: string;
  university?: string;
  role: UserRole;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  joinedAt: Date;
}

export interface Club {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  university: string;
  coverImage?: string;
  admins: string[]; // User IDs
  members: string[]; // User IDs
  createdAt: Date;
}

export interface Post {
  id?: string;
  _id?: string;
  title: string;
  content: any; // EditorJS data
  excerpt: string;
  coverImage?: string;
  author: string | User; // User ID or User object
  club: string | Club; // Club ID or Club object
  likes: string[]; // User IDs
  comments: number;
  status: 'published' | 'draft';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  visibility: 'public' | 'private';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface Comment {
  id?: string;
  _id?: string;
  content: string;
  author: string | User; // User ID or User object
  post: string; // Post ID
  parentId?: string; // For nested comments
  likes: string[]; // User IDs
  createdAt: Date;
}

export interface Notification {
  id?: string;
  _id?: string;
  recipient: string; // User ID
  sender: string; // User ID
  type: 'like' | 'comment' | 'reply' | 'mention' | 'invite' | 'approval' | 'rejection';
  entityId: string; // ID of the related entity (post, comment, etc.)
  read: boolean;
  createdAt: Date;
}
