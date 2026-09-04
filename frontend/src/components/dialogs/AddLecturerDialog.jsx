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
} from "@mui/material";

import { createLecturer } from "../../services/lecturerService";
import { getCourses } from "../../services/courseService";
import { getBranches } from "../../services/branchService";

export default function AddLecturerDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [courses, setCourses] = useState([]);

  const [selectedCourses, setSelectedCourses] = useState([]);

  const [preferredRegions, setPreferredRegions] = useState([]);

  const [secondaryRegions, setSecondaryRegions] = useState([]);

  const [email, setEmail] = useState("");

  const [maxAssignmentsPerMonth, setMaxAssignmentsPerMonth] = useState(4);

  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);

  const [loadingCourses, setLoadingCourses] = useState(false);

  const [branchLocations, setBranchLocations] = useState([]);

  // ---------------------------------------------
  // Load courses
  // ---------------------------------------------
  const loadCourses = async () => {
    try {
      setLoadingCourses(true);

      const data = await getCourses();

      setCourses(data);
    } catch (error) {
      console.error("LOAD COURSES ERROR:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadBranchLocations = async () => {
    try {
      const branches = await getBranches();

      const locations = [
        ...new Set(branches.map((branch) => branch.region).filter(Boolean)),
      ].sort();

      setBranchLocations(locations);
    } catch (error) {
      console.error("LOAD BRANCH LOCATIONS ERROR:", error);
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    loadCourses();
    loadBranchLocations();
  }, [open]);

  const selectedMenuItemSx = {
    "&.Mui-selected": {
      backgroundColor: "primary.main",
      color: "primary.contrastText",
    },

    "&.Mui-selected:hover": {
      backgroundColor: "primary.dark",
    },
  };

  // ---------------------------------------------
  // Save
  // ---------------------------------------------

  const handleSave = async () => {
    try {
      setSaving(true);

      await createLecturer({
        name,

        phone,

        email,

        courses: selectedCourses,

        preferredRegions,

        secondaryRegions,

        maxAssignmentsPerMonth: Number(maxAssignmentsPerMonth),

        active,

        currentAssignments: 0,
      });

      onCreated();

      resetForm();

      onClose();
    } catch (error) {
      console.error("CREATE LECTURER ERROR:", error);

      alert(error.response?.data?.message || "Unable to create lecturer.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");

    setSelectedCourses([]);

    setPreferredRegions([]);

    setSecondaryRegions([]);

    setMaxAssignmentsPerMonth(4);

    setActive(true);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Lecturer</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Name */}

          <TextField
            fullWidth
            label="Lecturer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Phone */}

          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Courses */}

          <FormControl fullWidth>
            <InputLabel>Courses</InputLabel>

            <Select
              multiple
              value={selectedCourses}
              label="Courses"
              disabled={loadingCourses}
              onChange={(e) => setSelectedCourses(e.target.value)}
              renderValue={(selected) => {
                return courses
                  .filter((course) => selected.includes(course._id))
                  .map((course) => `${course.code} - ${course.name}`)
                  .join(", ");
              }}
            >
              {courses.map((course) => (
                <MenuItem
                  key={course._id}
                  value={course._id}
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
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Preferred Regions */}

          <FormControl fullWidth>
            <InputLabel>Preferred Regions</InputLabel>

            <Select
              multiple
              value={preferredRegions}
              label="Preferred Regions"
              onChange={(e) => setPreferredRegions(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              {branchLocations.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                  sx={selectedMenuItemSx}
                >
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Secondary Regions */}

          <FormControl fullWidth>
            <InputLabel>Secondary Regions</InputLabel>

            <Select
              multiple
              value={secondaryRegions}
              label="Secondary Regions"
              onChange={(e) => {
                const value = e.target.value;

                if (value.includes("ALL")) {
                  setSecondaryRegions(["ALL"]);
                } else {
                  setSecondaryRegions(value);
                }
              }}
              renderValue={(selected) => {
                if (selected.includes("ALL")) {
                  return "All Counties";
                }

                return selected.join(", ");
              }}
            >
              <MenuItem value="ALL" sx={selectedMenuItemSx}>
                All Counties
              </MenuItem>

              {branchLocations.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                  disabled={secondaryRegions.includes("ALL")}
                  sx={selectedMenuItemSx}
                >
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Maximum assignments */}

          <TextField
            fullWidth
            type="number"
            label="Maximum Assignments Per Month"
            value={maxAssignmentsPerMonth}
            onChange={(e) => setMaxAssignmentsPerMonth(Number(e.target.value))}
            inputProps={{
              min: 1,
            }}
          />

          {/* Status */}

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              value={active}
              label="Status"
              onChange={(e) =>
                setActive(e.target.value === true || e.target.value === "true")
              }
            >
              <MenuItem value={true}>Active</MenuItem>

              <MenuItem value={false}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !name.trim() || selectedCourses.length === 0}
        >
          {saving ? "Saving..." : "Add Lecturer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
