import {
  AddRounded,
  EditRounded,
  PetsRounded,
  RefreshRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getTortoises } from "../../services/tortoiseService";
import type { TortoiseResponse } from "../../types/tortoise";

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
  WeightChip,
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

function TortoiseCard({
  tortoise,
}: {
  tortoise: TortoiseResponse;
}) {
  const navigate = useNavigate();
  const photoUrl = getPhotoUrl(tortoise.photoUrl);

  return (
    <TortoiseCardRoot>
      <PhotoFrame>
        {photoUrl ? (
          <TortoiseImage
            src={photoUrl}
            alt={`${tortoise.name} the tortoise`}
          />
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

  useEffect(() => {
    void loadTortoises();
  }, [loadTortoises]);

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
                  />
                ))}
              </CardsGrid>
            </>
          )}
      </PageContainer>
    </PageRoot>
  );
}