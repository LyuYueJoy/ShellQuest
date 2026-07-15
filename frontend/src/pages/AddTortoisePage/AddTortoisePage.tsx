import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CloudUploadRounded from "@mui/icons-material/CloudUploadRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import PetsRounded from "@mui/icons-material/PetsRounded";
import SaveRounded from "@mui/icons-material/SaveRounded";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  createTortoise,
  uploadTortoisePhoto,
} from "../../services/tortoiseService";

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
} from "./AddTortoisePage.styles";

const maximumPhotoSize = 5 * 1024 * 1024;

const acceptedPhotoTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

interface FormErrors {
  name?: string;
  ageMonths?: string;
  weightGrams?: string;
  photo?: string;
}

export default function AddTortoisePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [weightGrams, setWeightGrams] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<
    string | null
  >(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<
    string | null
  >(null);
  const [photoUploadWarning, setPhotoUploadWarning] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPhotoPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(photo);
    setPhotoPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [photo]);

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

    setPhoto(selectedPhoto);
    setErrors((currentErrors) => ({
      ...currentErrors,
      photo: undefined,
    }));
  }

  function removePhoto() {
    setPhoto(null);
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const createdTortoise = await createTortoise({
        name: name.trim(),
        ageMonths: ageMonths ? Number(ageMonths) : null,
        weightGrams: weightGrams
          ? Number(weightGrams)
          : null,
        notes: notes.trim() || null,
      });

      if (photo) {
        try {
          await uploadTortoisePhoto(
            createdTortoise.tortoiseId,
            photo,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "The photo could not be uploaded.";

          setPhotoUploadWarning(
            `Your tortoise was created, but the photo upload failed. ${message}`,
          );
          return;
        }
      }

      navigate("/tortoises", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your tortoise could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageRoot>
      <Decoration aria-hidden="true" />

      <PageContainer maxWidth="lg">
        <Header>
          <Button
            variant="text"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/tortoises")}
            sx={{ mb: 2 }}
          >
            Back to my tortoises
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
                Add a Tortoise
              </Typography>

              <Typography color="text.secondary">
                Welcome a new shell friend to your family.
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
                onClick={() => navigate("/tortoises")}
              >
                View tortoises
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
                  onClick={() => navigate("/tortoises")}
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
                    : "Save tortoise"}
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
                PNG, JPEG or WebP, up to 5 MB
              </Typography>

              <PreviewFrame>
                {photoPreviewUrl ? (
                  <PreviewImage
                    src={photoPreviewUrl}
                    alt="Selected tortoise preview"
                  />
                ) : (
                  <PreviewPlaceholder>
                    <ImageRounded sx={{ fontSize: 72 }} />

                    <Typography
                      color="text.secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      Your photo preview will appear here
                    </Typography>
                  </PreviewPlaceholder>
                )}
              </PreviewFrame>

              {photo && (
                <FileInformation>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 800 }}
                  >
                    {photo.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {(photo.size / 1024 / 1024).toFixed(2)} MB
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
                  {photo ? "Change photo" : "Choose photo"}

                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoChange}
                  />
                </Button>

                {photo && (
                  <Button
                    variant="outlined"
                    onClick={removePhoto}
                  >
                    Remove
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