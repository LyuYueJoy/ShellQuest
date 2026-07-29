import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export const PageRoot = styled(Box)(({ theme }) => ({
  position: "relative",
  minHeight: "calc(100vh - 72px)",
  overflow: "hidden",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  background: `
    radial-gradient(
      circle at 10% 15%,
      ${alpha(theme.palette.success.light, 0.22)} 0,
      transparent 32%
    ),
    radial-gradient(
      circle at 90% 10%,
      ${alpha(theme.palette.warning.light, 0.2)} 0,
      transparent 28%
    ),
    linear-gradient(
      145deg,
      ${theme.palette.background.default} 0%,
      ${alpha(theme.palette.success.light, 0.08)} 100%
    )
  `,
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

export const HeaderCard = styled(Card)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  padding: theme.spacing(3.5),
  borderRadius: 32,
  border: `1px solid ${alpha(theme.palette.common.white, 0.55)}`,
  background: `linear-gradient(
    135deg,
    ${alpha(theme.palette.success.light, 0.3)},
    ${alpha(theme.palette.background.paper, 0.92)}
  )`,
  boxShadow: `
    14px 14px 30px ${alpha(theme.palette.common.black, 0.1)},
    -10px -10px 24px ${alpha(theme.palette.common.white, 0.72)}
  `,

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2.5),
    borderRadius: 24,
  },
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(3),

  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
    flexDirection: "column",
  },
}));

export const HeaderText = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const Eyebrow = styled(Chip)(({ theme }) => ({
  alignSelf: "flex-start",
  height: 30,
  borderRadius: 15,
  fontWeight: 800,
  color: theme.palette.success.dark,
  backgroundColor: alpha(theme.palette.success.main, 0.14),
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: theme.palette.text.primary,

  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

export const PageDescription = styled(Typography)(({ theme }) => ({
  maxWidth: 650,
  color: theme.palette.text.secondary,
  lineHeight: 1.7,
}));

export const CreatePostButton = styled(Button)(({ theme }) => ({
  flexShrink: 0,
  minHeight: 48,
  paddingInline: theme.spacing(2.5),
  borderRadius: 18,
  fontWeight: 800,
  textTransform: "none",
  color: theme.palette.common.white,
  background: `linear-gradient(
    135deg,
    ${theme.palette.success.main},
    ${theme.palette.success.dark}
  )`,
  boxShadow: `0 10px 20px ${alpha(
    theme.palette.success.main,
    0.28,
  )}`,

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 14px 24px ${alpha(
      theme.palette.success.main,
      0.34,
    )}`,
  },
}));

export const ForumLayout = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  alignItems: "start",
  gap: theme.spacing(3),

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },
}));

export const PostsColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  gap: theme.spacing(2.5),
}));

export const Sidebar = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 96,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  [theme.breakpoints.down("md")]: {
    position: "static",
    order: -1,
  },
}));

export const SidebarCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 26,
  border: `1px solid ${alpha(theme.palette.common.white, 0.58)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.88),
  boxShadow: `
    10px 10px 24px ${alpha(theme.palette.common.black, 0.08)},
    -8px -8px 20px ${alpha(theme.palette.common.white, 0.65)}
  `,
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  fontWeight: 850,
  color: theme.palette.text.primary,
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 18,
    backgroundColor: alpha(theme.palette.background.paper, 0.82),

    "& fieldset": {
      borderColor: alpha(theme.palette.success.main, 0.2),
    },

    "&:hover fieldset": {
      borderColor: alpha(theme.palette.success.main, 0.4),
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.success.main,
    },
  },
}));

export const PostCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.75),
  borderRadius: 28,
  cursor: "pointer",
  border: `1px solid ${alpha(theme.palette.common.white, 0.6)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: `
    12px 12px 26px ${alpha(theme.palette.common.black, 0.09)},
    -8px -8px 22px ${alpha(theme.palette.common.white, 0.68)}
  `,
  transition:
    "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: alpha(theme.palette.success.main, 0.3),
    boxShadow: `
      16px 18px 32px ${alpha(theme.palette.common.black, 0.12)},
      -8px -8px 22px ${alpha(theme.palette.common.white, 0.7)}
    `,
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    borderRadius: 22,
  },
}));

export const PostHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const AuthorGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  gap: theme.spacing(1.25),
}));

export const AuthorAvatar = styled(Box)(({ theme }) => ({
  display: "grid",
  flexShrink: 0,
  width: 44,
  height: 44,
  placeItems: "center",
  borderRadius: 16,
  fontSize: "1rem",
  fontWeight: 900,
  color: theme.palette.success.dark,
  background: `linear-gradient(
    145deg,
    ${alpha(theme.palette.success.light, 0.55)},
    ${alpha(theme.palette.warning.light, 0.36)}
  )`,
  boxShadow: `inset 2px 2px 5px ${alpha(
    theme.palette.common.white,
    0.64,
  )}`,
}));

export const AuthorName = styled(Typography)(() => ({
  overflow: "hidden",
  fontWeight: 800,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

export const PostDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const PostTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontWeight: 850,
  letterSpacing: "-0.02em",
  color: theme.palette.text.primary,
}));

export const PostContent = styled(Typography)(({ theme }) => ({
  display: "-webkit-box",
  marginTop: theme.spacing(1),
  overflow: "hidden",
  color: theme.palette.text.secondary,
  lineHeight: 1.7,
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
}));

export const PostFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2.5),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.65)}`,
}));

export const PostStats = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(1),
}));

export const StatChip = styled(Chip)(({ theme }) => ({
  height: 32,
  borderRadius: 14,
  fontWeight: 750,
  backgroundColor: alpha(theme.palette.success.main, 0.1),
}));

export const LikeButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "liked",
})<{ liked: boolean }>(({ theme, liked }) => ({
  width: 40,
  height: 40,
  borderRadius: 15,
  color: liked
    ? theme.palette.error.main
    : theme.palette.text.secondary,
  backgroundColor: liked
    ? alpha(theme.palette.error.main, 0.12)
    : alpha(theme.palette.action.hover, 0.75),

  "&:hover": {
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.16),
  },
}));

export const StatusCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 3),
  borderRadius: 28,
  textAlign: "center",
  border: `1px solid ${alpha(theme.palette.common.white, 0.58)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.86),
  boxShadow: `10px 10px 26px ${alpha(
    theme.palette.common.black,
    0.08,
  )}`,
}));

export const StatusIcon = styled(Box)(({ theme }) => ({
  display: "grid",
  width: 72,
  height: 72,
  margin: `0 auto ${theme.spacing(2)}`,
  placeItems: "center",
  borderRadius: 24,
  fontSize: "2rem",
  backgroundColor: alpha(theme.palette.success.main, 0.12),
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.error.main,
}));

export const RetryButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: 14,
  fontWeight: 800,
  textTransform: "none",
}));

export const DetailAuthorRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
}));

export const DetailContent = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
}));

export const DetailActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const RepliesHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

export const RepliesList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export const ReplyCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 20,
  border: `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
  backgroundColor: alpha(theme.palette.success.light, 0.055),
  boxShadow: "none",
}));

export const ReplyHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const ReplyContent = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.25),
  color: theme.palette.text.secondary,
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
}));

export const ReplyForm = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2.5),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
}));

export const EmptyReplies = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  textAlign: "center",
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.action.hover, 0.55),
}));