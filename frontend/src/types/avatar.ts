export interface AvatarEquippedItem {
  avatarEquippedItemId: number;
  shopItemId: number;
  name: string;
  category: string;
  assetKey: string;
  assetUrl: string;
  assetType: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface TortoiseAvatar {
  tortoiseAvatarId: number;
  tortoiseId: number;
  tortoiseName: string;
  tortoisePhotoUrl: string | null;
  canvasWidth: number;
  canvasHeight: number;
  updatedAt: string;
  equippedItems: AvatarEquippedItem[];
}

export interface EquipAvatarItemRequest {
  shopItemId: number;
}

export interface UpdateAvatarItemRequest {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface UpdateAvatarCanvasRequest {
  canvasWidth: number;
  canvasHeight: number;
}