import {
  ArrowBackRounded,
  CloudUploadRounded,
  ImageRounded,
  PetsRounded,
  SaveRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTortoiseById,
  updateTortoise,
  uploadTortoisePhoto,
} from "../../services/tortoiseService";
import type { TortoiseResponse } from "../../types/tortoise";

import {
  Decoration,
  FieldsGrid,
  FileInformation,
  FormActions,
  FormCard,
  FormGrid,
  FullWidthField,
  Header,
  PageContainer,
  PageRoot,
  PreviewCard,
  PreviewFrame,
  PreviewImage,
  PreviewPlaceholder,
  VisuallyHiddenInput,
} from "../AddTortoisePage/AddTortoisePage.styles";

const maximumPhotoSize = 5 * 1024 * 1024;

const acceptedPhotoTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace(
  /\/$/,
  "",
);

interface FormErrors {
  name?: string;
  ageMonths?: string;
  weightGrams?: string;
  photo?: string;
}

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

export default function EditTortoisePage() {
  const navigate = useNavigate();
  const { tortoiseId } = useParams();

  const numericTortoiseId = Number(tortoiseId);

  const [tortoise, setTortoise] =
    useState<TortoiseResponse | null>(null);

  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightGrams, setWeightGrams] = useState("");
  const [notes, setNotes] = useState("");

  const [newPhoto, setNewPhoto] = useState<File | null>(
    null,
  );
  const [newPhotoPreviewUrl, setNewPhotoPreviewUrl] =
    useState<string | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loadError, setLoadError] = useState<string | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<
    string | null
  >(null);
  const [photoUploadWarning, setPhotoUploadWarning] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTortoise = useCallback(async () => {
    if (
      !Number.isInteger(numericTortoiseId) ||
      numericTortoiseId <= 0
    ) {
      setLoadError("This tortoise address is invalid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const result = await getTortoiseById(
        numericTortoiseId,
      );

      setTortoise(result);
      setName(result.name);
      setAgeMonths(
        result.ageMonths === null
          ? ""
          : String(result.ageMonths),
      );
      setWeightGrams(
        result.weightGrams === null
          ? ""
          : String(result.weightGrams),
      );
      setNotes(result.notes ?? "");
    } catch (error) {
      setLoadError(
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

  useEffect(() => {
    if (!newPhoto) {
      setNewPhotoPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(newPhoto);
    setNewPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [newPhoto]);

  function validateForm(): boolean {
    const nextErrors: FormErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      nextErrors.name = "Please enter your tortoise's name.";
    } else if (trimmedName.length > 100) {
      nextErrors.name =
        "The name must be 100 characters or fewer.";
    }

    if (ageMonths) {
      const age = Number(ageMonths);

      if (!Number.isInteger(age) || age < 0) {
        nextErrors.ageMonths =
          "Age must be a whole number of months.";
      }
    }

    if (weightGrams) {
      const weight = Number(weightGrams);

      if (!Number.isFinite(weight) || weight <= 0) {
        nextErrors.weightGrams =
          "Weight must be greater than zero.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedPhoto = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!selectedPhoto) {
      return;
    }

    if (!acceptedPhotoTypes.includes(selectedPhoto.type)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        photo: "Please select a PNG, JPEG or WebP image.",
      }));
      return;
    }

    if (selectedPhoto.size > maximumPhotoSize) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        photo: "The image must be 5 MB or smaller.",
      }));
      return;
    }

    setNewPhoto(selectedPhoto);
    setErrors((currentErrors) => ({
      ...currentErrors,
      photo: undefined,
    }));
  }

  function removeSelectedPhoto() {
    setNewPhoto(null);
    setErrors((currentErrors) => ({
      ...currentErrors,
      photo: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitError(null);
    setPhotoUploadWarning(null);

    if (!tortoise || !validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedTortoise = await updateTortoise(
        tortoise.tortoiseId,
        {
          name: name.trim(),
          ageMonths: ageMonths ? Number(ageMonths) : null,
          weightGrams: weightGrams
            ? Number(weightGrams)
            : null,
          notes: notes.trim() || null,
        },
      );

      if (newPhoto) {
        try {
          await uploadTortoisePhoto(
            updatedTortoise.tortoiseId,
            newPhoto,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "The photo could not be uploaded.";

          setPhotoUploadWarning(
            `Your details were saved, but the new photo upload failed. ${message}`,
          );
          return;
        }
      }

      navigate(
        `/tortoises/${updatedTortoise.tortoiseId}`,
        { replace: true },
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your changes could not be saved.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const existingPhotoUrl = tortoise
    ? getPhotoUrl(tortoise.photoUrl)
    : null;

  const displayedPhotoUrl =
    newPhotoPreviewUrl ?? existingPhotoUrl;

  if (isLoading) {
    return (
      <PageRoot>
        <PageContainer maxWidth="lg">
          <Skeleton width={220} height={42} />

          <FormGrid sx={{ mt: 3 }}>
            <FormCard>
              <Skeleton width="50%" height={50} />
              <Skeleton
                variant="rounded"
                height={330}
                sx={{ mt: 2, borderRadius: 6 }}
              />
            </FormCard>

            <PreviewCard>
              <Skeleton
                variant="rounded"
                height={280}
                sx={{ borderRadius: 6 }}
              />
            </PreviewCard>
          </FormGrid>
        </PageContainer>
      </PageRoot>
    );
  }

  if (loadError || !tortoise) {
    return (
      <PageRoot>
        <PageContainer maxWidth="md">
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => void loadTortoise()}
              >
                Try again
              </Button>
            }
          >
            {loadError ?? "This tortoise could not be found."}
          </Alert>

          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/tortoises")}
            sx={{ mt: 3 }}
          >
            Back to my tortoises
          </Button>
        </PageContainer>
      </PageRoot>
    );
  }

  return (
    <PageRoot>
      <Decoration aria-hidden="true" />

      <PageContainer maxWidth="lg">
        <Header>
          <Button
            variant="text"
            startIcon={<ArrowBackRounded />}
            onClick={() =>
              navigate(
                `/tortoises/${tortoise.tortoiseId}`,
              )
            }
            sx={{ mb: 2 }}
          >
            Back to details
          </Button>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center" }}
          >
            <PetsRounded
              color="primary"
              sx={{ fontSize: { xs: 36, sm: 44 } }}
            />

            <Box>
              <Typography
                component="h1"
                variant="h3"
                color="primary.dark"
                sx={{
                  fontSize: {
                    xs: "2rem",
                    sm: "2.6rem",
                  },
                }}
              >
                Edit {tortoise.name}
              </Typography>

              <Typography color="text.secondary">
                Update care details or choose a new photo.
              </Typography>
            </Box>
          </Stack>
        </Header>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {photoUploadWarning && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                onClick={() =>
                  navigate(
                    `/tortoises/${tortoise.tortoiseId}`,
                  )
                }
              >
                View tortoise
              </Button>
            }
          >
            {photoUploadWarning}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormGrid>
            <FormCard>
              <Typography
                component="h2"
                variant="h5"
                color="primary.dark"
                sx={{ mb: 3 }}
              >
                Tortoise details
              </Typography>

              <FieldsGrid>
                <FullWidthField>
                  <TextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    error={Boolean(errors.name)}
                    helperText={
                      errors.name ??
                      "What do you call your shell friend?"
                    }
                    slotProps={{
                      htmlInput: {
                        maxLength: 100,
                      },
                    }}
                    onChange={(event) => {
                      setName(event.target.value);

                      if (errors.name) {
                        setErrors((currentErrors) => ({
                          ...currentErrors,
                          name: undefined,
                        }));
                      }
                    }}
                  />
                </FullWidthField>

                <TextField
                  fullWidth
                  type="number"
                  label="Age in months"
                  value={ageMonths}
                  error={Boolean(errors.ageMonths)}
                  helperText={
                    errors.ageMonths ??
                    "You can leave this empty."
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      step: 1,
                    },
                  }}
                  onChange={(event) =>
                    setAgeMonths(event.target.value)
                  }
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Weight in grams"
                  value={weightGrams}
                  error={Boolean(errors.weightGrams)}
                  helperText={
                    errors.weightGrams ??
                    "Enter their latest weight."
                  }
                  slotProps={{
                    htmlInput: {
                      min: 0.1,
                      step: 0.1,
                    },
                  }}
                  onChange={(event) =>
                    setWeightGrams(event.target.value)
                  }
                />

                <FullWidthField>
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label="Care notes"
                    value={notes}
                    helperText={`${notes.length}/1000 characters`}
                    slotProps={{
                      htmlInput: {
                        maxLength: 1000,
                      },
                    }}
                    onChange={(event) =>
                      setNotes(event.target.value)
                    }
                  />
                </FullWidthField>
              </FieldsGrid>

              <FormActions>
                <Button
                  variant="outlined"
                  disabled={isSubmitting}
                  onClick={() =>
                    navigate(
                      `/tortoises/${tortoise.tortoiseId}`,
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    isSubmitting ||
                    Boolean(photoUploadWarning)
                  }
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress
                        color="inherit"
                        size={20}
                      />
                    ) : (
                      <SaveRounded />
                    )
                  }
                >
                  {isSubmitting
                    ? "Saving..."
                    : "Save changes"}
                </Button>
              </FormActions>
            </FormCard>

            <PreviewCard>
              <Typography
                component="h2"
                variant="h5"
                color="primary.dark"
              >
                Tortoise photo
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Choose a new image only if you want to replace
                the current one.
              </Typography>

              <PreviewFrame>
                {displayedPhotoUrl ? (
                  <PreviewImage
                    src={displayedPhotoUrl}
                    alt={`${tortoise.name} preview`}
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImageRounded sx={{ fontSize: 72 }} />

                    <Typography
                      color="text.secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      No photo has been added
                    </Typography>
                  </PreviewPlaceholder>
                )}
              </PreviewFrame>

              {newPhoto && (
                <FileInformation>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    New photo: {newPhoto.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {(newPhoto.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </FileInformation>
              )}

              {errors.photo && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ mt: 1.5 }}
                >
                  {errors.photo}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  mt: 2.5,
                  justifyContent: "center",
                }}
              >
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadRounded />}
                >
                  {displayedPhotoUrl
                    ? "Replace photo"
                    : "Choose photo"}

                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoChange}
                  />
                </Button>

                {newPhoto && (
                  <Button
                    variant="outlined"
                    onClick={removeSelectedPhoto}
                  >
                    Keep current photo
                  </Button>
                )}
              </Stack>
            </PreviewCard>
          </FormGrid>
        </Box>
      </PageContainer>
    </PageRoot>
  );
}