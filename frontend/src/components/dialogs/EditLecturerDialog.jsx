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

import { updateLecturer } from "../../services/lecturerService";
import { getCourses } from "../../services/courseService";
import { getBranches } from "../../services/branchService";

const selectedMenuItemSx = {
  "&.Mui-selected": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },

  "&.Mui-selected:hover": {
    backgroundColor: "primary.dark",
  },
};

export default function EditLecturerDialog({
  open,
  onClose,
  lecturer,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [branchLocations, setBranchLocations] = useState([]);
  const [preferredRegions, setPreferredRegions] = useState([]);
  const [secondaryRegions, setSecondaryRegions] = useState([]);

  const [maxAssignmentsPerMonth, setMaxAssignmentsPerMonth] =
    useState(4);

  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // ------------------------------------------------
  // Load courses
  // ------------------------------------------------

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

  // ------------------------------------------------
  // Load branch counties
  // ------------------------------------------------

  const loadBranchLocations = async () => {
    try {
      const branches = await getBranches();

      const locations = [
        ...new Set(
          branches
            .map((branch) => branch.region)
            .filter(Boolean)
        ),
      ].sort();

      setBranchLocations(locations);
    } catch (error) {
      console.error(
        "LOAD BRANCH LOCATIONS ERROR:",
        error
      );
    }
  };

  // ------------------------------------------------
  // Load lecturer data
  // ------------------------------------------------

  useEffect(() => {
    if (!open || !lecturer) {
      return;
    }

    loadCourses();
    loadBranchLocations();

    setName(lecturer.name || "");
    setPhone(lecturer.phone || "");
    setEmail(lecturer.email || "");

    setSelectedCourses(
      lecturer.courses
        ? lecturer.courses.map((course) =>
            typeof course === "string"
              ? course
              : course._id
          )
        : []
    );

    setPreferredRegions(
      lecturer.preferredRegions || []
    );

    setSecondaryRegions(
      lecturer.secondaryRegions || []
    );

    setMaxAssignmentsPerMonth(
      lecturer.maxAssignmentsPerMonth || 4
    );

    setActive(
      lecturer.active !== undefined
        ? lecturer.active
        : true
    );
  }, [open, lecturer]);

  // ------------------------------------------------
  // Save
  // ------------------------------------------------

  const handleSave = async () => {
    if (!lecturer) return;

    try {
      setSaving(true);

      await updateLecturer(lecturer._id, {
        name,
        phone,
        email,
        courses: selectedCourses,
        preferredRegions,
        secondaryRegions,
        maxAssignmentsPerMonth:
          Number(maxAssignmentsPerMonth),
        active,
      });

      onUpdated();

      onClose();
    } catch (error) {
      console.error(
        "UPDATE LECTURER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update lecturer."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!lecturer) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Edit Lecturer
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>

          {/* Name */}

          <TextField
            fullWidth
            label="Lecturer Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* Phone */}

          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          {/* Email */}

          <TextField
            fullWidth
            type="email"
            label="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {/* Courses */}

          <FormControl fullWidth>
            <InputLabel>Courses</InputLabel>

            <Select
              multiple
              value={selectedCourses}
              label="Courses"
              disabled={loadingCourses}
              onChange={(e) =>
                setSelectedCourses(e.target.value)
              }
              renderValue={(selected) =>
                courses
                  .filter((course) =>
                    selected.includes(course._id)
                  )
                  .map(
                    (course) =>
                      `${course.code} - ${course.name}`
                  )
                  .join(", ")
              }
            >
              {courses.map((course) => (
                <MenuItem
                  key={course._id}
                  value={course._id}
                  sx={selectedMenuItemSx}
                >
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Preferred Counties */}

          <FormControl fullWidth>
            <InputLabel>
              Preferred Counties
            </InputLabel>

            <Select
              multiple
              value={preferredRegions}
              label="Preferred Counties"
              onChange={(e) =>
                setPreferredRegions(e.target.value)
              }
              renderValue={(selected) =>
                selected.join(", ")
              }
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

          {/* Secondary Counties */}

          <FormControl fullWidth>
            <InputLabel>
              Secondary Counties
            </InputLabel>

            <Select
              multiple
              value={secondaryRegions}
              label="Secondary Counties"
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
              <MenuItem
                value="ALL"
                sx={selectedMenuItemSx}
              >
                All Counties
              </MenuItem>

              {branchLocations.map((location) => (
                <MenuItem
                  key={location}
                  value={location}
                  disabled={secondaryRegions.includes(
                    "ALL"
                  )}
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
            onChange={(e) =>
              setMaxAssignmentsPerMonth(
                Number(e.target.value)
              )
            }
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
                setActive(
                  e.target.value === true ||
                    e.target.value === "true"
                )
              }
            >
              <MenuItem value={true}>
                Active
              </MenuItem>

              <MenuItem value={false}>
                Inactive
              </MenuItem>
            </Select>
          </FormControl>

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
            !name.trim() ||
            selectedCourses.length === 0
          }
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}