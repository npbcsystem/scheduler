import { useEffect, useState } from "react";

import {
  Alert,
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

import { updateCourse } from "../../services/courseService";

const selectedMenuItemSx = {
  "&.Mui-selected": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },

  "&.Mui-selected:hover": {
    backgroundColor: "primary.dark",
  },
};

export default function EditCourseDialog({
  open,
  onClose,
  course,
  onUpdated,
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!course) return;

    setCode(course.code || "");
    setName(course.name || "");
    setLevel(course.level || "");
    setError("");
  }, [course]);

  if (!course) {
    return null;
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      await updateCourse(course._id, {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        level,
      });

      onUpdated();

      onClose();
    } catch (error) {
      console.error(
        "UPDATE COURSE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update course."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Edit Course
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Course Code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
          />

          <TextField
            fullWidth
            label="Course Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <FormControl fullWidth>
            <InputLabel>
              Level
            </InputLabel>

            <Select
              value={level}
              label="Level"
              onChange={(e) =>
                setLevel(e.target.value)
              }
            >
              <MenuItem
                value="CERTIFICATE"
                sx={selectedMenuItemSx}
              >
                Certificate
              </MenuItem>

              <MenuItem
                value="ASSOCIATE"
                sx={selectedMenuItemSx}
              >
                Associate
              </MenuItem>

              <MenuItem
                value="DIPLOMA"
                sx={selectedMenuItemSx}
              >
                Diploma
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={
            saving ||
            !code.trim() ||
            !name.trim() ||
            !level
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