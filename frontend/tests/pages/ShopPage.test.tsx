import "@testing-library/jest-dom/vitest";
import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ShopPage from "../../src/pages/ShopPage/ShopPage";

import {
  getInventory,
  getShop,
  purchaseShopItem,
} from "../../src/services/shopService";

import type {
  InventoryResponse,
  PurchaseResponse,
  ShopResponse,
} from "../../src/types/shop";

vi.mock("../../src/services/shopService", () => ({
  getShop: vi.fn(),
  getInventory: vi.fn(),
  purchaseShopItem: vi.fn(),
}));

const mockedGetShop = vi.mocked(getShop);
const mockedGetInventory = vi.mocked(getInventory);
const mockedPurchaseShopItem = vi.mocked(
  purchaseShopItem,
);

const shopResponse: ShopResponse = {
  coins: 50,

  items: [
    {
      shopItemId: 1,
      name: "Sunny Straw Hat",
      description:
        "A warm straw hat for sunny garden adventures.",
      category: "Hat",
      price: 25,
      assetKey: "hat_straw",
      assetUrl:
        "/assets/shop/hats/hat-straw.png",
      thumbnailUrl: null,
      assetType: "Overlay",
      defaultX: 0.5,
      defaultY: 0.18,
      defaultScale: 0.35,
      defaultRotation: 0,
      defaultZIndex: 3,
      isOwned: false,
      canAfford: true,
    },
    {
      shopItemId: 2,
      name: "Galaxy Shell",
      description:
        "A colourful shell filled with stars.",
      category: "Shell",
      price: 70,
      assetKey: "shell_galaxy",
      assetUrl:
        "/assets/shop/shells/shell-galaxy.png",
      thumbnailUrl: null,
      assetType: "Overlay",
      defaultX: 0.5,
      defaultY: 0.55,
      defaultScale: 0.65,
      defaultRotation: 0,
      defaultZIndex: 2,
      isOwned: false,
      canAfford: false,
    },
  ],
};

const emptyInventory: InventoryResponse = {
  totalItems: 0,
  items: [],
};

const purchasedInventory: InventoryResponse = {
  totalItems: 1,

  items: [
    {
      userInventoryItemId: 10,
      shopItemId: 1,
      name: "Sunny Straw Hat",
      description:
        "A warm straw hat for sunny garden adventures.",
      category: "Hat",
      assetKey: "hat_straw",
      assetUrl:
        "/assets/shop/hats/hat-straw.png",
      thumbnailUrl: null,
      assetType: "Overlay",
      defaultX: 0.5,
      defaultY: 0.18,
      defaultScale: 0.35,
      defaultRotation: 0,
      defaultZIndex: 3,
      acquiredAt: "2026-07-19T06:00:00Z",
    },
  ],
};

const shopAfterPurchase: ShopResponse = {
  coins: 25,

  items: shopResponse.items.map((item) =>
    item.shopItemId === 1
      ? {
          ...item,
          isOwned: true,
          canAfford: false,
        }
      : {
          ...item,
          canAfford: false,
        },
  ),
};

const purchaseResponse: PurchaseResponse = {
  purchasedItem: purchasedInventory.items[0],
  pricePaid: 25,
  remainingCoins: 25,
};

