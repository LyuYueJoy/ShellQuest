export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  userName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}