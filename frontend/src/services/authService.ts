import { apiRequest } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "../types/auth";

export function registerUser(
  registerData: RegisterRequest,
): Promise<UserResponse> {
  return apiRequest<UserResponse>("/api/User/register", {
    method: "POST",
    body: JSON.stringify(registerData),
  });
}

export function loginUser(
  loginData: LoginRequest,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/User/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}