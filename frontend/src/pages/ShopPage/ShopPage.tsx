import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AutoAwesomeRounded from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CollectionsRounded from "@mui/icons-material/CollectionsRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import ForestRounded from "@mui/icons-material/ForestRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import MonetizationOnRounded from "@mui/icons-material/MonetizationOnRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import ShoppingBagRounded from "@mui/icons-material/ShoppingBagRounded";

import {
  getInventory,
  getShop,
  purchaseShopItem,
} from "../../services/shopService";

import type {
  InventoryItemResponse,
  InventoryResponse,
  ShopItemResponse,
  ShopResponse,
} from "../../types/shop";

import {
  AssetFallback,
  BuyButton,
  CoinBalance,
  ControlsCard,
  EmptyState,
  FilterRow,
  HeroCard,
  HeroContent,
  HeroRow,
  PageContainer,
  PreviewArea,
  Price,
  ProductCard,
  ProductDescription,
  ProductFooter,
  ProductGrid,
  ProductHeader,
  ProductImage,
  ShopTabs,
  StatusCard,
  StatusContainer,
} from "./ShopPage.styles";

const categories = [
  "All",
  "Hat",
  "Shell",
  "Accessory",
  "Background",
] as const;

type ShopCategory = (typeof categories)[number];

interface AssetPreviewProps {
  source: string;
  name: string;
  category: string;
}

