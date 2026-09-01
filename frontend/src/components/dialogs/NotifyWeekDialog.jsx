import { useState } from "react";

import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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

  const [sendLecturers, setSendLecturers] = useState(true);

  const [sendCoordinators, setSendCoordinators] = useState(false);

  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
  });

  const handleSend = async () => {
    try {
      if (week === "ALL") {
        setError("Please select a specific week first.");
        return;
      }

      if (!sendLecturers && !sendCoordinators) {
        setError("Please select at least one recipient.");
        return;
      }

      setSending(true);
      setError("");

      const result = await notifyWeek(week, month, year, {
        lecturers: sendLecturers,

        coordinators: sendCoordinators,
      });

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
          <Typography fontWeight="bold" sx={{ mt: 2 }}>
            Send notification to:
          </Typography>

          <Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendLecturers}
                  onChange={(e) => setSendLecturers(e.target.checked)}
                />
              }
              label="Lecturers"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={sendCoordinators}
                  onChange={(e) => setSendCoordinators(e.target.checked)}
                />
              }
              label="Branch Coordinators"
            />
          </Stack>

          <Alert severity="info">
            {sendLecturers &&
              "Lecturers will receive their individual class assignments."}

            {sendLecturers && sendCoordinators && " "}

            {sendCoordinators &&
              "Coordinators will receive one consolidated message containing the final schedule for their branch."}
          </Alert>

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
