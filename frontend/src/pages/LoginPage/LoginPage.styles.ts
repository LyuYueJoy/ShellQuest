import { Box, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

export const LoginPageContainer = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 80px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const LoginCard = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 480,
  padding: theme.spacing(5),
  borderRadius: 32,

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    borderRadius: 24,
  },
}));

export const LoginHeader = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(4),
}));

export const TortoiseIconContainer = styled(Box)(({ theme }) => ({
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
}));

export const LoginForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  minHeight: 50,
  marginTop: theme.spacing(1),
}));

export const RegisterPrompt = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const RegisterLink = styled(Link)(({ theme }) => ({
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