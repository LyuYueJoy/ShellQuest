import { alpha, styled } from "@mui/material/styles";
import {
  Button,
  Card,
  Tabs,
} from "@mui/material";

export const PageContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1440,
  margin: "0 auto",
  padding: theme.spacing(4),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const HeroCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(4),
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(
    135deg,
    ${theme.palette.primary.dark},
    ${theme.palette.primary.main}
  )`,

  "&::after": {
    content: '""',
    position: "absolute",
    width: 240,
    height: 240,
    top: -110,
    right: -50,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.secondary.light,
      0.22,
    ),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const HeroContent = styled("div")({
  position: "relative",
  zIndex: 1,
});

export const HeroRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
}));

export const CoinBalance = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
  flexShrink: 0,
  padding: theme.spacing(1.5, 2.25),
  borderRadius: 999,
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.secondary.light,
  boxShadow: `
    inset 3px 3px 5px ${alpha(
      theme.palette.common.white,
      0.55
    )},
    6px 8px 16px ${alpha(
      theme.palette.common.black,
      0.15
    )}
  `,
}));

export const ControlsCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 2.5),
}));

export const ShopTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    minHeight: 54,
    fontWeight: 900,
    textTransform: "none",
  },

  "& .MuiTabs-indicator": {
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const FilterRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

export const ProductGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: theme.spacing(2.5),
  marginTop: theme.spacing(3),
}));

export const ProductCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: 440,
  padding: theme.spacing(2),
}));

export const PreviewArea = styled("div")(({ theme }) => ({
  position: "relative",
  display: "grid",
  placeItems: "center",
  width: "100%",
  aspectRatio: "1 / 0.82",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
  borderRadius: 24,
  background: `
    radial-gradient(
      circle at 35% 30%,
      ${alpha(theme.palette.common.white, 0.8)},
      transparent 38%
    ),
    ${alpha(theme.palette.primary.light, 0.3)}
  `,
  boxShadow: `
    inset 4px 4px 9px ${alpha(
      theme.palette.primary.dark,
      0.12
    )},
    inset -4px -4px 9px ${alpha(
      theme.palette.common.white,
      0.5
    )}
  `,
}));

export const ProductImage = styled("img")({
  display: "block",
  width: "82%",
  height: "82%",
  objectFit: "contain",
});

export const AssetFallback = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: 100,
  height: 100,
  borderRadius: 32,
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light,

  "& svg": {
    fontSize: 56,
  },
}));

export const ProductHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
}));

export const ProductDescription = styled("div")(
  ({ theme }) => ({
    flexGrow: 1,
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  }),
);

export const ProductFooter = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: "auto",
  paddingTop: theme.spacing(2),
}));

export const Price = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  color: theme.palette.secondary.main,
  fontWeight: 900,
  fontSize: "1.1rem",
}));

export const BuyButton = styled(Button)({
  minWidth: 118,
});

export const EmptyState = styled(Card)(({ theme }) => ({
  gridColumn: "1 / -1",
  padding: theme.spacing(6, 3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const StatusContainer = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: "65vh",
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const StatusCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 520,
  padding: theme.spacing(4),
}));