import DeleteForeverRounded from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import {
  StyledDialog,
  WarningIconWrapper,
} from "./DeleteTortoiseDialog.styles";

interface DeleteTortoiseDialogProps {
  open: boolean;
  tortoiseName: string;
  isDeleting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteTortoiseDialog({
  open,
  tortoiseName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteTortoiseDialogProps) {
  return (
    <StyledDialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-tortoise-title"
      aria-describedby="delete-tortoise-description"
    >
      <DialogTitle
        id="delete-tortoise-title"
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          textAlign: "center",
        }}
      >
        <WarningIconWrapper>
          <WarningAmberRounded sx={{ fontSize: 42 }} />
        </WarningIconWrapper>

        Delete {tortoiseName}?
      </DialogTitle>

      <DialogContent sx={{ px: 3, textAlign: "center" }}>
        <Typography
          id="delete-tortoise-description"
          color="text.secondary"
        >
          This will permanently remove {tortoiseName}, their
          care details, notes and uploaded photo.
        </Typography>

        <Typography
          color="error"
          sx={{
            mt: 1.5,
            fontWeight: 800,
          }}
        >
          This action cannot be undone.
        </Typography>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,
              textAlign: "left",
            }}
          >
            {errorMessage}
          </Alert>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          gap: 1,
          px: 3,
          pb: 3,
          pt: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={isDeleting}
          onClick={onClose}
          sx={{ flexGrow: 1 }}
        >
          Keep tortoise
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={isDeleting}
          startIcon={
            isDeleting ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <DeleteForeverRounded />
            )
          }
          onClick={onConfirm}
          sx={{ flexGrow: 1 }}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}