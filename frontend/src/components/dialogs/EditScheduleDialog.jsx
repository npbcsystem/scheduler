import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  getLecturers,
  getLecturersByCourse
} from "../../services/lecturerService";
import { updateSchedule } from "../../services/scheduleService";

export default function EditScheduleDialog({
  open,
  onClose,
  schedule,
  onUpdated,
}) {
  const [lecturers, setLecturers] = useState([]);

  const [selectedLecturer, setSelectedLecturer] = useState("");

  const [status, setStatus] = useState("PENDING");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (schedule) {
      setSelectedLecturer(schedule.lecturer?._id);

      setStatus(schedule.status);
    }
  }, [schedule]);

  //   load lecturer by course
  useEffect(() => {
    if (schedule) {
      loadLecturers(schedule.course._id);

      setSelectedLecturer(schedule.lecturer?._id);

      setStatus(schedule.status);
    }
  }, [schedule]);

  const loadLecturers = async (courseId) => {
  try {

    const data = await getLecturersByCourse(courseId);

    setLecturers(data);

  } catch (err) {

    console.log(err);

  }
};

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateSchedule(schedule._id, {
        lecturer: selectedLecturer,
        status,
      });

      onUpdated();

      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Schedule</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography>
            <strong>Branch:</strong> {schedule.branch?.name}
          </Typography>

          <Typography>
            <strong>Course:</strong> {schedule.course?.name}
          </Typography>

          <Typography>
            <strong>Level:</strong> {schedule.level}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Lecturer</InputLabel>

            <Select
              label="Lecturer"
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
            >
              {lecturers.map((lecturer) => (
                <MenuItem key={lecturer._id} value={lecturer._id}>
                  <div>
                    <strong>{lecturer.name}</strong>

                    <br />

                    <small>
                      Assignments: {lecturer.currentAssignments}
                      {" / "}
                      {lecturer.maxAssignmentsPerMonth}
                    </small>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>

              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
