import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getSchedules,
  approveWeek,
  approveAll,
} from "../services/scheduleService";
import EditScheduleDialog from "../components/dialogs/EditScheduleDialog";
import { getPendingAssignments } from "../services/pendingAssignmentService";

export default function Schedules() {
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [schedules, setSchedules] = useState([]);

  const [pendingAssignments, setPendingAssignments] = useState([]);

  const [search, setSearch] = useState("");

  const [weekFilter, setWeekFilter] = useState("ALL");

  const [selectedPending, setSelectedPending] = useState(null);

  const [assignMode, setAssignMode] = useState(false);
  

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  //--------------------------------------------------
  // Load schedules
  //--------------------------------------------------

  const loadSchedules = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getSchedules();

      setSchedules(data);
    } catch (err) {
      console.error(err);

      setError("Unable to load schedules.");
    } finally {
      setLoading(false);
    }
  };

  //--------------------------------------------------
  // Initial load
  //--------------------------------------------------

  // load schedules pending
  const loadPendingAssignments = async () => {
    try {
      const data = await getPendingAssignments();

      setPendingAssignments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSchedules();
    loadPendingAssignments();

    // const interval = setInterval(() => {
    //   loadSchedules();
    // }, 10000);

    // return () => clearInterval(interval);
  }, []);

  //--------------------------------------------------
  // Filter schedules
  //--------------------------------------------------

  const handleApproveWeek = async () => {
    try {
      if (weekFilter === "ALL") {
        alert("Please select a specific week first.");
        return;
      }

      const result = await approveWeek(weekFilter);

      // alert(result.message);
      setSnackbarMessage(result.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      loadSchedules();
    } catch (error) {
      console.error(error);

      alert("Unable to approve schedules.");
    }
  };

  const handleApproveAll = async () => {
    try {
      const result = await approveAll();

      alert(result.message);

      loadSchedules();
    } catch (error) {
      console.error(error);

      alert("Unable to approve schedules.");
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesWeek =
      weekFilter === "ALL" || schedule.week === Number(weekFilter);

    const searchText = search.toLowerCase();

    const matchesSearch =
      schedule.branch?.name.toLowerCase().includes(searchText) ||
      schedule.course?.name.toLowerCase().includes(searchText) ||
      schedule.lecturer?.name.toLowerCase().includes(searchText);

    return matchesWeek && matchesSearch;
  });

  //--------------------------------------------------
  // Status Chip
  //--------------------------------------------------

  const statusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "warning";

      case "APPROVED":
        return "info";

      case "COMPLETED":
        return "success";

      case "CANCELLED":
        return "error";

      default:
        return "default";
    }
  };

  //--------------------------------------------------

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Schedule Management
        </Typography>

        <Button variant="contained" color="success" onClick={handleApproveWeek}>
          Approve Week
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleApproveAll}
        >
          Approve All
        </Button>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadSchedules}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Search Branch / Course / Lecturer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Week</InputLabel>

            <Select
              value={weekFilter}
              label="Week"
              onChange={(e) => setWeekFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Weeks</MenuItem>

              <MenuItem value={1}>Week 1</MenuItem>

              <MenuItem value={2}>Week 2</MenuItem>

              <MenuItem value={3}>Week 3</MenuItem>

              <MenuItem value={4}>Week 4</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={300}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Week</b>
                  </TableCell>

                  <TableCell>
                    <b>Branch</b>
                  </TableCell>

                  <TableCell>
                    <b>Region</b>
                  </TableCell>

                  <TableCell>
                    <b>Level</b>
                  </TableCell>

                  <TableCell>
                    <b>Course</b>
                  </TableCell>

                  <TableCell>
                    <b>Lecturer</b>
                  </TableCell>

                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No schedules found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((schedule) => (
                    <TableRow key={schedule._id} hover>
                      <TableCell>Week {schedule.week}</TableCell>

                      <TableCell>{schedule.branch?.name}</TableCell>

                      <TableCell>{schedule.branch?.region}</TableCell>

                      <TableCell>{schedule.level}</TableCell>

                      <TableCell>
                        <Typography fontWeight="bold">
                          {schedule.course?.code}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {schedule.course?.name}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.lecturer?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.lecturer?.phone}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={schedule.status}
                          color={statusColor(schedule.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedSchedule(schedule);

                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
          Unassigned Classes
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch</TableCell>

              <TableCell>Level</TableCell>

              <TableCell>Suggested Course</TableCell>

              <TableCell>Reason</TableCell>

              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pendingAssignments.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.branch.name}</TableCell>

                <TableCell>{item.level}</TableCell>

                <TableCell>
                  {item.suggestedCourse.code}
                  {" - "}
                  {item.suggestedCourse.name}
                </TableCell>

                <TableCell>{item.reason}</TableCell>

                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSelectedPending(item);

                      setAssignMode(true);

                      setDialogOpen(true);
                    }}
                  >
                    Assign
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <EditScheduleDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);

          setAssignMode(false);

          setSelectedPending(null);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        pendingAssignment={selectedPending}
        assignMode={assignMode}
        onUpdated={() => {
          loadSchedules();

          loadPendingAssignments();
        }}
      />
    </Container>
  );
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={3000}
    onClose={() => setSnackbarOpen(false)}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert
      severity={snackbarSeverity}
      onClose={() => setSnackbarOpen(false)}
      variant="filled"
    >
      {snackbarMessage}
    </Alert>
  </Snackbar>;
}