function AssetPreview({
  source,
  name,
  category,
}: AssetPreviewProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [source]);

  function fallbackIcon() {
    switch (category.toLowerCase()) {
      case "hat":
        return <EmojiEventsRounded />;

      case "shell":
        return <ForestRounded />;

      case "background":
        return <CollectionsRounded />;

      default:
        return <AutoAwesomeRounded />;
    }
  }

  return (
    <PreviewArea>
      {hasError || !source ? (
        <AssetFallback aria-label={`${name} placeholder`}>
          {fallbackIcon()}
        </AssetFallback>
      ) : (
        <ProductImage
          src={source}
          alt={name}
          onError={() => setHasError(true)}
        />
      )}
    </PreviewArea>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function ShopPage() {
  const [shop, setShop] = useState<ShopResponse | null>(
    null,
  );

  const [inventory, setInventory] =
    useState<InventoryResponse | null>(null);

  const [activeTab, setActiveTab] = useState(0);

  const [category, setCategory] =
    useState<ShopCategory>("All");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedItem, setSelectedItem] =
    useState<ShopItemResponse | null>(null);

  const [purchasingItemId, setPurchasingItemId] =
    useState<number | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [shopResponse, inventoryResponse] =
        await Promise.all([
          getShop(),
          getInventory(),
        ]);

      setShop(shopResponse);
      setInventory(inventoryResponse);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredShopItems = useMemo(() => {
    if (!shop) {
      return [];
    }

    if (category === "All") {
      return shop.items;
    }

    return shop.items.filter(
      (item) => item.category === category,
    );
  }, [shop, category]);

  const filteredInventoryItems = useMemo(() => {
    if (!inventory) {
      return [];
    }

    if (category === "All") {
      return inventory.items;
    }

    return inventory.items.filter(
      (item) => item.category === category,
    );
  }, [inventory, category]);

  async function refreshAfterPurchase() {
    const [shopResponse, inventoryResponse] =
      await Promise.all([
        getShop(),
        getInventory(),
      ]);

    setShop(shopResponse);
    setInventory(inventoryResponse);
  }

  async function handleConfirmPurchase() {
    if (!selectedItem || purchasingItemId !== null) {
      return;
    }

    setPurchasingItemId(selectedItem.shopItemId);
    setActionError("");

    try {
      const result = await purchaseShopItem(
        selectedItem.shopItemId,
      );

      setSuccessMessage(
        `${result.purchasedItem.name} added to your inventory! ${result.remainingCoins} Coins remaining.`,
      );

      setSelectedItem(null);
      await refreshAfterPurchase();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setPurchasingItemId(null);
    }
  }

  function getPurchaseButtonLabel(
    item: ShopItemResponse,
  ): string {
    if (item.isOwned) {
      return "Owned";
    }

    if (!item.canAfford && shop) {
      const missingCoins = Math.max(
        0,
        item.price - shop.coins,
      );

      return `Need ${missingCoins}`;
    }

    return "Buy";
  }

  if (isLoading) {
    return (
      <StatusContainer>
        <Box>
          <CircularProgress size={52} />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Opening the Shell Shop...
          </Typography>
        </Box>
      </StatusContainer>
    );
  }

  if (errorMessage || !shop || !inventory) {
    return (
      <StatusContainer>
        <StatusCard>
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage || "The shop could not be loaded."}
          </Alert>

          <BuyButton
            variant="contained"
            startIcon={<RefreshRounded />}
            onClick={() => void loadData()}
          >
            Try again
          </BuyButton>
        </StatusCard>
      </StatusContainer>
    );
  }

  return (
    <PageContainer>
      <HeroCard>
        <HeroContent>
          <HeroRow>
            <div>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  opacity: 0.8,
                }}
              >
                ShellQuest Marketplace
              </Typography>

              <Typography variant="h3" sx={{ mb: 1 }}>
                Shell Shop
              </Typography>

              <Typography sx={{ opacity: 0.85 }}>
                Spend the Coins earned from caring for your
                tortoises and collect playful avatar items.
              </Typography>
            </div>

            <CoinBalance>
              <MonetizationOnRounded />

              <Typography
                variant="h5"
                sx={{ fontWeight: 900 }}
              >
                {shop.coins} Coins
              </Typography>
            </CoinBalance>
          </HeroRow>
        </HeroContent>
      </HeroCard>

      <ControlsCard>
        <ShopTabs
          value={activeTab}
          onChange={(_, value: number) => {
            setActiveTab(value);
          }}
          aria-label="Shop sections"
        >
          <Tab
            icon={<ShoppingBagRounded />}
            iconPosition="start"
            label="Shop"
          />

          <Tab
            icon={<Inventory2Rounded />}
            iconPosition="start"
            label={`My Inventory (${inventory.totalItems})`}
          />
        </ShopTabs>
      </ControlsCard>

      <FilterRow>
        <Typography variant="h5">
          {activeTab === 0
            ? "Browse Items"
            : "My Collection"}
        </Typography>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={category}
          onChange={(_, value: ShopCategory | null) => {
            if (value) {
              setCategory(value);
            }
          }}
          aria-label="Shop category filter"
        >
          {categories.map((categoryOption) => (
            <ToggleButton
              key={categoryOption}
              value={categoryOption}
            >
              {categoryOption}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FilterRow>

      {activeTab === 0 ? (
        <ProductGrid>
          {filteredShopItems.length === 0 ? (
            <EmptyState>
              <ShoppingBagRounded
                sx={{ fontSize: 54, mb: 1 }}
              />

              <Typography variant="h5" sx={{ mb: 1 }}>
                No shop items found
              </Typography>

              <Typography>
                There are no active items in this category.
              </Typography>
            </EmptyState>
          ) : (
            filteredShopItems.map((item) => (
              <ProductCard key={item.shopItemId}>
                <AssetPreview
                  source={
                    item.thumbnailUrl ?? item.assetUrl
                  }
                  name={item.name}
                  category={item.category}
                />

                <ProductHeader>
                  <div>
                    <Typography variant="h5">
                      {item.name}
                    </Typography>

                    <Chip
                      label={item.category}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </div>

                  {item.isOwned && (
                    <CheckCircleRounded color="success" />
                  )}
                </ProductHeader>

                <ProductDescription>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                </ProductDescription>

                <ProductFooter>
                  <Price>
                    <MonetizationOnRounded />
                    {item.price}
                  </Price>

                  <BuyButton
                    variant={
                      item.isOwned
                        ? "outlined"
                        : "contained"
                    }
                    color={
                      item.isOwned
                        ? "success"
                        : "primary"
                    }
                    disabled={
                      item.isOwned || !item.canAfford
                    }
                    startIcon={
                      item.isOwned ? (
                        <CheckCircleRounded />
                      ) : undefined
                    }
                    onClick={() =>
                      setSelectedItem(item)
                    }
                  >
                    {getPurchaseButtonLabel(item)}
                  </BuyButton>
                </ProductFooter>
              </ProductCard>
            ))
          )}
        </ProductGrid>
      ) : (
        <ProductGrid>
          {filteredInventoryItems.length === 0 ? (
            <EmptyState>
              <Inventory2Rounded
                sx={{ fontSize: 54, mb: 1 }}
              />

              <Typography variant="h5" sx={{ mb: 1 }}>
                Your collection is empty
              </Typography>

              <Typography>
                Purchase an item from the Shop to add it here.
              </Typography>
            </EmptyState>
          ) : (
            filteredInventoryItems.map(
              (item: InventoryItemResponse) => (
                <ProductCard
                  key={item.userInventoryItemId}
                >
                  <AssetPreview
                    source={
                      item.thumbnailUrl ?? item.assetUrl
                    }
                    name={item.name}
                    category={item.category}
                  />

                  <ProductHeader>
                    <div>
                      <Typography variant="h5">
                        {item.name}
                      </Typography>

                      <Chip
                        label={item.category}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </div>

                    <CheckCircleRounded color="success" />
                  </ProductHeader>

                  <ProductDescription>
                    <Typography variant="body2">
                      {item.description}
                    </Typography>
                  </ProductDescription>

                  <ProductFooter>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Added{" "}
                      {new Intl.DateTimeFormat("en-NZ", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.acquiredAt))}
                    </Typography>

                    <Chip
                      label="Owned"
                      color="success"
                      size="small"
                    />
                  </ProductFooter>
                </ProductCard>
              ),
            )
          )}
        </ProductGrid>
      )}

      <Dialog
        open={selectedItem !== null}
        onClose={() => {
          if (purchasingItemId === null) {
            setSelectedItem(null);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Purchase {selectedItem?.name}?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            This item costs {selectedItem?.price} Coins.
            After purchasing it, the item will be permanently
            added to your Inventory.
          </Typography>

          <Typography sx={{ mt: 2, fontWeight: 900 }}>
            Current balance: {shop.coins} Coins
          </Typography>

          <Typography sx={{ fontWeight: 900 }}>
            Remaining balance:{" "}
            {Math.max(
              0,
              shop.coins - (selectedItem?.price ?? 0),
            )}{" "}
            Coins
          </Typography>
        </DialogContent>

        <DialogActions>
          <BuyButton
            variant="text"
            disabled={purchasingItemId !== null}
            onClick={() => setSelectedItem(null)}
          >
            Cancel
          </BuyButton>

          <BuyButton
            variant="contained"
            disabled={purchasingItemId !== null}
            onClick={() => void handleConfirmPurchase()}
          >
            {purchasingItemId !== null
              ? "Purchasing..."
              : "Confirm purchase"}
          </BuyButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={5000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
      />

      <Snackbar
        open={Boolean(actionError)}
        autoHideDuration={5000}
        onClose={() => setActionError("")}
      >
        <Alert
          severity="error"
          onClose={() => setActionError("")}
        >
          {actionError}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}