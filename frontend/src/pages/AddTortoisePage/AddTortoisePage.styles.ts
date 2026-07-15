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
  right: -100,
  bottom: 30,
  width: 280,
  height: 280,
  borderRadius: "48% 52% 38% 62%",
  backgroundColor: alpha(theme.palette.primary.light, 0.2),
  transform: "rotate(18deg)",
  pointerEvents: "none",
}));

export const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const FormGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(3),

  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, 0.75fr)",
    alignItems: "start",
  },
}));

export const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export const FieldsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(2.5),

  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
}));

export const FullWidthField = styled(Box)({
  gridColumn: "1 / -1",
});

export const PreviewCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",

  [theme.breakpoints.up("md")]: {
    position: "sticky",
    top: theme.spacing(3),
  },
}));

export const PreviewFrame = styled(Box)(({ theme }) => ({
  display: "grid",
  minHeight: 280,
  marginTop: theme.spacing(2),
  placeItems: "center",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.main,
  background: `
    radial-gradient(
      circle at 30% 20%,
      ${alpha(theme.palette.common.white, 0.55)},
      transparent 35%
    ),
    linear-gradient(
      145deg,
      ${alpha(theme.palette.primary.light, 0.55)},
      ${alpha(theme.palette.primary.main, 0.2)}
    )
  `,
  boxShadow: `
    inset 6px 6px 12px ${alpha(
      theme.palette.primary.dark,
      0.12
    )},
    inset -6px -6px 12px ${alpha(
      theme.palette.common.white,
      0.38
    )}
  `,
}));

export const PreviewImage = styled("img")({
  display: "block",
  width: "100%",
  height: 280,
  objectFit: "contain",
  padding: 12,
});

export const PreviewPlaceholder = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(3),
}));

export const FileInformation = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  overflowWrap: "anywhere",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
}));

export const FormActions = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column-reverse",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
}));

export const VisuallyHiddenInput = styled("input")({
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
});