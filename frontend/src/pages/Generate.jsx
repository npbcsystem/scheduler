import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { generateSchedule } from "../services/scheduleService";

export default function Generate() {
  const navigate = useNavigate();

  const [week, setWeek] = useState(1);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleGenerate = async () => {
    try {
      setLoading(true);

      setError("");

      setMessage("");

      const result = await generateSchedule(week);

      setMessage(
        `${result.schedulesCreated} schedules generated successfully.`,
      );

      setTimeout(() => {
        navigate("/schedules");
      }, 1500);
    } catch (err) {
      console.error(err);

      setError("Unable to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Generate Schedule
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Select the week you would like to generate.
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <Select value={week} onChange={(e) => setWeek(e.target.value)}>
            <MenuItem value={1}>Week 1</MenuItem>

            <MenuItem value={2}>Week 2</MenuItem>

            <MenuItem value={3}>Week 3</MenuItem>

            <MenuItem value={4}>Week 4</MenuItem>
          </Select>

          <Box>
            <Button
              variant="contained"
              disabled={loading}
              startIcon={<AutoAwesomeIcon />}
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
