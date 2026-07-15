import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser } from "../../services/authService";
import { ApiError } from "../../services/apiClient";
import {
  LoginLink,
  LoginPrompt,
  NameFields,
  RegisterCard,
  RegisterForm,
  RegisterHeader,
  RegisterPageContainer,
  SubmitButton,
  TortoiseIconContainer,
} from "./RegisterPage.styles";

interface RegisterFormValues {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const initialFormValues: RegisterFormValues = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] =
    useState<RegisterFormValues>(initialFormValues);

  const [formErrors, setFormErrors] =
    useState<RegisterFormErrors>({});

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const nextErrors: RegisterFormErrors = {};
    const trimmedUserName = formValues.userName.trim();
    const trimmedEmail = formValues.email.trim();

    if (!trimmedUserName) {
      nextErrors.userName = "Username is required.";
    } else if (trimmedUserName.length > 50) {
      nextErrors.userName =
        "Username must be 50 characters or fewer.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formValues.password) {
      nextErrors.password = "Password is required.";
    } else if (formValues.password.length < 8) {
      nextErrors.password =
        "Password must be at least 8 characters.";
    }

    if (!formValues.confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formValues.confirmPassword !== formValues.password
    ) {
      nextErrors.confirmPassword =
        "The passwords do not match.";
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const fieldName = event.target
      .name as keyof RegisterFormValues;

    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: event.target.value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [fieldName]: undefined,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setApiError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      await registerUser({
        userName: formValues.userName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess: true,
        },
      });
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 409) {
        setApiError(
          "An account with this email already exists.",
        );
      } else if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError(
          "Unable to create your account. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton
        type="button"
        aria-label={
          showPassword ? "Hide passwords" : "Show passwords"
        }
        edge="end"
        onClick={() =>
          setShowPassword((currentValue) => !currentValue)
        }
        disabled={isLoading}
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <RegisterPageContainer>
      <RegisterCard>
        <RegisterHeader>
          <TortoiseIconContainer aria-hidden="true">
            🐢
          </TortoiseIconContainer>

          <Typography component="h1" variant="h4">
            Join ShellQuest
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Create an account and begin your tortoise-care
            adventure.
          </Typography>
        </RegisterHeader>

        <RegisterForm onSubmit={handleSubmit} noValidate>
          {apiError && (
            <Alert severity="error" role="alert">
              {apiError}
            </Alert>
          )}

          <NameFields>
            <TextField
              id="register-username"
              name="userName"
              label="Username"
              value={formValues.userName}
              onChange={handleChange}
              error={Boolean(formErrors.userName)}
              helperText={formErrors.userName}
              autoComplete="username"
              slotProps={{
                htmlInput: {
                    maxLength: 50,
                },
                }}
              disabled={isLoading}
              fullWidth
              required
            />
          </NameFields>

          <TextField
            id="register-email"
            name="email"
            type="email"
            label="Email address"
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            autoComplete="email"
            disabled={isLoading}
            fullWidth
            required
          />

          <TextField
            id="register-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(formErrors.password)}
            helperText={
              formErrors.password ??
              "Use at least 8 characters."
            }
            autoComplete="new-password"
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: passwordAdornment,
              },
            }}
            fullWidth
            required
          />

          <TextField
            id="register-confirm-password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            label="Confirm password"
            value={formValues.confirmPassword}
            onChange={handleChange}
            error={Boolean(formErrors.confirmPassword)}
            helperText={formErrors.confirmPassword}
            autoComplete="new-password"
            disabled={isLoading}
            fullWidth
            required
          />

          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={22}
                  color="inherit"
                  sx={{ mr: 1 }}
                />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </SubmitButton>
        </RegisterForm>

        <LoginPrompt>
          <Typography component="span" variant="body2">
            Already have an account?
          </Typography>

          <LoginLink to="/login">
            Log in
          </LoginLink>
        </LoginPrompt>
      </RegisterCard>
    </RegisterPageContainer>
  );
}