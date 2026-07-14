import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

export const RegisterPageContainer = styled("section")(
  ({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2),
    },
  }),
);

export const RegisterCard = styled("article")(
  ({ theme }) => ({
    width: "100%",
    maxWidth: 540,
    padding: theme.spacing(5),
    borderRadius: 32,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(255, 255, 255, 0.35)",
    boxShadow: `
      10px 12px 24px rgba(78, 69, 48, 0.18),
      -6px -6px 16px rgba(255, 255, 255, 0.55),
      inset 3px 3px 5px rgba(255, 255, 255, 0.45),
      inset -4px -4px 8px rgba(69, 75, 55, 0.12)
    `,

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(3),
      borderRadius: 24,
    },
  }),
);

export const RegisterHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: "center",
}));

export const TortoiseIconContainer = styled(Box)(
  ({ theme }) => ({
    width: 76,
    height: 76,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: `0 auto ${theme.spacing(2)}`,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.light,
    fontSize: "2.4rem",
    boxShadow: `
      7px 8px 16px rgba(78, 69, 48, 0.18),
      -5px -5px 12px rgba(255, 255, 255, 0.55),
      inset 2px 2px 4px rgba(255, 255, 255, 0.4)
    `,
  }),
);

export const RegisterForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

export const NameFields = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(2.5),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  minHeight: 50,
  marginTop: theme.spacing(1),
}));

export const LoginPrompt = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const LoginLink = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(0.75),
  color: theme.palette.primary.dark,
  fontWeight: 800,
  textDecoration: "none",
  borderRadius: 4,

  "&:hover": {
    textDecoration: "underline",
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.light}`,
    outlineOffset: 3,
  },
}));