describe("ShopPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedGetShop.mockResolvedValue(shopResponse);
    mockedGetInventory.mockResolvedValue(
      emptyInventory,
    );
  });

  it("displays loading state while shop is loading", () => {
    mockedGetShop.mockReturnValue(
      new Promise(() => undefined),
    );

    mockedGetInventory.mockReturnValue(
      new Promise(() => undefined),
    );

    render(<ShopPage />);

    expect(
      screen.getByText("Opening the Shell Shop..."),
    ).toBeInTheDocument();
  });

  it("displays coin balance and shop items", async () => {
    render(<ShopPage />);

    expect(
      await screen.findByRole("heading", {
        name: "Shell Shop",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("50 Coins"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Sunny Straw Hat",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Galaxy Shell",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Buy",
      }),
    ).toBeEnabled();

    expect(
      screen.getByRole("button", {
        name: "Need 20",
      }),
    ).toBeDisabled();
  });

  it("filters shop items by category", async () => {
    const user = userEvent.setup();

    render(<ShopPage />);

    await screen.findByRole("heading", {
      name: "Sunny Straw Hat",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Shell",
      }),
    );

    expect(
      screen.queryByRole("heading", {
        name: "Sunny Straw Hat",
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Galaxy Shell",
      }),
    ).toBeInTheDocument();
  });

  it("displays empty shop state when no items exist", async () => {
    mockedGetShop.mockResolvedValue({
      coins: 0,
      items: [],
    });

    render(<ShopPage />);

    expect(
      await screen.findByRole("heading", {
        name: "No shop items found",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "There are no active items in this category.",
      ),
    ).toBeInTheDocument();
  });

  it("displays inventory items in inventory tab", async () => {
    mockedGetInventory.mockResolvedValue(
      purchasedInventory,
    );

    const user = userEvent.setup();

    render(<ShopPage />);

    await screen.findByRole("heading", {
      name: "Sunny Straw Hat",
    });

    await user.click(
      screen.getByRole("tab", {
        name: "My Inventory (1)",
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: "My Collection",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Sunny Straw Hat",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Owned"),
    ).toBeInTheDocument();
  });

  it("opens confirmation dialog before purchase", async () => {
    const user = userEvent.setup();

    render(<ShopPage />);

    await screen.findByRole("heading", {
      name: "Sunny Straw Hat",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Buy",
      }),
    );

    const dialog = screen.getByRole("dialog");

    expect(
      within(dialog).getByText(
        "Purchase Sunny Straw Hat?",
      ),
    ).toBeInTheDocument();

    expect(
      within(dialog).getByText(
        "Current balance: 50 Coins",
      ),
    ).toBeInTheDocument();

    expect(
      within(dialog).getByText(
        "Remaining balance: 25 Coins",
      ),
    ).toBeInTheDocument();

    expect(
      mockedPurchaseShopItem,
    ).not.toHaveBeenCalled();
  });

  it("purchases item and refreshes shop and inventory", async () => {
    mockedGetShop
      .mockResolvedValueOnce(shopResponse)
      .mockResolvedValueOnce(shopAfterPurchase);

    mockedGetInventory
      .mockResolvedValueOnce(emptyInventory)
      .mockResolvedValueOnce(purchasedInventory);

    mockedPurchaseShopItem.mockResolvedValue(
      purchaseResponse,
    );

    const user = userEvent.setup();

    render(<ShopPage />);

    await screen.findByRole("heading", {
      name: "Sunny Straw Hat",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Buy",
      }),
    );

    const dialog = screen.getByRole("dialog");

    await user.click(
      within(dialog).getByRole("button", {
        name: "Confirm purchase",
      }),
    );

    await waitFor(() => {
      expect(
        mockedPurchaseShopItem,
      ).toHaveBeenCalledWith(1);
    });

    expect(mockedGetShop).toHaveBeenCalledTimes(2);
    expect(mockedGetInventory).toHaveBeenCalledTimes(2);

    expect(
    await screen.findByText(
        "Sunny Straw Hat added to your inventory! 25 Coins remaining.",
    ),
    ).toBeInTheDocument();

    // 等待 MUI Dialog 完成退出动画并移除 aria-hidden。
    await waitFor(() => {
    expect(
        screen.queryByRole("dialog"),
    ).not.toBeInTheDocument();
    });

    expect(
    screen.getByText("25 Coins"),
    ).toBeInTheDocument();

    expect(
    screen.getByRole("button", {
        name: "Owned",
    }),
    ).toBeDisabled();
  });

  it("shows purchase error and keeps item available", async () => {
    mockedPurchaseShopItem.mockRejectedValue(
      new Error("Unable to complete purchase."),
    );

    const user = userEvent.setup();

    render(<ShopPage />);

    await screen.findByRole("heading", {
      name: "Sunny Straw Hat",
    });

    await user.click(
      screen.getByRole("button", {
        name: "Buy",
      }),
    );

    const dialog = screen.getByRole("dialog");

    await user.click(
      within(dialog).getByRole("button", {
        name: "Confirm purchase",
      }),
    );

    expect(
      await screen.findByText(
        "Unable to complete purchase.",
      ),
    ).toBeInTheDocument();

    expect(
      mockedPurchaseShopItem,
    ).toHaveBeenCalledWith(1);

    expect(mockedGetShop).toHaveBeenCalledTimes(1);
    expect(mockedGetInventory).toHaveBeenCalledTimes(1);
  });

  it("displays load error and retries", async () => {
    mockedGetShop
      .mockRejectedValueOnce(
        new Error("Unable to load shop."),
      )
      .mockResolvedValueOnce(shopResponse);

    mockedGetInventory.mockResolvedValue(
      emptyInventory,
    );

    const user = userEvent.setup();

    render(<ShopPage />);

    expect(
      await screen.findByText(
        "Unable to load shop.",
      ),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Try again",
      }),
    );

    expect(
      await screen.findByRole("heading", {
        name: "Shell Shop",
      }),
    ).toBeInTheDocument();

    expect(mockedGetShop).toHaveBeenCalledTimes(2);
  });
});