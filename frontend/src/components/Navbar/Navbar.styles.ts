import { alpha, styled } from "@mui/material/styles";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  ListItemButton,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

export const clayShadow = `
  10px 12px 24px rgba(78, 69, 48, 0.18),
  -6px -6px 16px rgba(255, 255, 255, 0.55),
  inset 3px 3px 5px rgba(255, 255, 255, 0.5),
  inset -4px -4px 8px rgba(69, 75, 55, 0.1)
`;

const clayPressedShadow = `
  inset 5px 5px 10px rgba(53, 74, 56, 0.22),
  inset -4px -4px 9px rgba(255, 255, 255, 0.4)
`;

export const NavbarContainer = styled(AppBar)(({ theme }) => ({
  position: "sticky",
  top: 16,
  width: "calc(100% - 32px)",
  maxWidth: 1500,
  margin: "16px auto 0",
  color: theme.palette.text.primary,
  backgroundColor: "#F3EEDC",
  backgroundImage: "none",
  borderRadius: 28,
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: clayShadow,
}));

export const NavbarToolbar = styled(Toolbar)({
  minHeight: 72,
});

export const BrandLink = styled(Link)({
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#354A38",
  textDecoration: "none",
  marginRight: 32,
});

export const BrandText = styled(Typography)({
  fontWeight: 900,
  whiteSpace: "nowrap",
});

export const DesktopNavigation = styled(Box)(({ theme }) => ({
  display: "none",
  alignItems: "center",
  gap: 6,
  flexGrow: 1,

  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

interface NavigationLinkProps {
  active?: boolean;
}

export const NavigationLink = styled(Link, {
  shouldForwardProp: (property) => property !== "active",
})<NavigationLinkProps>(({ active }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "8px 15px",
  color: active ? "#FFFFFF" : "#4F5F4E",
  backgroundColor: active ? "#58745A" : "transparent",
  borderRadius: 999,
  fontSize: "0.875rem",
  fontWeight: 800,
  textDecoration: "none",
  whiteSpace: "nowrap",
  boxShadow: active
    ? `
        5px 6px 12px rgba(53, 74, 56, 0.25),
        inset 2px 2px 4px rgba(255, 255, 255, 0.28),
        inset -3px -3px 5px rgba(38, 55, 40, 0.22)
      `
    : "none",
  transition:
    "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",

  "&:hover": {
    color: active ? "#FFFFFF" : "#354A38",
    backgroundColor: active
      ? "#617E62"
      : "rgba(169, 194, 155, 0.32)",
    transform: "translateY(-2px)",
  },

  "&:active": {
    transform: "translateY(1px) scale(0.97)",
    boxShadow: clayPressedShadow,
  },
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  display: "none",
  width: 42,
  height: 42,
  color: "#354A38",
  backgroundColor: "#D7B85C",
  fontWeight: 900,
  boxShadow: `
    5px 6px 12px rgba(78, 69, 48, 0.18),
    inset 2px 2px 4px rgba(255, 255, 255, 0.45),
    inset -3px -3px 6px rgba(93, 72, 36, 0.18)
  `,

  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

export const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  marginLeft: "auto",
  color: "#354A38",
  backgroundColor: "#A9C29B",

  [theme.breakpoints.up("md")]: {
    display: "none",
  },
}));

export const DrawerContent = styled(Box)({
  width: 280,
  minHeight: "100%",
  paddingTop: 20,
  backgroundColor: "#E8E2CE",
});

export const DrawerTitle = styled(Typography)({
  padding: "0 20px 16px",
  color: "#354A38",
  fontWeight: 900,
});

export const DrawerNavigationItem = styled(ListItemButton)(
  ({ theme }) => ({
    margin: "4px 10px",
    borderRadius: 18,
    color: "#4F5F4E",

    "&.Mui-selected": {
      color: "#FFFFFF",
      backgroundColor: "#58745A",
      boxShadow: `
        5px 6px 12px rgba(53, 74, 56, 0.2),
        inset 2px 2px 4px rgba(255, 255, 255, 0.25),
        inset -3px -3px 5px rgba(38, 55, 40, 0.2)
      `,
    },

    "&.Mui-selected:hover": {
      backgroundColor: "#617E62",
    },

    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.35),
    },

    "&:active": {
      boxShadow: clayPressedShadow,
    },
  }),
);
export const AuthenticationActions = styled(Box)(
  ({ theme }) => ({
    display: "none",
    alignItems: "center",
    gap: theme.spacing(1),

    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  }),
);

export const LoginActionLink = styled(Link)(
  ({ theme }) => ({
    minHeight: 42,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 18px",
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 999,
    fontWeight: 800,
    textDecoration: "none",
    transition:
      "transform 180ms ease, background-color 180ms ease",

    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      transform: "translateY(-2px)",
    },

    "&:active": {
      transform: "translateY(1px) scale(0.97)",
      boxShadow: clayPressedShadow,
    },

    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.light}`,
      outlineOffset: 3,
    },
  }),
);

export const RegisterActionLink = styled(Link)(
  ({ theme }) => ({
    minHeight: 42,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 18px",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 999,
    fontWeight: 800,
    textDecoration: "none",
    boxShadow: `
      5px 6px 12px rgba(53, 74, 56, 0.22),
      inset 2px 2px 4px rgba(255, 255, 255, 0.25)
    `,
    transition:
      "transform 180ms ease, background-color 180ms ease",

    "&:hover": {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.dark,
      transform: "translateY(-2px)",
    },

    "&:active": {
      transform: "translateY(1px) scale(0.97)",
      boxShadow: clayPressedShadow,
    },

    "&:focus-visible": {
      outline: `3px solid ${theme.palette.primary.light}`,
      outlineOffset: 3,
    },
  }),
);

export const LogoutActionButton = styled(Button)(
  ({ theme }) => ({
    minHeight: 42,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,

    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
);

export const DrawerAuthenticationActions = styled(Box)(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),

    "& a, & button": {
      width: "100%",
    },
  }),
);