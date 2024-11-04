// src/types/index.ts
export interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}