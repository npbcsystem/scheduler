import { useEffect, useState } from "react";

import {
  Alert,
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
  useMediaQuery,
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
  const compact = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [lecturers, setLecturers] = useState([]);

  const [selectedLecturer, setSelectedLecturer] = useState("");

  const [status, setStatus] = useState("PENDING");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loadingLecturers, setLoadingLecturers] = useState(false);

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const current = assignMode ? pendingAssignment : schedule;
  const originalCourse = assignMode ? current?.suggestedCourse : current?.course;

  useEffect(() => {
    if (!current || !open) return;
    let active = true;
    setSaveError("");
    setCourses([]);
    setSelectedCourse(originalCourse?._id || "");
    setSelectedLecturer(assignMode ? "" : current.lecturer?._id || "");
    setStatus(assignMode ? "DRAFT" : current.status);
    if (current.branch?._id) {
      getRemainingCourses(current.branch._id, current.level)
        .then((data) => { if (active) setCourses(data); })
        .catch(() => { if (active) setSaveError("Unable to load alternative courses."); });
    }
    return () => { active = false; };
  }, [current, assignMode, open, originalCourse]);

  useEffect(() => {
    if (!current || !open || !selectedCourse) return;
    let active = true;
    setLecturers([]);
    setLoadingLecturers(true);
    getLecturersByCourseAvailability(selectedCourse, current.week, current.month, current.year, assignMode ? "" : current._id)
      .then((data) => { if (active) setLecturers(data); })
      .catch(() => { if (active) setSaveError("Unable to load available lecturers."); })
      .finally(() => { if (active) setLoadingLecturers(false); });
    return () => { active = false; };
  }, [current, open, assignMode, selectedCourse]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError("");

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
      setSaveError(err.response?.data?.message || "Unable to save the schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!current) return null;

  const courseOptions = originalCourse && !courses.some((course) => course._id === originalCourse._id)
    ? [originalCourse, ...courses] : courses;
  const originalLecturer = assignMode ? null : current.lecturer;
  const lecturerOptions = originalLecturer?._id === selectedLecturer
    && !lecturers.some((lecturer) => lecturer._id === selectedLecturer)
    ? [originalLecturer, ...lecturers] : lecturers;
  const needsLecturer = assignMode || selectedCourse !== originalCourse?._id;

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullScreen={compact} fullWidth maxWidth="sm" aria-labelledby="schedule-editor-title">
      <DialogTitle id="schedule-editor-title">
        {assignMode ? "Assign Pending Class" : "Edit Schedule"}
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography>
            <strong>Center:</strong> {current.branch?.name}
          </Typography>

          <Typography>
            <strong>Course:</strong>{" "}
            {assignMode ? current.suggestedCourse?.name : current.course?.name}
          </Typography>

          <Typography>
            <strong>Level:</strong> {current.level}
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="schedule-course-label">Course</InputLabel>

            <Select
              label="Course"
              labelId="schedule-course-label"
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedLecturer("");
                setSaveError("");
              }}
            >
              {courseOptions.map((course) => (
                <MenuItem key={course._id} value={course._id} sx={{ whiteSpace: "normal" }}>
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="schedule-lecturer-label">Lecturer</InputLabel>

            <Select
              label="Lecturer"
              labelId="schedule-lecturer-label"
              disabled={loadingLecturers}
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
              renderValue={(value) => lecturerOptions.find((lecturer) => lecturer._id === value)?.name ?? ""}
            >
              {lecturerOptions.length === 0 && <MenuItem disabled value="">No lecturers available</MenuItem>}
              {lecturerOptions.map((lecturer) => {
                const assigned = lecturer.assignedThisWeek;

                const isCurrentLecturer = lecturer._id === selectedLecturer;

                const disabled = assigned && !isCurrentLecturer;

                return (
                  <MenuItem
                    key={lecturer._id}
                    value={lecturer._id}
                    disabled={disabled}
                    sx={{
                      whiteSpace: "normal",
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
            <InputLabel id="schedule-status-label">Status</InputLabel>

            <Select
              label="Status"
              labelId="schedule-status-label"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>

              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
          {saveError && <Alert severity="error">{saveError}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: "max(14px, env(safe-area-inset-bottom))", "& > button": { minHeight: 44, flex: { xs: 1, sm: "initial" } } }}>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || loadingLecturers || !selectedCourse || (needsLecturer && !selectedLecturer)}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
