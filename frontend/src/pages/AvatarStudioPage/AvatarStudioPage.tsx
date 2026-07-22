import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import Pets from "@mui/icons-material/Pets";
import Save from "@mui/icons-material/Save";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  equipAvatarItem,
  getAvatar,
  removeAvatarItem,
  updateAvatarItem,
} from "../../services/avatarService";
import { getInventory } from "../../services/shopService";
import { getTortoises } from "../../services/tortoiseService";

import type {
  AvatarEquippedItem,
  TortoiseAvatar,
  UpdateAvatarItemRequest,
} from "../../types/avatar";
import type { InventoryItemResponse } from "../../types/shop";
import type { TortoiseResponse } from "../../types/tortoise";

import {
  AvatarCanvas,
  ControlRow,
  ControlsGrid,
  EmptyCanvas,
  EquippedAsset,
  HeroCard,
  HeroContent,
  InventoryAction,
  InventoryCard,
  InventoryGrid,
  InventoryImage,
  LoadingArea,
  PageContainer,
  PanelCard,
  StudioGrid,
  TortoisePhoto,
} from "./AvatarStudioPage.styles";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getPhotoUrl(photoUrl: string | null): string | null {
  if (!photoUrl) {
    return null;
  }

  if (
    photoUrl.startsWith("http://") ||
    photoUrl.startsWith("https://")
  ) {
    return photoUrl;
  }

  const path = photoUrl.startsWith("/")
    ? photoUrl
    : `/${photoUrl}`;

  return `${apiBaseUrl}${path}`;
}

function getAssetUrl(assetUrl: string): string {
  if (
    assetUrl.startsWith("http://") ||
    assetUrl.startsWith("https://")
  ) {
    return assetUrl;
  }

  return assetUrl.startsWith("/")
    ? assetUrl
    : `/${assetUrl}`;
}

function toUpdateRequest(
  item: AvatarEquippedItem,
): UpdateAvatarItemRequest {
  return {
    x: item.x,
    y: item.y,
    scale: item.scale,
    rotation: item.rotation,
    zIndex: item.zIndex,
  };
}

