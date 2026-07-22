import { apiRequest } from "./apiClient";

import type {
  EquipAvatarItemRequest,
  TortoiseAvatar,
  UpdateAvatarCanvasRequest,
  UpdateAvatarItemRequest,
} from "../types/avatar";

const avatarEndpoint = (tortoiseId: number) =>
  `/api/tortoises/${tortoiseId}/avatar`;

export function getAvatar(
  tortoiseId: number,
): Promise<TortoiseAvatar> {
  return apiRequest<TortoiseAvatar>(
    avatarEndpoint(tortoiseId),
  );
}

export function equipAvatarItem(
  tortoiseId: number,
  request: EquipAvatarItemRequest,
): Promise<TortoiseAvatar> {
  return apiRequest<TortoiseAvatar>(
    `${avatarEndpoint(tortoiseId)}/items`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
}

export function updateAvatarItem(
  tortoiseId: number,
  equippedItemId: number,
  request: UpdateAvatarItemRequest,
): Promise<TortoiseAvatar> {
  return apiRequest<TortoiseAvatar>(
    `${avatarEndpoint(tortoiseId)}/items/${equippedItemId}`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}

export function removeAvatarItem(
  tortoiseId: number,
  equippedItemId: number,
): Promise<TortoiseAvatar> {
  return apiRequest<TortoiseAvatar>(
    `${avatarEndpoint(tortoiseId)}/items/${equippedItemId}`,
    {
      method: "DELETE",
    },
  );
}

export function updateAvatarCanvas(
  tortoiseId: number,
  request: UpdateAvatarCanvasRequest,
): Promise<TortoiseAvatar> {
  return apiRequest<TortoiseAvatar>(
    `${avatarEndpoint(tortoiseId)}/canvas`,
    {
      method: "PUT",
      body: JSON.stringify(request),
    },
  );
}