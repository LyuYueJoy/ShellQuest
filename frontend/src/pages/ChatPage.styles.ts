import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  ListItemButton,
  Paper,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const ChatPageRoot = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 72px)",
  padding: theme.spacing(4, 2, 6),
  background: `
    radial-gradient(
      circle at 10% 10%,
      ${alpha(theme.palette.primary.light, 0.18)},
      transparent 34%
    ),
    radial-gradient(
      circle at 90% 80%,
      ${alpha(theme.palette.secondary.light, 0.16)},
      transparent 32%
    ),
    ${theme.palette.background.default}
  `,
}));

export const ChatLayout = styled(Paper)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "300px minmax(0, 1fr)",
  width: "100%",
  maxWidth: 1180,
  height: "min(720px, calc(100vh - 150px))",
  minHeight: 580,
  margin: "0 auto",
  overflow: "hidden",
  borderRadius: 28,
  border: `1px solid ${alpha(
    theme.palette.primary.main,
    0.15,
  )}`,
  backgroundColor: alpha(
    theme.palette.background.paper,
    0.94,
  ),
  boxShadow: `0 24px 70px ${alpha(
    theme.palette.common.black,
    0.14,
  )}`,

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "240px minmax(0, 1fr)",
  },

  [theme.breakpoints.down("sm")]: {
    display: "block",
    height: "calc(100vh - 112px)",
    minHeight: 520,
    borderRadius: 20,
  },
}));

export const UserPanel = styled(Box)(({ theme }) => ({
  display: "flex",
  minWidth: 0,
  flexDirection: "column",
  borderRight: `1px solid ${alpha(
    theme.palette.divider,
    0.75,
  )}`,
  backgroundColor: alpha(
    theme.palette.primary.light,
    0.055,
  ),

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const UserPanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${alpha(
    theme.palette.divider,
    0.75,
  )}`,
}));

export const UserList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(1.5),
}));

export const UserButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.4),
  borderRadius: 16,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.14)
    : "transparent",

  "&:hover": {
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.main, 0.08),
  },
}));

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  fontWeight: 800,
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(
    135deg,
    ${theme.palette.primary.main},
    ${theme.palette.secondary.main}
  )`,
}));

export const ConversationPanel = styled(Box)(() => ({
  display: "flex",
  minWidth: 0,
  height: "100%",
  flexDirection: "column",
}));

export const ConversationHeader = styled(Box)(
  ({ theme }) => ({
    display: "flex",
    minHeight: 84,
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing(2),
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${alpha(
      theme.palette.divider,
      0.75,
    )}`,

    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1.5, 2),
    },
  }),
);

export const MobileUserSelector = styled(TextField)(
  ({ theme }) => ({
    display: "none",
    minWidth: 150,

    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  }),
);

export const ConnectionChip = styled(Chip)(({ theme }) => ({
  fontWeight: 700,

  [theme.breakpoints.down("sm")]: {
    maxWidth: 110,
  },
}));

export const MessageArea = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: theme.spacing(1.2),
  overflowY: "auto",
  padding: theme.spacing(3),
  backgroundColor: alpha(
    theme.palette.background.default,
    0.52,
  ),

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

export const MessageRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "own",
})<{ own?: boolean }>(({ own }) => ({
  display: "flex",
  justifyContent: own ? "flex-end" : "flex-start",
}));

export const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "own",
})<{ own?: boolean }>(({ theme, own }) => ({
  maxWidth: "72%",
  padding: theme.spacing(1.25, 1.7),
  borderRadius: own
    ? "18px 18px 5px 18px"
    : "18px 18px 18px 5px",
  color: own
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  background: own
    ? `linear-gradient(
        135deg,
        ${theme.palette.primary.main},
        ${theme.palette.primary.dark}
      )`
    : theme.palette.background.paper,
  boxShadow: `0 7px 20px ${alpha(
    theme.palette.common.black,
    0.08,
  )}`,
  overflowWrap: "anywhere",

  [theme.breakpoints.down("sm")]: {
    maxWidth: "86%",
  },
}));

export const MessageComposer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  gap: theme.spacing(1.2),
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${alpha(
    theme.palette.divider,
    0.75,
  )}`,

  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1.5),
  },
}));

export const MessageInput = styled(TextField)(() => ({
  flex: 1,

  "& .MuiOutlinedInput-root": {
    borderRadius: 18,
  },
}));

export const SendButton = styled(Button)(({ theme }) => ({
  minWidth: 104,
  height: 52,
  borderRadius: 16,
  fontWeight: 800,
  textTransform: "none",

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const MobileSendButton = styled(IconButton)(
  ({ theme }) => ({
    display: "none",
    width: 48,
    height: 48,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,

    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },

    "&.Mui-disabled": {
      color: alpha(theme.palette.common.white, 0.65),
      backgroundColor: alpha(
        theme.palette.primary.main,
        0.35,
      ),
    },

    [theme.breakpoints.down("sm")]: {
      display: "inline-flex",
    },
  }),
);

export const StateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));