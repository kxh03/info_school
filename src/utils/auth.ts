
/**
 * Helper functions for authentication and user management
 */

import { UserRole, User } from "@/types";

/**
 * Validates if the email belongs to a university domain
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isUniversityEmail = (email: string): boolean => {
  return email.endsWith('edu.al');
};

/**
 * Generates a username from a university email
 * @param email University email
 * @returns Generated username
 */
export const generateUsername = (email: string): string => {
  // Extract the username part from email (before @)
  return email.split('@')[0];
};

/**
 * Determines the user role based on email domain and optional role override
 * @param email User email
 * @param role Optional role override
 * @returns User role
 */
export const determineUserRole = (email: string, role?: UserRole): UserRole => {
  if (role) return role;
  
  if (!isUniversityEmail(email)) {
    return 'external';
  }
  
  return 'student';
};

/**
 * Checks if a user has permission to perform an action
 * @param user User object
 * @param requiredRole Minimum role required
 * @returns Boolean indicating if user has permission
 */
export const hasPermission = (user: User, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    'external': 0,
    'student': 1,
    'teacher': 2,
    'admin': 3,
    'superadmin': 4
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

/**
 * Checks if a user is an admin of a club
 * @param userId User ID
 * @param clubAdmins Array of admin user IDs
 * @returns Boolean indicating if user is an admin
 */
export const isClubAdmin = (userId: string, clubAdmins: string[]): boolean => {
  return clubAdmins.some(adminId => 
    adminId === userId || adminId.toString() === userId.toString()
  );
};
