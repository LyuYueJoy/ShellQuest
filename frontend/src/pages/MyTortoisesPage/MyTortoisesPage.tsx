import AddRounded from "@mui/icons-material/AddRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Chip,
  Skeleton,
  Typography,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTortoises, deleteTortoise } from "../../services/tortoiseService";
import { getAvatar } from "../../services/avatarService";
import type { TortoiseAvatar } from "../../types/avatar";
import type { TortoiseResponse } from "../../types/tortoise";
import DeleteTortoiseDialog from "../../components/DeleteTortoiseDialog/DeleteTortoiseDialog";
import {
  AddButton,
  BottomDecoration,
  CardActionButton,
  CardButtons,
  CardsGrid,
  DetailsRow,
  EmptyStateCard,
  EmptyStateIcon,
  Header,
  HeaderChip,
  HeaderContent,
  PageContainer,
  PageRoot,
  PhotoFrame,
  PhotoLabel,
  PhotoPlaceholder,
  PlaceholderIcon,
  TopDecoration,
  TortoiseCardRoot,
  TortoiseImage,
  AvatarAsset,
  WeightChip,
  DeleteActionButton,
  AvatarPreviewStage,
} from "./MyTortoisesPage.styles";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace(
  /\/$/,
  "",
);

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

function formatAge(ageMonths: number | null): string {
  if (ageMonths === null) {
    return "Age not recorded";
  }

  if (ageMonths < 12) {
    return `${ageMonths} ${
      ageMonths === 1 ? "month" : "months"
    } old`;
  }

  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) {
    return `${years} ${
      years === 1 ? "year" : "years"
    } old`;
  }

  return `${years}y ${months}m old`;
}

function formatWeight(weightGrams: number | null): string {
  if (weightGrams === null) {
    return "Weight not recorded";
  }

  return `${weightGrams.toLocaleString()} g`;
}

interface TortoiseCardProps {
  tortoise: TortoiseResponse;
  avatar: TortoiseAvatar | null;
  onDelete: (tortoise: TortoiseResponse) => void;
}

function TortoiseCard({
  tortoise,
  avatar,
  onDelete,
}: TortoiseCardProps) {
  const navigate = useNavigate();
  const photoUrl = getPhotoUrl(tortoise.photoUrl);

  return (
    <TortoiseCardRoot>
    <PhotoFrame>
      {photoUrl ? (
        <AvatarPreviewStage>
          <TortoiseImage
            src={photoUrl}
            alt={`${tortoise.name} the tortoise`}
          />

          {avatar?.equippedItems
            .slice()
            .sort(
              (firstItem, secondItem) =>
                firstItem.zIndex - secondItem.zIndex,
            )
            .map((item) => (
              <AvatarAsset
                key={item.avatarEquippedItemId}
                src={getAssetUrl(item.assetUrl)}
                alt=""
                aria-hidden="true"
                style={{
                  left: `${item.x * 100}%`,
                  top: `${item.y * 100}%`,
                  width: `${item.scale * 40}%`,
                  zIndex: item.zIndex,
                  transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                }}
              />
            ))}
        </AvatarPreviewStage>
      ) : (
        <PhotoPlaceholder>
          <PlaceholderIcon>
            <PetsRounded sx={{ fontSize: 46 }} />
          </PlaceholderIcon>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 700 }}
          >
            Add a photo
          </Typography>
        </PhotoPlaceholder>
      )}

      <PhotoLabel
        label="ShellQuest Friend"
        size="small"
      />
    </PhotoFrame>

      <CardContent
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          px: 2.5,
          pt: 2.25,
          pb: 1,
        }}
      >
        <Typography
          component="h2"
          variant="h5"
          color="primary.dark"
          sx={{ overflowWrap: "anywhere" }}
        >
          {tortoise.name}
        </Typography>

        <DetailsRow>
          <Chip
            label={formatAge(tortoise.ageMonths)}
            size="small"
          />

          <WeightChip
            label={formatWeight(tortoise.weightGrams)}
            size="small"
          />
        </DetailsRow>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 2,
            minHeight: "2.8em",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {tortoise.notes?.trim() ||
            "No care notes yet. Add their favourite things."}
        </Typography>
      </CardContent>

      <CardButtons>
        <CardActionButton
          variant="contained"
          size="small"
          startIcon={<VisibilityRounded />}
          onClick={() =>
            navigate(`/tortoises/${tortoise.tortoiseId}`)
          }
        >
          View
        </CardActionButton>

        <CardActionButton
          variant="outlined"
          size="small"
          startIcon={<EditRounded />}
          onClick={() =>
            navigate(
              `/tortoises/${tortoise.tortoiseId}/edit`,
            )
          }
        >
          Edit
        </CardActionButton>

        <Tooltip title={`Delete ${tortoise.name}`}>
            <DeleteActionButton
                aria-label={`Delete ${tortoise.name}`}
                onClick={() => onDelete(tortoise)}
            >
                <DeleteOutlineRounded />
            </DeleteActionButton>
            </Tooltip>
      </CardButtons>
    </TortoiseCardRoot>
  );
}

function LoadingState() {
  return (
    <CardsGrid aria-label="Loading tortoises">
      {[1, 2, 3].map((item) => (
        <TortoiseCardRoot key={item}>
          <Skeleton
            variant="rounded"
            height={210}
            sx={{ m: 2, mb: 0, borderRadius: 6 }}
          />

          <Box sx={{ p: 2.5 }}>
            <Skeleton width="55%" height={38} />
            <Skeleton width="80%" />
            <Skeleton width="65%" />
          </Box>
        </TortoiseCardRoot>
      ))}
    </CardsGrid>
  );
}

