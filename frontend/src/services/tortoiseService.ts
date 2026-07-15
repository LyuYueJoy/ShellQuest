import { apiRequest } from "./apiClient";

import type {
  CreateTortoiseRequest,
  TortoiseResponse,
  UpdateTortoiseRequest,
} from "../types/tortoise";

const tortoisesEndpoint = "/api/tortoises";

export function getTortoises(): Promise<TortoiseResponse[]> {
  return apiRequest<TortoiseResponse[]>(tortoisesEndpoint);
}

export function getTortoiseById(
  tortoiseId: number,
): Promise<TortoiseResponse> {
  return apiRequest<TortoiseResponse>(
    `${tortoisesEndpoint}/${tortoiseId}`,
  );
}

export function createTortoise(
  tortoiseData: CreateTortoiseRequest,
): Promise<TortoiseResponse> {
  return apiRequest<TortoiseResponse>(tortoisesEndpoint, {
    method: "POST",
    body: JSON.stringify(tortoiseData),
  });
}

export function updateTortoise(
  tortoiseId: number,
  tortoiseData: UpdateTortoiseRequest,
): Promise<TortoiseResponse> {
  return apiRequest<TortoiseResponse>(
    `${tortoisesEndpoint}/${tortoiseId}`,
    {
      method: "PUT",
      body: JSON.stringify(tortoiseData),
    },
  );
}

export function deleteTortoise(
  tortoiseId: number,
): Promise<void> {
  return apiRequest<void>(
    `${tortoisesEndpoint}/${tortoiseId}`,
    {
      method: "DELETE",
    },
  );
}

export function uploadTortoisePhoto(
  tortoiseId: number,
  photo: File,
): Promise<TortoiseResponse> {
  const formData = new FormData();

  // 必须与后端 UploadTortoisePhotoRequest 中的字段名一致。
  formData.append("photo", photo);

  return apiRequest<TortoiseResponse>(
    `${tortoisesEndpoint}/${tortoiseId}/photo`,
    {
      method: "POST",
      body: formData,
    },
  );
}