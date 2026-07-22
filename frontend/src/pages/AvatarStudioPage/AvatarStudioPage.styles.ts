import { alpha, styled } from "@mui/material/styles";
import { Button, Card } from "@mui/material";

export const PageContainer = styled("main")(({ theme }) => ({
  width: "100%",
  maxWidth: 1500,
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
    width: 260,
    height: 260,
    top: -130,
    right: -50,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.secondary.light,
      0.22,
    ),
  },
}));

export const HeroContent = styled("div")({
  position: "relative",
  zIndex: 1,
});

export const StudioGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const PanelCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const AvatarCanvas = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 700,
  aspectRatio: "1 / 1",
  margin: `${theme.spacing(3)} auto 0`,
  overflow: "hidden",
  borderRadius: 36,
  background: `linear-gradient(
    145deg,
    ${alpha(theme.palette.primary.light, 0.18)},
    ${alpha(theme.palette.secondary.light, 0.28)}
  )`,
  boxShadow: `
    inset 8px 8px 18px ${alpha(
      theme.palette.common.black,
      0.08
    )},
    inset -8px -8px 18px ${alpha(
      theme.palette.common.white,
      0.65
    )}
  `,
}));

export const TortoisePhoto = styled("img")({
  position: "absolute",
  inset: "8%",
  width: "84%",
  height: "84%",
  objectFit: "contain",
  userSelect: "none",
  pointerEvents: "none",
});

export const EmptyCanvas = styled("div")(({ theme }) => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const EquippedAsset = styled("img", {
  shouldForwardProp: (property) => property !== "selected",
})<{ selected: boolean }>(({ theme, selected }) => ({
  position: "absolute",
  transformOrigin: "center",
  cursor: "pointer",
  userSelect: "none",
  filter: selected
    ? `drop-shadow(0 0 8px ${theme.palette.secondary.main})`
    : "none",
  outline: selected
    ? `3px dashed ${theme.palette.secondary.main}`
    : "none",
  outlineOffset: 4,
}));

export const InventoryGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const InventoryCard = styled(Card, {
  shouldForwardProp: (property) => property !== "equipped",
})<{ equipped: boolean }>(({ theme, equipped }) => ({
  padding: theme.spacing(2),
  border: `2px solid ${
    equipped
      ? theme.palette.primary.main
      : alpha(theme.palette.primary.main, 0.1)
  }`,
  backgroundColor: equipped
    ? alpha(theme.palette.primary.light, 0.12)
    : theme.palette.background.paper,
}));

export const InventoryImage = styled("img")(({ theme }) => ({
  display: "block",
  width: "100%",
  height: 120,
  padding: theme.spacing(1),
  objectFit: "contain",
  borderRadius: 20,
  backgroundColor: alpha(
    theme.palette.primary.light,
    0.12,
  ),
}));

export const InventoryAction = styled(Button)({
  width: "100%",
  marginTop: 12,
});

export const ControlsGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const ControlRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "80px 1fr 58px",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const LoadingArea = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: 320,
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  flexDirection: "column",
}));