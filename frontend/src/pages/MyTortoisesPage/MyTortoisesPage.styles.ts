import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export const PageRoot = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "calc(100vh - 72px)",
  overflow: "hidden",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),

  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(6),
  },
}));

export const PageContainer = styled(Container)({
  position: "relative",
  zIndex: 1,
});

export const TopDecoration = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 60,
  right: -100,
  width: 260,
  height: 260,
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.light, 0.2),
  pointerEvents: "none",
}));

export const BottomDecoration = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 30,
  left: -90,
  width: 220,
  height: 220,
  borderRadius: "45% 55% 58% 42%",
  backgroundColor: alpha(theme.palette.secondary.main, 0.12),
  transform: "rotate(22deg)",
  pointerEvents: "none",
}));

export const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2.5),
  marginBottom: theme.spacing(4),

  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export const HeaderContent = styled(Box)({
  minWidth: 0,
});

export const HeaderChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  color: theme.palette.primary.dark,
}));

export const AddButton = styled(Button)(({ theme }) => ({
  alignSelf: "stretch",
  paddingInline: theme.spacing(3),

  [theme.breakpoints.up("sm")]: {
    alignSelf: "center",
  },
}));

export const CardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(2.5),

  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: theme.spacing(3.5),
  },
}));

export const TortoiseCardRoot = styled(Card)(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  overflow: "hidden",
}));

export const PhotoFrame = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 190,
  margin: theme.spacing(2),
  marginBottom: 0,
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  background: `
    radial-gradient(
      circle at 28% 20%,
      ${alpha(theme.palette.common.white, 0.55)},
      transparent 36%
    ),
    linear-gradient(
      145deg,
      ${alpha(theme.palette.primary.light, 0.6)},
      ${alpha(theme.palette.primary.main, 0.22)}
    )
  `,
  boxShadow: `
    inset 6px 6px 12px ${alpha(
      theme.palette.primary.dark,
      0.12
    )},
    inset -6px -6px 12px ${alpha(
      theme.palette.common.white,
      0.4
    )}
  `,

  [theme.breakpoints.up("sm")]: {
    height: 210,
  },
}));

export const TortoiseImage = styled("img")({
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: 12,
  transition: "transform 240ms ease",

  [`${TortoiseCardRoot}:hover &`]: {
    transform: "translateY(-4px) scale(1.03)",
  },
});

export const PhotoPlaceholder = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
}));

export const PlaceholderIcon = styled(Box)(({ theme }) => ({
  display: "grid",
  width: 92,
  height: 92,
  placeItems: "center",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  boxShadow: theme.shadows[3],
}));

export const PhotoLabel = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1.75),
  left: theme.spacing(1.75),
  color: theme.palette.primary.dark,
}));

export const DetailsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1.5),
}));

export const WeightChip = styled(Chip)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  backgroundColor: alpha(theme.palette.secondary.light, 0.45),
}));

export const CardButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2.5, 2.5),
}));

export const CardActionButton = styled(Button)({
  flexGrow: 1,
});

export const EmptyStateCard = styled(Card)(({ theme }) => ({
  maxWidth: 720,
  marginInline: "auto",
  padding: theme.spacing(5, 3),
  textAlign: "center",

  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(7, 6),
  },
}));

export const EmptyStateIcon = styled(Box)(({ theme }) => ({
  display: "grid",
  width: 112,
  height: 112,
  marginInline: "auto",
  marginBottom: theme.spacing(3),
  placeItems: "center",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.light, 0.45),
  boxShadow: theme.shadows[4],
}));