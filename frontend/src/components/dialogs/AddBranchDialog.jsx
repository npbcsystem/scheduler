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

import { createBranch } from "../../services/branchService";
import { kenyaCounties } from "./kenya";

export default function AddBranchDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [levels, setLevels] = useState([]);
  const [week, setWeek] = useState(1);
  const [active, setActive] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await createBranch({
        name,
        region,
        levels,
        week,
        active,
      });

      onCreated();

      onClose();

      // Reset form
      setName("");
      setRegion("");
      setLevels([]);
      setWeek(1);
      setActive(true);
    } catch (error) {
      console.error("CREATE BRANCH ERROR:", error);

      alert(error.response?.data?.message || "Unable to create branch.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Branch</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Branch Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>County</InputLabel>

            <Select
              value={region}
              label="County"
              onChange={(e) => setRegion(e.target.value)}
            >
              {kenyaCounties.map((county) => (
                <MenuItem key={county} value={county}>
                  {county}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Levels</InputLabel>

            <Select
              multiple
              value={levels}
              label="Levels"
              onChange={(e) => setLevels(e.target.value)}
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem
                value="CERTIFICATE"
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
                Certificate
              </MenuItem>

              <MenuItem
                value="ASSOCIATE"
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
                Associate
              </MenuItem>

              <MenuItem
                value="DIPLOMA"
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
                Diploma
              </MenuItem>
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

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !name.trim() || levels.length === 0}
        >
          {saving ? "Saving..." : "Add Branch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
