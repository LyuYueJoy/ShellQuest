import { Outlet, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

import {
  DialogButton,
  DialogIcon,
  ForumButton,
  LoginRequiredDialog,
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from "./ProtectedRoute.styles";

export default function ProtectedRoute() {
  const navigate = useNavigate();

  const isLoggedIn =
    sessionStorage.getItem("shellQuestToken") !== null;

  if (isLoggedIn) {
    return <Outlet />;
  }

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToForum = () => {
    navigate("/forum", { replace: true });
  };

  return (
    <LoginRequiredDialog
      open
      onClose={goToForum}
      aria-labelledby="login-required-title"
      aria-describedby="login-required-description"
    >
      <DialogIcon aria-hidden="true">
        🐢
      </DialogIcon>

      <StyledDialogTitle id="login-required-title">
        Join the ShellQuest
      </StyledDialogTitle>

      <StyledDialogContent>
        <Typography id="login-required-description">
          You need an account to access this feature. Log in
          to continue, or create a free ShellQuest account.
        </Typography>
      </StyledDialogContent>

      <StyledDialogActions>
        <DialogButton
          type="button"
          variant="outlined"
          color="primary"
          onClick={goToLogin}
        >
          Log in
        </DialogButton>

        <DialogButton
          type="button"
          variant="contained"
          color="primary"
          onClick={goToRegister}
        >
          Register
        </DialogButton>

        <ForumButton
          type="button"
          variant="text"
          onClick={goToForum}
        >
          Continue browsing the Forum
        </ForumButton>
      </StyledDialogActions>
    </LoginRequiredDialog>
  );
}