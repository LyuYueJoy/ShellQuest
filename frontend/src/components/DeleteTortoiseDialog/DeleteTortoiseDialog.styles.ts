import {
  Box,
  Dialog,
  styled,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "100%",
    maxWidth: 480,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    backgroundImage: "none",
  },
}));

export const WarningIconWrapper = styled(Box)(
  ({ theme }) => ({
    display: "grid",
    width: 78,
    height: 78,
    marginInline: "auto",
    marginBottom: theme.spacing(2),
    placeItems: "center",
    borderRadius: "50%",
    color: theme.palette.error.main,
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    boxShadow: `
      inset 3px 3px 7px ${alpha(
        theme.palette.error.dark,
        0.1
      )},
      inset -3px -3px 7px ${alpha(
        theme.palette.common.white,
        0.3
      )}
    `,
  }),
);