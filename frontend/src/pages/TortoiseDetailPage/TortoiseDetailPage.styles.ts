import {
  Box,
  Card,
  Container,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export const PageRoot = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "calc(100vh - 72px)",
  overflow: "hidden",
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(6),

  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(5),
  },
}));

export const PageContainer = styled(Container)({
  position: "relative",
  zIndex: 1,
});

export const Decoration = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 100,
  right: -100,
  width: 280,
  height: 280,
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.light, 0.2),
  pointerEvents: "none",
}));

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const DetailGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(3),

  [theme.breakpoints.up("md")]: {
    gridTemplateColumns:
      "minmax(300px, 0.8fr) minmax(0, 1.2fr)",
    alignItems: "start",
  },
}));

export const PhotoCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),

  [theme.breakpoints.up("md")]: {
    position: "sticky",
    top: theme.spacing(3),
  },
}));

export const PhotoFrame = styled(Box)(({ theme }) => ({
  display: "grid",
  minHeight: 360,
  placeItems: "center",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.main,
  background: `
    radial-gradient(
      circle at 28% 18%,
      ${alpha(theme.palette.common.white, 0.55)},
      transparent 36%
    ),
    linear-gradient(
      145deg,
      ${alpha(theme.palette.primary.light, 0.58)},
      ${alpha(theme.palette.primary.main, 0.2)}
    )
  `,
  boxShadow: `
    inset 7px 7px 14px ${alpha(
      theme.palette.primary.dark,
      0.12
    )},
    inset -7px -7px 14px ${alpha(
      theme.palette.common.white,
      0.4
    )}
  `,
}));

export const TortoiseImage = styled("img")({
  display: "block",
  width: "100%",
  height: 360,
  objectFit: "contain",
  padding: 16,
});

export const PhotoPlaceholder = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const DetailsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export const InformationGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
}));

export const InformationItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.25),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.14),
  boxShadow: `
    inset 3px 3px 7px ${alpha(
      theme.palette.primary.dark,
      0.09
    )},
    inset -3px -3px 7px ${alpha(
      theme.palette.common.white,
      0.25
    )}
  `,
}));

export const NotesSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.secondary.light, 0.12),
}));

export const ErrorCard = styled(Card)(({ theme }) => ({
  maxWidth: 720,
  marginInline: "auto",
  padding: theme.spacing(5, 3),
  textAlign: "center",
}));