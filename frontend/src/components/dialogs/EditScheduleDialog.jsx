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
  Chip,
  Box,
} from "@mui/material";

import { getLecturersByCourseAvailability } from "../../services/lecturerService";
import { updateSchedule } from "../../services/scheduleService";
import { getRemainingCourses } from "../../services/progressService";
import { assignPendingAssignment } from "../../services/pendingAssignmentService";

export default function EditScheduleDialog({
  open,
  onClose,
  schedule,
  pendingAssignment,
  assignMode,
  onUpdated,
}) {
  const [lecturers, setLecturers] = useState([]);

  const [selectedLecturer, setSelectedLecturer] = useState("");

  const [status, setStatus] = useState("PENDING");

  const [saving, setSaving] = useState(false);

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const current = assignMode ? pendingAssignment : schedule;

  useEffect(() => {
    if (!current) return;

    loadCourses(current.branch._id, current.level);

    if (assignMode) {
      setSelectedCourse(current.suggestedCourse._id);

      loadLecturers(current.suggestedCourse._id);

      setSelectedLecturer("");

      setStatus("DRAFT");
    } else {
      setSelectedCourse(current.course._id);

      loadLecturers(current.course._id);

      setSelectedLecturer(current.lecturer?._id || "");

      setStatus(current.status);
    }
  }, [current, assignMode]);

  const loadLecturers = async (courseId) => {
    try {
      if (!current || !courseId) {
        return;
      }

      const data = await getLecturersByCourseAvailability(
        courseId,
        current.week,
        current.month,
        current.year,
        assignMode ? "" : current._id,
      );

      setLecturers(data);
    } catch (err) {
      console.error("LOAD AVAILABLE LECTURERS ERROR:", err);

      setLecturers([]);
    }
  };

  const loadCourses = async (branchId, level) => {
    try {
      const data = await getRemainingCourses(branchId, level);

      setCourses(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (assignMode) {
        await assignPendingAssignment(
          pendingAssignment._id,

          {
            course: selectedCourse,

            lecturer: selectedLecturer,

            status,
          },
        );
      } else {
        await updateSchedule(
          schedule._id,

          {
            course: selectedCourse,

            lecturer: selectedLecturer,

            status,
          },
        );
      }

      onUpdated();

      onClose();
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (!current) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {assignMode ? "Assign Pending Class" : "Edit Schedule"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography>
            <strong>Branch:</strong> {current.branch?.name}
          </Typography>

          <Typography>
            <strong>Course:</strong>{" "}
            {assignMode ? current.suggestedCourse?.name : current.course?.name}
          </Typography>

          <Typography>
            <strong>Level:</strong> {current.level}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Course</InputLabel>

            <Select
              label="Course"
              value={selectedCourse}
              onChange={async (e) => {
                const value = e.target.value;

                setSelectedCourse(value);

                await loadLecturers(value);
              }}
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Lecturer</InputLabel>

            <Select
              label="Lecturer"
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
            >
              {lecturers.map((lecturer) => {
                const assigned = lecturer.assignedThisWeek;

                const isCurrentLecturer = lecturer._id === selectedLecturer;

                const disabled = assigned && !isCurrentLecturer;

                return (
                  <MenuItem
                    key={lecturer._id}
                    value={lecturer._id}
                    disabled={disabled}
                    sx={{
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                      },

                      "&.Mui-selected:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">
                          {lecturer.name}
                        </Typography>

                        {/* <Typography variant="caption">
                          Assignments: {lecturer.currentAssignments || 0}
                          {" / "}
                          {lecturer.maxAssignmentsPerMonth}
                        </Typography> */}
                      </Box>

                      <Chip
                        size="small"
                        label={
                          assigned
                            ? isCurrentLecturer
                              ? "Current"
                              : "Assigned"
                            : "Available"
                        }
                        color={
                          assigned
                            ? isCurrentLecturer
                              ? "warning"
                              : "error"
                            : "success"
                        }
                        variant="outlined"
                      />
                    </Box>
                  </MenuItem>
                );
              })}
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
