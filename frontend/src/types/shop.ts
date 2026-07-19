export interface ShopResponse {
  coins: number;
  items: ShopItemResponse[];
}

export interface ShopItemResponse {
  shopItemId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  assetKey: string;
  assetUrl: string;
  thumbnailUrl: string | null;
  assetType: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
  defaultRotation: number;
  defaultZIndex: number;
  isOwned: boolean;
  canAfford: boolean;
}

export interface InventoryResponse {
  totalItems: number;
  items: InventoryItemResponse[];
}

export interface InventoryItemResponse {
  userInventoryItemId: number;
  shopItemId: number;
  name: string;
  description: string;
  category: string;
  assetKey: string;
  assetUrl: string;
  thumbnailUrl: string | null;
  assetType: string;
  defaultX: number;
  defaultY: number;
  defaultScale: number;
  defaultRotation: number;
  defaultZIndex: number;
  acquiredAt: string;
}

export interface PurchaseResponse {
  purchasedItem: InventoryItemResponse;
  pricePaid: number;
  remainingCoins: number;
}