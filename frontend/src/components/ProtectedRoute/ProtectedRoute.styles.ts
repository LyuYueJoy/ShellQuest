import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const LoginRequiredDialog = styled(Dialog)(
  ({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "min(100% - 32px, 460px)",
      padding: theme.spacing(2),
      borderRadius: 30,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export const DialogIcon = styled(Box)(({ theme }) => ({
  width: 72,
  height: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: `${theme.spacing(1)} auto ${theme.spacing(2)}`,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.light,
  fontSize: "2.2rem",
  boxShadow: `
    6px 7px 14px rgba(78, 69, 48, 0.16),
    inset 2px 2px 4px rgba(255, 255, 255, 0.4)
  `,
}));

export const StyledDialogTitle = styled(DialogTitle)({
  paddingBottom: 8,
  textAlign: "center",
  fontWeight: 900,
});

export const StyledDialogContent = styled(DialogContent)(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    textAlign: "center",
    lineHeight: 1.6,
  }),
);

export const StyledDialogActions = styled(DialogActions)(
  ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(1.5),
    padding: theme.spacing(2),

    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  }),
);

export const DialogButton = styled(Button)({
  width: "100%",
  minHeight: 48,
});

export const ForumButton = styled(Button)(
  ({ theme }) => ({
    gridColumn: "1 / -1",
    color: theme.palette.text.secondary,
    boxShadow: "none",

    "&:hover": {
      boxShadow: "none",
    },
  }),
);