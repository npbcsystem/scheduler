import { MenuItem, TextField } from "@mui/material";
import { centerTypeLabels } from "../../services/branchService";

export default function CenterTypeField({ value, onChange }) {
  return (
    <TextField
      select
      fullWidth
      label="Center type"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
      {Object.entries(centerTypeLabels).map(([type, label]) => (
        <MenuItem key={type} value={type}>{label}</MenuItem>
      ))}
    </TextField>
  );
}
