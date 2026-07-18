import { apiRequest } from "./apiClient";

import type { CompleteCareTaskResponse } from "../types/dashboard";

const careTasksEndpoint = "/api/care-tasks";

export function completeCareTask(
  taskId: number,
): Promise<CompleteCareTaskResponse> {
  return apiRequest<CompleteCareTaskResponse>(
    `${careTasksEndpoint}/${taskId}/complete`,
    {
      method: "PATCH",
    },
  );
}