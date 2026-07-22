export type UserRole = "customer" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthCredentials {
  name: string;
  passwordConfirmation: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: string;
}
