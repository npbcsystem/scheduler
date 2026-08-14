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

import { updateBranch } from "../../services/branchService";

export default function EditBranchDialog({ open, onClose, branch, onUpdated }) {
  const [name, setName] = useState("");

  const [region, setRegion] = useState("");

  const [levels, setLevels] = useState([]);

  const [week, setWeek] = useState(1);

  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!branch) return;

    setName(branch.name || "");

    setRegion(branch.region || "");

    setLevels(branch.levels || []);

    setWeek(branch.week || 1);

    setActive(branch.active ?? true);
  }, [branch]);

  const handleSave = async () => {
  try {

    setSaving(true);

    await updateBranch(
      branch._id,
      {
        name,
        region,
        levels,
        week,
        active,
      }
    );

    onUpdated();

    onClose();

  } catch (error) {

    console.error(
      "UPDATE BRANCH ERROR:",
      error
    );

    const message =
      error.response?.data?.message ||
      "Unable to update branch.";

    alert(message);

  } finally {

    setSaving(false);

  }
};

  if (!branch) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Branch</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Branch Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Levels</InputLabel>

            <Select
              multiple
              value={levels}
              label="Levels"
              onChange={(e) => setLevels(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="CERTIFICATE">Certificate</MenuItem>

              <MenuItem value="ASSOCIATE">Associate</MenuItem>

              <MenuItem value="DIPLOMA">Diploma</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Teaching Week</InputLabel>

            <Select
              value={week}
              label="Teaching Week"
              onChange={(e) => setWeek(Number(e.target.value))}
            >
              <MenuItem value={1}>Week 1</MenuItem>

              <MenuItem value={2}>Week 2</MenuItem>

              <MenuItem value={3}>Week 3</MenuItem>

              <MenuItem value={4}>Week 4</MenuItem>
            </Select>
          </FormControl>
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

        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
