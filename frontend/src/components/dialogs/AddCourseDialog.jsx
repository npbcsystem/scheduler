import { useState } from "react";

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

import { createCourse } from "../../services/courseService";

const selectedMenuItemSx = {
  "&.Mui-selected": {
    backgroundColor: "primary.main",
    color: "primary.contrastText",
  },

  "&.Mui-selected:hover": {
    backgroundColor: "primary.dark",
  },
};

export default function AddCourseDialog({
  open,
  onClose,
  onCreated,
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setCode("");
    setName("");
    setLevel("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await createCourse({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        level,
      });

      resetForm();

      onCreated();

      onClose();
    } catch (error) {
      console.error(
        "CREATE COURSE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to create course."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Add Course
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Course Code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            placeholder="e.g. CERT001"
          />

          <TextField
            fullWidth
            label="Course Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="e.g. Principles of Study"
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
          onClick={handleClose}
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
            : "Add Course"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}