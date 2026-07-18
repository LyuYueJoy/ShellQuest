import { alpha, styled } from "@mui/material/styles";
import {
  Button,
  Card,
  LinearProgress,
  Typography,
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

  "&::before": {
    content: '""',
    position: "absolute",
    width: 240,
    height: 240,
    top: -110,
    right: -50,
    borderRadius: "50%",
    background: alpha(theme.palette.common.white, 0.1),
  },

  "&::after": {
    content: '""',
    position: "absolute",
    width: 160,
    height: 160,
    right: 130,
    bottom: -100,
    borderRadius: "50%",
    background: alpha(theme.palette.secondary.light, 0.2),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const HeroContent = styled("div")({
  position: "relative",
  zIndex: 1,
  maxWidth: 720,
});

export const HeroLabel = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.8,
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 900,

  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

export const HeroDescription = styled(Typography)({
  maxWidth: 600,
  opacity: 0.86,
});

export const HeroProgressHeader = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  fontWeight: 800,
}));

export const XpProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  boxShadow: `inset 3px 3px 6px ${alpha(
    theme.palette.common.black,
    0.18,
  )}`,

  "& .MuiLinearProgress-bar": {
    borderRadius: 999,
    backgroundColor: theme.palette.secondary.light,
  },
}));

export const SummaryGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: theme.spacing(2.5),
  marginTop: theme.spacing(3),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const StatCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  minHeight: 132,
  padding: theme.spacing(2.5),
}));

export const StatIcon = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: 58,
  height: 58,
  borderRadius: 20,
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light,
  boxShadow: `
    inset 3px 3px 5px ${alpha(
      theme.palette.common.white,
      0.45
    )},
    inset -3px -3px 6px ${alpha(
      theme.palette.primary.dark,
      0.15
    )}
  `,

  "& svg": {
    fontSize: 30,
  },
}));

export const StatValue = styled(Typography)({
  fontWeight: 900,
  lineHeight: 1.1,
});

export const StatLabel = styled(Typography)({
  fontWeight: 700,
});

export const ContentGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.7fr) minmax(300px, 0.8fr)",
  gap: theme.spacing(3),
  marginTop: theme.spacing(3),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const SectionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const SectionHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2.5),

  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
}));

export const SectionTitleGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.25),
}));

export const ProgressPanel = styled("div")(({ theme }) => ({
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.primary.light, 0.3),
  boxShadow: `
    inset 4px 4px 8px ${alpha(
      theme.palette.primary.dark,
      0.1
    )},
    inset -4px -4px 8px ${alpha(
      theme.palette.common.white,
      0.45
    )}
  `,
}));

export const ProgressDetails = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1.25),
}));

export const TodayProgress = styled(LinearProgress)(({ theme }) => ({
  height: 14,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),

  "& .MuiLinearProgress-bar": {
    borderRadius: 999,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const TaskList = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1.5),
}));

export const TaskRow = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 22,
  backgroundColor: alpha(theme.palette.background.default, 0.58),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,

  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const TaskInformation = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  minWidth: 0,
}));

export const TaskIcon = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: 16,
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light,
}));

export const TaskRewards = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

export const CompleteButton = styled(Button)(({ theme }) => ({
  minWidth: 130,

  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const AchievementBody = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  minHeight: 260,
  padding: theme.spacing(3),
  textAlign: "center",
  borderRadius: 26,
  background: `linear-gradient(
    145deg,
    ${alpha(theme.palette.secondary.light, 0.3)},
    ${alpha(theme.palette.background.paper, 0.7)}
  )`,
}));

export const AchievementIcon = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: 88,
  height: 88,
  marginBottom: theme.spacing(2),
  borderRadius: "50%",
  color: theme.palette.secondary.dark,
  backgroundColor: theme.palette.secondary.light,
  boxShadow: `
    7px 8px 16px ${alpha(theme.palette.secondary.dark, 0.18)},
    inset 4px 4px 7px ${alpha(
      theme.palette.common.white,
      0.5
    )}
  `,

  "& svg": {
    fontSize: 48,
  },
}));

export const EmptyState = styled("div")(({ theme }) => ({
  padding: theme.spacing(5, 2),
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