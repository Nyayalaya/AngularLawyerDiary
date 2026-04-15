export type UserRole = 'superadmin' | 'lawyer' | 'client' | 'corporate';

export interface LoginResponse {
  id: string;
  email: string;
  userName: string;
  jwToken: string;
  issuedOn: string;
  expiresOn: string;
  isVerified: boolean;
  roles: string[] | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
