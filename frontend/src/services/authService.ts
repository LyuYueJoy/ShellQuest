import { apiRequest } from "./apiClient";
import type {
  LoginRequest,
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
): Promise<void> {
  return apiRequest<void>("/api/User/login", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
}