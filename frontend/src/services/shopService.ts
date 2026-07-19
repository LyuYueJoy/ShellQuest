import { apiRequest } from "./apiClient";

import type {
  InventoryResponse,
  PurchaseResponse,
  ShopResponse,
} from "../types/shop";

const shopEndpoint = "/api/shop";
const inventoryEndpoint = "/api/inventory";

export function getShop(): Promise<ShopResponse> {
  return apiRequest<ShopResponse>(shopEndpoint);
}

export function getInventory(): Promise<InventoryResponse> {
  return apiRequest<InventoryResponse>(
    inventoryEndpoint,
  );
}

export function purchaseShopItem(
  itemId: number,
): Promise<PurchaseResponse> {
  return apiRequest<PurchaseResponse>(
    `${shopEndpoint}/items/${itemId}/purchase`,
    {
      method: "POST",
    },
  );
}