export default function AvatarStudioPage() {
  const [tortoises, setTortoises] = useState<
    TortoiseResponse[]
  >([]);
  const [inventory, setInventory] = useState<
    InventoryItemResponse[]
  >([]);
  const [selectedTortoiseId, setSelectedTortoiseId] =
    useState<number | null>(null);
  const [avatar, setAvatar] =
    useState<TortoiseAvatar | null>(null);
  const [selectedItemId, setSelectedItemId] =
    useState<number | null>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyShopItemId, setBusyShopItemId] =
    useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const selectedItem = useMemo(
    () =>
      avatar?.equippedItems.find(
        (item) =>
          item.avatarEquippedItemId === selectedItemId,
      ) ?? null,
    [avatar, selectedItemId],
  );

  const loadInitialData = useCallback(async () => {
    setPageLoading(true);
    setError(null);

    try {
      const [tortoiseData, inventoryData] =
        await Promise.all([
          getTortoises(),
          getInventory(),
        ]);

      setTortoises(tortoiseData);
      setInventory(inventoryData.items);

      if (tortoiseData.length > 0) {
        setSelectedTortoiseId(
          (currentId) =>
            currentId ?? tortoiseData[0].tortoiseId,
        );
      }
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Avatar Studio could not be loaded.",
      );
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (selectedTortoiseId === null) {
      setAvatar(null);
      return;
    }

    let cancelled = false;

    async function loadAvatar() {
      setAvatarLoading(true);
      setError(null);
      setSelectedItemId(null);

      try {
        const avatarData = await getAvatar(
          selectedTortoiseId!,
        );

        if (!cancelled) {
          setAvatar(avatarData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setAvatar(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The avatar could not be loaded.",
          );
        }
      } finally {
        if (!cancelled) {
          setAvatarLoading(false);
        }
      }
    }

    void loadAvatar();

    return () => {
      cancelled = true;
    };
  }, [selectedTortoiseId]);

  function isEquipped(shopItemId: number): boolean {
    return (
      avatar?.equippedItems.some(
        (item) => item.shopItemId === shopItemId,
      ) ?? false
    );
  }

  async function handleInventoryAction(
    inventoryItem: InventoryItemResponse,
  ) {
    if (!avatar || selectedTortoiseId === null) {
      return;
    }

    const equippedItem = avatar.equippedItems.find(
      (item) =>
        item.shopItemId === inventoryItem.shopItemId,
    );

    setBusyShopItemId(inventoryItem.shopItemId);
    setError(null);

    try {
      if (equippedItem) {
        const updatedAvatar = await removeAvatarItem(
          selectedTortoiseId,
          equippedItem.avatarEquippedItemId,
        );

        setAvatar(updatedAvatar);

        if (
          selectedItemId ===
          equippedItem.avatarEquippedItemId
        ) {
          setSelectedItemId(null);
        }

        setSuccessMessage(`${inventoryItem.name} removed.`);
      } else {
        const updatedAvatar = await equipAvatarItem(
          selectedTortoiseId,
          {
            shopItemId: inventoryItem.shopItemId,
          },
        );

        setAvatar(updatedAvatar);

        const newlyEquipped =
          updatedAvatar.equippedItems.find(
            (item) =>
              item.shopItemId ===
              inventoryItem.shopItemId,
          );

        setSelectedItemId(
          newlyEquipped?.avatarEquippedItemId ?? null,
        );
        setSuccessMessage(`${inventoryItem.name} equipped!`);
      }
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "The item could not be updated.",
      );
    } finally {
      setBusyShopItemId(null);
    }
  }

  function updateSelectedItemLocally(
    field: keyof UpdateAvatarItemRequest,
    value: number,
  ) {
    if (!selectedItem) {
      return;
    }

    setAvatar((currentAvatar) => {
      if (!currentAvatar) {
        return currentAvatar;
      }

      return {
        ...currentAvatar,
        equippedItems:
          currentAvatar.equippedItems.map((item) =>
            item.avatarEquippedItemId ===
            selectedItem.avatarEquippedItemId
              ? { ...item, [field]: value }
              : item,
          ),
      };
    });
  }

  async function handleSaveSelectedItem() {
    if (
      !selectedItem ||
      selectedTortoiseId === null
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedAvatar = await updateAvatarItem(
        selectedTortoiseId,
        selectedItem.avatarEquippedItemId,
        toUpdateRequest(selectedItem),
      );

      setAvatar(updatedAvatar);
      setSuccessMessage("Avatar changes saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Avatar changes could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveSelectedItem() {
    if (
      !selectedItem ||
      selectedTortoiseId === null
    ) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedAvatar = await removeAvatarItem(
        selectedTortoiseId,
        selectedItem.avatarEquippedItemId,
      );

      setAvatar(updatedAvatar);
      setSelectedItemId(null);
      setSuccessMessage(`${selectedItem.name} removed.`);
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "The item could not be removed.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (pageLoading) {
    return (
      <PageContainer>
        <LoadingArea>
          <CircularProgress />
          <Typography>Opening Avatar Studio...</Typography>
        </LoadingArea>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeroCard>
        <HeroContent>
          <Stack
            spacing={2}
            sx={{
                flexDirection: {
                xs: "column",
                sm: "row",
                },
                alignItems: {
                xs: "flex-start",
                sm: "center",
                },
            }}
            >
            <AutoAwesome sx={{ fontSize: 48 }} />

            <Box>
              <Typography
                component="h1"
                variant="h3"
                sx={{ fontWeight: 900 }}
              >
                Avatar Studio
              </Typography>

              <Typography sx={{ mt: 1, opacity: 0.9 }}>
                Dress up your tortoise and create a unique
                ShellQuest look.
              </Typography>
            </Box>
          </Stack>
        </HeroContent>
      </HeroCard>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ mt: 3 }}
        >
          {error}
        </Alert>
      )}

      {tortoises.length === 0 ? (
        <PanelCard sx={{ mt: 3, textAlign: "center" }}>
          <Pets
            color="primary"
            sx={{ fontSize: 72, mb: 2 }}
          />

          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Add a tortoise first
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Avatar Studio needs a tortoise to dress up.
          </Typography>

          <Button
            href="/tortoises/new"
            variant="contained"
            sx={{ mt: 3 }}
          >
            Add Tortoise
          </Button>
        </PanelCard>
      ) : (
        <StudioGrid>
          <Box>
            <PanelCard>
              <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                        justifyContent: "space-between",
                        alignItems: {
                        xs: "stretch",
                        sm: "center",
                        },
                    }}
                    >
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    Avatar Canvas
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Select an equipped item to customise it.
                  </Typography>
                </Box>

                <FormControl
                  size="small"
                  sx={{ minWidth: 210 }}
                >
                  <InputLabel id="avatar-tortoise-label">
                    Tortoise
                  </InputLabel>

                  <Select
                    labelId="avatar-tortoise-label"
                    label="Tortoise"
                    value={selectedTortoiseId ?? ""}
                    onChange={(event) =>
                      setSelectedTortoiseId(
                        Number(event.target.value),
                      )
                    }
                  >
                    {tortoises.map((tortoise) => (
                      <MenuItem
                        key={tortoise.tortoiseId}
                        value={tortoise.tortoiseId}
                      >
                        {tortoise.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              {avatarLoading ? (
                <LoadingArea>
                  <CircularProgress />
                  <Typography>Loading avatar...</Typography>
                </LoadingArea>
              ) : (
                <AvatarCanvas>
                  {avatar?.tortoisePhotoUrl ? (
                    <TortoisePhoto
                      src={
                        getPhotoUrl(
                          avatar.tortoisePhotoUrl,
                        ) ?? undefined
                      }
                      alt={avatar.tortoiseName}
                    />
                  ) : (
                    <EmptyCanvas>
                      <Box>
                        <Pets
                          color="primary"
                          sx={{ fontSize: 72 }}
                        />

                        <Typography sx={{ fontWeight: 800 }}>
                          Upload a tortoise photo to complete
                          the avatar.
                        </Typography>
                      </Box>
                    </EmptyCanvas>
                  )}

                  {avatar?.equippedItems
                    .slice()
                    .sort(
                      (firstItem, secondItem) =>
                        firstItem.zIndex -
                        secondItem.zIndex,
                    )
                    .map((item) => (
                      <EquippedAsset
                        key={item.avatarEquippedItemId}
                        src={getAssetUrl(item.assetUrl)}
                        alt={item.name}
                        selected={
                          selectedItemId ===
                          item.avatarEquippedItemId
                        }
                        onClick={() =>
                          setSelectedItemId(
                            item.avatarEquippedItemId,
                          )
                        }
                        style={{
                          left: `${item.x * 100}%`,
                          top: `${item.y * 100}%`,
                          width: `${item.scale * 40}%`,
                          zIndex: item.zIndex,
                          transform: `
                            translate(-50%, -50%)
                            rotate(${item.rotation}deg)
                          `,
                        }}
                      />
                    ))}
                </AvatarCanvas>
              )}
            </PanelCard>

            {selectedItem && (
              <PanelCard sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  Edit {selectedItem.name}
                </Typography>

                <ControlsGrid>
                  <ControlRow>
                    <Typography sx={{ fontWeight: 800 }}>X</Typography>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedItem.x}
                      onChange={(_, value) =>
                        updateSelectedItemLocally(
                          "x",
                          value as number,
                        )
                      }
                    />
                    <Typography>
                      {selectedItem.x.toFixed(2)}
                    </Typography>
                  </ControlRow>

                  <ControlRow>
                    <Typography sx={{ fontWeight: 800 }}>Y</Typography>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={selectedItem.y}
                      onChange={(_, value) =>
                        updateSelectedItemLocally(
                          "y",
                          value as number,
                        )
                      }
                    />
                    <Typography>
                      {selectedItem.y.toFixed(2)}
                    </Typography>
                  </ControlRow>

                  <ControlRow>
                    <Typography sx={{ fontWeight: 800 }}>
                      Scale
                    </Typography>
                    <Slider
                      min={0.1}
                      max={3}
                      step={0.05}
                      value={selectedItem.scale}
                      onChange={(_, value) =>
                        updateSelectedItemLocally(
                          "scale",
                          value as number,
                        )
                      }
                    />
                    <Typography>
                      {selectedItem.scale.toFixed(2)}
                    </Typography>
                  </ControlRow>

                  <ControlRow>
                    <Typography sx={{ fontWeight: 800 }}>
                      Rotate
                    </Typography>
                    <Slider
                      min={-180}
                      max={180}
                      step={1}
                      value={selectedItem.rotation}
                      onChange={(_, value) =>
                        updateSelectedItemLocally(
                          "rotation",
                          value as number,
                        )
                      }
                    />
                    <Typography>
                      {selectedItem.rotation}°
                    </Typography>
                  </ControlRow>

                  <ControlRow>
                    <Typography sx={{ fontWeight: 800 }}>
                      Layer
                    </Typography>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      value={selectedItem.zIndex}
                      onChange={(_, value) =>
                        updateSelectedItemLocally(
                          "zIndex",
                          value as number,
                        )
                      }
                    />
                    <Typography>
                      {selectedItem.zIndex}
                    </Typography>
                  </ControlRow>
                </ControlsGrid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={
                      saving ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <Save />
                      )
                    }
                    disabled={saving}
                    onClick={() =>
                      void handleSaveSelectedItem()
                    }
                  >
                    Save Changes
                  </Button>

                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlined />}
                    disabled={saving}
                    onClick={() =>
                      void handleRemoveSelectedItem()
                    }
                  >
                    Remove Item
                  </Button>
                </Stack>
              </PanelCard>
            )}
          </Box>

          <PanelCard>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>
              My Inventory
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Equip items purchased from the ShellQuest Shop.
            </Typography>

            {inventory.length === 0 ? (
              <Alert severity="info" sx={{ mt: 3 }}>
                Your inventory is empty. Visit the Shop to buy
                decorations.
              </Alert>
            ) : (
              <InventoryGrid>
                {inventory.map((item) => {
                  const equipped = isEquipped(
                    item.shopItemId,
                  );
                  const busy =
                    busyShopItemId === item.shopItemId;

                  return (
                    <InventoryCard
                      key={item.userInventoryItemId}
                      equipped={equipped}
                    >
                      <InventoryImage
                        src={getAssetUrl(
                          item.thumbnailUrl ??
                            item.assetUrl,
                        )}
                        alt={item.name}
                      />

                      <Typography
                        sx={{ mt: 1.5, fontWeight: 900 }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.category}
                      </Typography>

                      <InventoryAction
                        variant={
                          equipped
                            ? "outlined"
                            : "contained"
                        }
                        color={
                          equipped ? "error" : "primary"
                        }
                        disabled={busy || avatarLoading}
                        startIcon={
                          busy ? (
                            <CircularProgress
                              size={17}
                              color="inherit"
                            />
                          ) : equipped ? (
                            <DeleteOutlined />
                          ) : (
                            <CheckCircle />
                          )
                        }
                        onClick={() =>
                          void handleInventoryAction(item)
                        }
                      >
                        {equipped ? "Remove" : "Equip"}
                      </InventoryAction>
                    </InventoryCard>
                  );
                })}
              </InventoryGrid>
            )}

            <Button
              href="/shop"
              variant="text"
              sx={{ mt: 3 }}
            >
              Visit Shop
            </Button>
          </PanelCard>
        </StudioGrid>
      )}

      <Snackbar
        open={successMessage !== null}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </PageContainer>
  );
}