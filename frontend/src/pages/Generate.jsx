import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
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

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerate = async () => {
    try {
      setLoading(true);

      setError("");

      setSuccess("");

      const result = await generateSchedule(week, selectedMonth, selectedYear);

      setSummary(result);

      setSuccess(result.message);
    } catch (err) {
      console.log(err);

      setError("Unable to generate schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Generate Schedule
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Generate schedules for all active branches.
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Box>
              <Typography gutterBottom fontWeight="bold">
                Schedule Period
              </Typography>

              <Stack spacing={2}>
                {/* Year */}

                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>

                  <Select
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    <MenuItem value={2026}>2026</MenuItem>

                    <MenuItem value={2027}>2027</MenuItem>

                    <MenuItem value={2028}>2028</MenuItem>
                  </Select>
                </FormControl>

                {/* Month */}

                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>

                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    <MenuItem value={1}>January</MenuItem>

                    <MenuItem value={2}>February</MenuItem>

                    <MenuItem value={3}>March</MenuItem>

                    <MenuItem value={4}>April</MenuItem>

                    <MenuItem value={5}>May</MenuItem>

                    <MenuItem value={6}>June</MenuItem>

                    <MenuItem value={7}>July</MenuItem>

                    <MenuItem value={8}>August</MenuItem>

                    <MenuItem value={9}>September</MenuItem>

                    <MenuItem value={10}>October</MenuItem>

                    <MenuItem value={11}>November</MenuItem>

                    <MenuItem value={12}>December</MenuItem>
                  </Select>
                </FormControl>

                {/* Week */}

                <FormControl fullWidth>
                  <InputLabel>Week</InputLabel>

                  <Select
                    value={week}
                    label="Week"
                    onChange={(e) => setWeek(Number(e.target.value))}
                  >
                    <MenuItem value={1}>Week 1</MenuItem>

                    <MenuItem value={2}>Week 2</MenuItem>

                    <MenuItem value={3}>Week 3</MenuItem>

                    <MenuItem value={4}>Week 4</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Button
              size="large"
              variant="contained"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AutoAwesomeIcon />
                )
              }
              disabled={loading}
              onClick={handleGenerate}
            >
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
            {summary && (
              <Card sx={{ mt: 4 }}>
                <CardContent>
                  <Typography variant="h6">Generation Summary</Typography>

                  <Typography>
                    Expected Classes: {summary.expectedClasses}
                  </Typography>

                  <Typography>
                    Schedules Created: {summary.schedulesCreated}
                  </Typography>

                  <Typography color="error">
                    Unassigned: {summary.unassigned.length}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {summary?.unassigned?.length > 0 && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="error">
                    Unassigned Classes
                  </Typography>

                  {summary.unassigned.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography fontWeight="bold">
                        {item.branchName}
                      </Typography>

                      <Typography>{item.level}</Typography>

                      <Typography>{item.courseCode}</Typography>

                      <Typography>{item.courseName}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
