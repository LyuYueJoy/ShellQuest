import { alpha, styled } from "@mui/material/styles";
import {
  Button,
  Card,
  LinearProgress,
} from "@mui/material";

export const PageContainer = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 1400,
  margin: "0 auto",
  padding: theme.spacing(4),

  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(3),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const HeaderCard = styled(Card)(({ theme }) => ({
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
    width: 220,
    height: 220,
    top: -100,
    right: -50,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.common.white,
      0.1,
    ),
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const HeaderContent = styled("div")({
  position: "relative",
  zIndex: 1,
  maxWidth: 680,
});

export const SummaryGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.spacing(2.5),
  marginTop: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const SummaryCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
}));

export const SummaryHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

export const ProgressBar = styled(LinearProgress)(
  ({ theme }) => ({
    height: 14,
    marginTop: theme.spacing(1.5),
    borderRadius: 999,
    backgroundColor: alpha(
      theme.palette.primary.main,
      0.15,
    ),

    "& .MuiLinearProgress-bar": {
      borderRadius: 999,
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

export const FilterCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  marginTop: theme.spacing(3),
}));

export const FilterGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const TaskGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: theme.spacing(2.5),
  marginTop: theme.spacing(3),
}));

export const TaskCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: 260,
  padding: theme.spacing(2.5),
}));

export const TaskCardHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const TaskIcon = styled("div")(({ theme }) => ({
  display: "grid",
  placeItems: "center",
  width: 58,
  height: 58,
  marginBottom: theme.spacing(2),
  borderRadius: 20,
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.primary.light,
  boxShadow: `
    inset 3px 3px 5px ${alpha(
      theme.palette.common.white,
      0.5
    )},
    inset -3px -3px 7px ${alpha(
      theme.palette.primary.dark,
      0.16
    )}
  `,

  "& svg": {
    fontSize: 32,
  },
}));

export const RewardRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginTop: "auto",
  marginBottom: theme.spacing(2),
  paddingTop: theme.spacing(2),
}));

export const RewardBadge = styled("span")(({ theme }) => ({
  padding: theme.spacing(0.6, 1.2),
  borderRadius: 999,
  color: theme.palette.primary.dark,
  fontSize: "0.8rem",
  fontWeight: 900,
  backgroundColor: alpha(
    theme.palette.primary.light,
    0.5,
  ),
}));

export const CompleteButton = styled(Button)({
  width: "100%",
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