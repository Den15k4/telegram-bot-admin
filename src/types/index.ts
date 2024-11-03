export interface User {
  id: number;
  email: string;
  role: 'admin' | 'support' | 'viewer';
  created_at: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
}
