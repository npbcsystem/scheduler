import { useState } from "react";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import { notifyWeek } from "../../services/scheduleService";

export default function NotifyWeekDialog({
  open,
  onClose,
  week,
  month,
  year,
  schedulesCount,
  onSuccess,
}) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });

  const handleSend = async () => {
    try {
      if (week === "ALL") {
        setError("Please select a specific week first.");
        return;
      }
      setSending(true);
      setError("");

      const result = await notifyWeek(week, month, year);

      onSuccess(result);
      onClose();
    } catch (error) {
      console.error("NOTIFY WEEK ERROR:", error);

      setError(
        error.response?.data?.message || "Unable to send notifications.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={sending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Send Week {week} Notifications</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography>You are about to send SMS notifications for:</Typography>

          <Typography fontWeight="bold">
            {monthName} {year} — Week {week}
          </Typography>

          <Typography>
            Approved classes: <strong>{schedulesCount}</strong>
          </Typography>

          <Alert severity="info">
            Notifications will be sent to the assigned lecturers and branch
            coordinators.
          </Alert>

          <Typography variant="body2" color="text.secondary">
            Coordinators will receive one consolidated message containing all
            approved classes at their branch. Lecturers will receive a message
            for their assigned class.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={sending}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSend}
          disabled={sending || schedulesCount === 0}
        >
          {sending ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Sending...
            </>
          ) : (
            "Send Notifications"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