export default function MyTortoisesPage() {
  const navigate = useNavigate();

  const [tortoises, setTortoises] = useState<
    TortoiseResponse[]
  >([]);
  const [avatarsByTortoiseId, setAvatarsByTortoiseId] =
    useState<Record<number, TortoiseAvatar | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const loadTortoises = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getTortoises();
      setTortoises(result);

      void Promise.all(
        result.map(async (tortoise) => {
          try {
            const avatar = await getAvatar(
              tortoise.tortoiseId,
            );
            return [tortoise.tortoiseId, avatar] as const;
          } catch {
            return [tortoise.tortoiseId, null] as const;
          }
        }),
      ).then((avatarEntries) => {
        setAvatarsByTortoiseId(
          Object.fromEntries(avatarEntries),
        );
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not load your tortoises.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [selectedTortoise, setSelectedTortoise] =
  useState<TortoiseResponse | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [deleteError, setDeleteError] = useState<
    string | null
    >(null);

    const [successMessage, setSuccessMessage] = useState<
    string | null
    >(null);

  useEffect(() => {
    void loadTortoises();
  }, [loadTortoises]);
  function openDeleteDialog(tortoise: TortoiseResponse) {
  setSelectedTortoise(tortoise);
  setDeleteError(null);
}

function closeDeleteDialog() {
    if (isDeleting) {
        return;
    }

    setSelectedTortoise(null);
    setDeleteError(null);
    }

    async function confirmDelete() {
    if (!selectedTortoise) {
        return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
        await deleteTortoise(selectedTortoise.tortoiseId);

        setTortoises((currentTortoises) =>
        currentTortoises.filter(
            (tortoise) =>
            tortoise.tortoiseId !==
            selectedTortoise.tortoiseId,
        ),
        );

        setAvatarsByTortoiseId((currentAvatars) => {
          const nextAvatars = { ...currentAvatars };
          delete nextAvatars[selectedTortoise.tortoiseId];
          return nextAvatars;
        });

        setSuccessMessage(
        `${selectedTortoise.name} was deleted.`,
        );
        setSelectedTortoise(null);
    } catch (error) {
        setDeleteError(
        error instanceof Error
            ? error.message
            : "This tortoise could not be deleted.",
        );
    } finally {
        setIsDeleting(false);
    }
    }
  return (
    <PageRoot>
      <TopDecoration aria-hidden="true" />
      <BottomDecoration aria-hidden="true" />

      <PageContainer maxWidth="xl">
        <Header>
          <HeaderContent>
            <HeaderChip
              icon={<PetsRounded />}
              label="Your little shell family"
            />

            <Typography
              component="h1"
              variant="h3"
              color="primary.dark"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              My Tortoises
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ maxWidth: 620, mt: 1 }}
            >
              Keep every shell, story and care detail together
              in one cosy place.
            </Typography>
          </HeaderContent>

          <AddButton
            variant="contained"
            size="large"
            startIcon={<AddRounded />}
            onClick={() => navigate("/tortoises/new")}
          >
            Add a tortoise
          </AddButton>
        </Header>

        {isLoading && <LoadingState />}

        {!isLoading && errorMessage && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                startIcon={<RefreshRounded />}
                onClick={() => void loadTortoises()}
              >
                Try again
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {!isLoading &&
          !errorMessage &&
          tortoises.length === 0 && (
            <EmptyStateCard>
              <EmptyStateIcon>
                <PetsRounded sx={{ fontSize: 58 }} />
              </EmptyStateIcon>

              <Typography
                component="h2"
                variant="h4"
                color="primary.dark"
              >
                Your shell family starts here
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  maxWidth: 480,
                  mx: "auto",
                  mt: 1.5,
                }}
              >
                Add your first tortoise to record their age,
                weight, photos and care notes.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddRounded />}
                onClick={() => navigate("/tortoises/new")}
                sx={{ mt: 3 }}
              >
                Add my first tortoise
              </Button>
            </EmptyStateCard>
          )}

        {!isLoading &&
          !errorMessage &&
          tortoises.length > 0 && (
            <>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 2,
                    fontWeight: 800,
                }}
              >
                {tortoises.length}{" "}
                {tortoises.length === 1
                  ? "tortoise"
                  : "tortoises"}{" "}
                in your family
              </Typography>

              <CardsGrid>
                {tortoises.map((tortoise) => (
                  <TortoiseCard
                    key={tortoise.tortoiseId}
                    tortoise={tortoise}
                    avatar={
                      avatarsByTortoiseId[
                        tortoise.tortoiseId
                      ] ?? null
                    }
                    onDelete={openDeleteDialog}
                  />
                ))}
              </CardsGrid>
            </>
          )}
      </PageContainer>

      <DeleteTortoiseDialog
        open={selectedTortoise !== null}
        tortoiseName={selectedTortoise?.name ?? ""}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onClose={closeDeleteDialog}
        onConfirm={() => void confirmDelete()}
        />

        <Snackbar
        open={successMessage !== null}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        >
        <Alert
            severity="success"
            variant="filled"
            onClose={() => setSuccessMessage(null)}
        >
            {successMessage}
        </Alert>
        </Snackbar>
    </PageRoot>
  );
}