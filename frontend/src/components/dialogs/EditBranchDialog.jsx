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
import { kenyaCounties } from "./kenya";

export default function EditBranchDialog({ open, onClose, branch, onUpdated }) {
  const [name, setName] = useState("");

  const [region, setRegion] = useState("");

  const [levels, setLevels] = useState([]);

  const [week, setWeek] = useState(1);

  const [active, setActive] = useState(true);

  const [coordinatorName, setCoordinatorName] = useState("");

  const [coordinatorPhone, setCoordinatorPhone] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!branch) return;

    setName(branch.name || "");

    setCoordinatorName(branch?.coordinatorName || "");

    setCoordinatorPhone(branch?.coordinatorPhone || "");

    setRegion(branch.region || "");

    setLevels(branch.levels || []);

    setWeek(branch.week || 1);

    setActive(branch.active ?? true);
  }, [branch]);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateBranch(branch._id, {
        name,
        region,
        levels,
        week,
        active,

        coordinatorName,
        coordinatorPhone,
      });

      onUpdated();

      onClose();
    } catch (error) {
      console.error("UPDATE CENTER ERROR:", error);

      const message =
        error.response?.data?.message || "Unable to update center.";

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
      <DialogTitle>Edit Center</DialogTitle>

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
            label="Coordinator Name"
            value={coordinatorName}
            onChange={(e) => setCoordinatorName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Coordinator Phone"
            value={coordinatorPhone}
            onChange={(e) => setCoordinatorPhone(e.target.value)}
            placeholder="0712345678"
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
              <MenuItem
                value={1}
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
                Week 1
              </MenuItem>

              <MenuItem
                value={2}
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
                Week 2
              </MenuItem>

              <MenuItem
                value={3}
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
                Week 3
              </MenuItem>

              <MenuItem
                value={4}
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
                Week 4
              </MenuItem>
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
