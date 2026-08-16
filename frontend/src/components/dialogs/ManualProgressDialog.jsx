import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { getLecturers } from "../../services/lecturerService";
import { addCompletedCourse } from "../../services/progressService";

export default function ManualProgressDialog({
  open,
  onClose,
  progressId,
  course,
  onCompleted,
}) {
  const [lecturers, setLecturers] = useState([]);

  const [lecturer, setLecturer] =
    useState("");

  const [completedDate, setCompletedDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [notes, setNotes] = useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    loadLecturers();
  }, [open]);

  const loadLecturers = async () => {
    try {
      const data = await getLecturers();

      setLecturers(data);
    } catch (error) {
      console.error(
        "LOAD LECTURERS ERROR:",
        error
      );
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await addCompletedCourse(
        progressId,
        {
          courseId: course._id,

          completedDate,

          lecturer:
            lecturer || null,

          manuallyCompleted: true,

          notes,
        }
      );

      onCompleted();

      onClose();

    } catch (error) {
      console.error(
        "MANUAL PROGRESS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update progress."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Mark Course Complete
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={3}
          sx={{ mt: 1 }}
        >

          <Typography>
            <strong>Course:</strong>{" "}
            {course?.code}
            {" - "}
            {course?.name}
          </Typography>

          <TextField
            fullWidth
            type="date"
            label="Completion Date"
            value={completedDate}
            onChange={(e) =>
              setCompletedDate(
                e.target.value
              )
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth>
            <InputLabel>
              Lecturer
            </InputLabel>

            <Select
              value={lecturer}
              label="Lecturer"
              onChange={(e) =>
                setLecturer(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                No Lecturer / Unknown
              </MenuItem>

              {lecturers.map(
                (item) => (
                  <MenuItem
                    key={item._id}
                    value={item._id}
                  >
                    {item.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Notes"
            placeholder="Optional notes about this completion..."
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            saving ||
            !completedDate
          }
        >
          {saving
            ? "Saving..."
            : "Mark Complete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}