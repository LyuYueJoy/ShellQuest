import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import EditRounded from "@mui/icons-material/EditRounded";
import MonitorWeightRounded from "@mui/icons-material/MonitorWeightRounded";
import NotesRounded from "@mui/icons-material/NotesRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import {
  Alert,
  Button,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getTortoiseById } from "../../services/tortoiseService";
import type { TortoiseResponse } from "../../types/tortoise";

import {
  Decoration,
  DetailGrid,
  DetailsCard,
  ErrorCard,
  Header,
  InformationGrid,
  InformationItem,
  NotesSection,
  PageContainer,
  PageRoot,
  PhotoCard,
  PhotoFrame,
  PhotoPlaceholder,
  TortoiseImage,
} from "./TortoiseDetailPage.styles";

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
    return "Not recorded";
  }

  if (ageMonths < 12) {
    return `${ageMonths} ${
      ageMonths === 1 ? "month" : "months"
    }`;
  }

  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;

  if (months === 0) {
    return `${years} ${
      years === 1 ? "year" : "years"
    }`;
  }

  return `${years}y ${months}m`;
}

function formatCreatedDate(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function LoadingState() {
  return (
    <DetailGrid aria-label="Loading tortoise details">
      <PhotoCard>
        <Skeleton
          variant="rounded"
          height={360}
          sx={{ borderRadius: 6 }}
        />
      </PhotoCard>

      <DetailsCard>
        <Skeleton width="55%" height={55} />
        <Skeleton width="32%" height={30} />

        <InformationGrid>
          <Skeleton
            variant="rounded"
            height={100}
            sx={{ borderRadius: 5 }}
          />
          <Skeleton
            variant="rounded"
            height={100}
            sx={{ borderRadius: 5 }}
          />
        </InformationGrid>

        <Skeleton
          variant="rounded"
          height={150}
          sx={{ mt: 3, borderRadius: 5 }}
        />
      </DetailsCard>
    </DetailGrid>
  );
}

export default function TortoiseDetailPage() {
  const navigate = useNavigate();
  const { tortoiseId } = useParams();

  const [tortoise, setTortoise] =
    useState<TortoiseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const numericTortoiseId = Number(tortoiseId);

  const loadTortoise = useCallback(async () => {
    if (
      !Number.isInteger(numericTortoiseId) ||
      numericTortoiseId <= 0
    ) {
      setErrorMessage("This tortoise address is invalid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getTortoiseById(
        numericTortoiseId,
      );

      setTortoise(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not load this tortoise.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [numericTortoiseId]);

  useEffect(() => {
    void loadTortoise();
  }, [loadTortoise]);

  const photoUrl = tortoise
    ? getPhotoUrl(tortoise.photoUrl)
    : null;

  return (
    <PageRoot>
      <Decoration aria-hidden="true" />

      <PageContainer maxWidth="lg">
        <Header>
          <Button
            variant="text"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/tortoises")}
          >
            Back to my tortoises
          </Button>

          {tortoise && (
            <Button
              variant="contained"
              startIcon={<EditRounded />}
              onClick={() =>
                navigate(
                  `/tortoises/${tortoise.tortoiseId}/edit`,
                )
              }
            >
              Edit details
            </Button>
          )}
        </Header>

        {isLoading && <LoadingState />}

        {!isLoading && errorMessage && (
          <ErrorCard>
            <Alert severity="error" sx={{ textAlign: "left" }}>
              {errorMessage}
            </Alert>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<RefreshRounded />}
                onClick={() => void loadTortoise()}
              >
                Try again
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/tortoises")}
              >
                Return to list
              </Button>
            </Stack>
          </ErrorCard>
        )}

        {!isLoading && !errorMessage && tortoise && (
          <DetailGrid>
            <PhotoCard>
              <PhotoFrame>
                {photoUrl ? (
                  <TortoiseImage
                    src={photoUrl}
                    alt={`${tortoise.name} the tortoise`}
                  />
                ) : (
                  <PhotoPlaceholder>
                    <PetsRounded sx={{ fontSize: 82 }} />

                    <Typography
                      color="text.secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      No photo has been added yet
                    </Typography>
                  </PhotoPlaceholder>
                )}
              </PhotoFrame>
            </PhotoCard>

            <DetailsCard>
              <Chip
                icon={<PetsRounded />}
                label="ShellQuest Friend"
                sx={{ mb: 2 }}
              />

              <Typography
                component="h1"
                variant="h3"
                color="primary.dark"
                sx={{
                  overflowWrap: "anywhere",
                  fontSize: {
                    xs: "2.2rem",
                    sm: "3rem",
                  },
                }}
              >
                {tortoise.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Joined your ShellQuest family on{" "}
                {formatCreatedDate(tortoise.createdAt)}
              </Typography>

              <InformationGrid>
                <InformationItem>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <CalendarMonthRounded color="primary" />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 800 }}
                    >
                      Age
                    </Typography>
                  </Stack>

                  <Typography variant="h6">
                    {formatAge(tortoise.ageMonths)}
                  </Typography>
                </InformationItem>

                <InformationItem>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <MonitorWeightRounded color="secondary" />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 800 }}
                    >
                      Weight
                    </Typography>
                  </Stack>

                  <Typography variant="h6">
                    {tortoise.weightGrams === null
                      ? "Not recorded"
                      : `${tortoise.weightGrams.toLocaleString()} g`}
                  </Typography>
                </InformationItem>
              </InformationGrid>

              <NotesSection>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <NotesRounded color="secondary" />

                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary.dark"
                  >
                    Care notes
                  </Typography>
                </Stack>

                <Typography
                  color="text.secondary"
                  sx={{
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {tortoise.notes?.trim() ||
                    "No care notes have been added yet."}
                </Typography>
              </NotesSection>
            </DetailsCard>
          </DetailGrid>
        )}
      </PageContainer>
    </PageRoot>
  );
}