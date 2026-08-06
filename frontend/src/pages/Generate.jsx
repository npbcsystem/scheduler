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

  const handleGenerate = async () => {

    try {

      setLoading(true);

      setError("");

      setSuccess("");

      const result = await generateSchedule(week);

      setSuccess(result.message);

      setTimeout(() => {

        navigate("/schedules");

      }, 1500);

    }

    catch (err) {

      console.log(err);

      setError("Unable to generate schedule.");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <Container maxWidth="md">

      <Card>

        <CardContent>

          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
          >
            Generate Schedule
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Generate schedules for all active branches.
          </Typography>

          {success && (

            <Alert
              severity="success"
              sx={{ mb: 3 }}
            >
              {success}
            </Alert>

          )}

          {error && (

            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>

          )}

          <Stack spacing={3}>

            <Box>

              <Typography
                gutterBottom
                fontWeight="bold"
              >
                Select Week
              </Typography>

              <Select
                fullWidth
                value={week}
                onChange={(e) =>
                  setWeek(e.target.value)
                }
              >
                <MenuItem value={1}>
                  Week 1
                </MenuItem>

                <MenuItem value={2}>
                  Week 2
                </MenuItem>

                <MenuItem value={3}>
                  Week 3
                </MenuItem>

                <MenuItem value={4}>
                  Week 4
                </MenuItem>

              </Select>

            </Box>

            <Button
              size="large"
              variant="contained"
              startIcon={
                loading
                  ? <CircularProgress
                      size={20}
                      color="inherit"
                    />
                  : <AutoAwesomeIcon />
              }
              disabled={loading}
              onClick={handleGenerate}
            >

              {loading
                ? "Generating..."
                : "Generate Schedule"}

            </Button>

          </Stack>

        </CardContent>

      </Card>

    </Container>

  );

}