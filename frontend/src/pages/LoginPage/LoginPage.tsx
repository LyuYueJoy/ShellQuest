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
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { loginUser } from "../../services/authService";
import { ApiError } from "../../services/apiClient";
import {
  LoginCard,
  LoginForm,
  LoginHeader,
  LoginPageContainer,
  RegisterLink,
  RegisterPrompt,
  SubmitButton,
  TortoiseIconContainer,
} from "./LoginPage.styles";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const initialFormValues: LoginFormValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] =
    useState<LoginFormValues>(initialFormValues);

  const [formErrors, setFormErrors] =
    useState<LoginFormErrors>({});

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const nextErrors: LoginFormErrors = {};

    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!formValues.email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formValues.password) {
      nextErrors.password = "Password is required.";
    }

    setFormErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleEmailChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      email: event.target.value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      email: undefined,
    }));
  }

  function handlePasswordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      password: event.target.value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
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

      await loginUser({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 401) {
        setApiError("The email or password is incorrect.");
      } else if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Unable to log in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
    <LoginPageContainer>
        <article>
        <LoginCard>
        <LoginHeader>
          <TortoiseIconContainer aria-hidden="true">
            🐢
          </TortoiseIconContainer>

          <Typography component="h1" variant="h4">
            Welcome back
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Log in to continue your ShellQuest adventure.
          </Typography>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit} noValidate>
          {apiError && (
            <Alert severity="error" role="alert">
              {apiError}
            </Alert>
          )}

          <TextField
            id="login-email"
            name="email"
            type="email"
            label="Email address"
            value={formValues.email}
            onChange={handleEmailChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            autoComplete="email"
            disabled={isLoading}
            fullWidth
            required
          />

          <TextField
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formValues.password}
            onChange={handlePasswordChange}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
            autoComplete="current-password"
            disabled={isLoading}
            fullWidth
            required
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      edge="end"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
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
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </SubmitButton>
        </LoginForm>

        <RegisterPrompt>
          <Typography component="span" variant="body2">
            New to ShellQuest?
          </Typography>

          <RegisterLink to="/register">
            Create an account
          </RegisterLink>
        </RegisterPrompt>
      </LoginCard>
        </article>
    </LoginPageContainer>
    </section>
  );
}
