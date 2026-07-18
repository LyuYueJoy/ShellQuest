import { apiRequest } from "./apiClient";

import type { DashboardResponse } from "../types/dashboard";

const dashboardEndpoint = "/api/dashboard";

export function getDashboard(): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(dashboardEndpoint);
}