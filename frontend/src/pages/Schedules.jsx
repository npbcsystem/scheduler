import PageHeader from "../components/layout/PageHeader";
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
  useMediaQuery,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import PrintIcon from "@mui/icons-material/Print";
import PrintExportDialog from "../components/dialogs/PrintExportDialog";

import {
  getSchedules,
  approveWeek,
  approveAll,
  completeWeek,
  completeMonth,
} from "../services/scheduleService";
import EditScheduleDialog from "../components/dialogs/EditScheduleDialog";
import { getPendingAssignments } from "../services/pendingAssignmentService";
import NotifyWeekDialog from "../components/dialogs/NotifyWeekDialog";

function ScheduleCard({ center, detail, course, note, status, action, onAction }) {
  return (
    <Paper component="article" variant="outlined" sx={{ p: 2, overflowWrap: "anywhere" }}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography component="h3" fontWeight={750}>{center || "Unknown center"}</Typography>
          <Typography variant="caption" color="text.secondary">{detail}</Typography>
        </Box>
        {status}
      </Stack>
      <Typography variant="body2" fontWeight={700} sx={{ mt: 1.5 }}>{course}</Typography>
      {note && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{note}</Typography>}
      <Button fullWidth variant="outlined" onClick={onAction} sx={{ mt: 1.5, minHeight: 44 }}>
        {action}
      </Button>
    </Paper>
  );
}

export default function Schedules() {
  const compact = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [schedules, setSchedules] = useState([]);

  const [pendingAssignments, setPendingAssignments] = useState([]);

  const [search, setSearch] = useState("");

  const [weekFilter, setWeekFilter] = useState("ALL");

  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);

  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const [selectedPending, setSelectedPending] = useState(null);

  const [assignMode, setAssignMode] = useState(false);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // eport dilogue
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const editSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  };

  const assignSchedule = (item) => {
    setSelectedPending(item);
    setAssignMode(true);
    setDialogOpen(true);
  };

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
      const result = await approveWeek(
        Number(weekFilter),
        Number(monthFilter),
        Number(yearFilter),
      );

      setSnackbarMessage(result.message);

      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await loadSchedules();
    } catch (err) {
      console.error("APPROVE WEEK ERROR:", err);

      setSnackbarMessage(
        err.response?.data?.message || "Unable to approve week.",
      );

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleApproveAll = async () => {
    try {
      const result = await approveAll(Number(monthFilter), Number(yearFilter));

      setSnackbarMessage(result.message);

      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await loadSchedules();
    } catch (err) {
      console.error("APPROVE ALL ERROR:", err);

      setSnackbarMessage(
        err.response?.data?.message || "Unable to approve schedules.",
      );

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCompleteWeek = async () => {
    try {
      const result = await completeWeek(
        Number(weekFilter),
        Number(monthFilter),
        Number(yearFilter),
      );

      setSnackbarMessage(result.message);

      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await loadSchedules();
    } catch (err) {
      console.error("COMPLETE WEEK ERROR:", err);

      setSnackbarMessage(
        err.response?.data?.message || "Unable to complete week.",
      );

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCompleteMonth = async () => {
    try {
      const result = await completeMonth(
        Number(monthFilter),
        Number(yearFilter),
      );

      setSnackbarMessage(result.message);

      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      await loadSchedules();
    } catch (err) {
      console.error("COMPLETE MONTH ERROR:", err);

      setSnackbarMessage(
        err.response?.data?.message || "Unable to complete month.",
      );

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesYear = schedule.year === Number(yearFilter);

    const matchesMonth = schedule.month === Number(monthFilter);

    const matchesWeek =
      weekFilter === "ALL" || schedule.week === Number(weekFilter);

    const searchText = search.toLowerCase();

    const matchesSearch =
      schedule.branch?.name?.toLowerCase().includes(searchText) ||
      schedule.course?.name?.toLowerCase().includes(searchText) ||
      schedule.course?.code?.toLowerCase().includes(searchText) ||
      schedule.lecturer?.name?.toLowerCase().includes(searchText);

    return matchesYear && matchesMonth && matchesWeek && matchesSearch;
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
    <Container disableGutters maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <PageHeader title="Schedules" description="Review assignments, approve teaching weeks, and record completed classes." />
      </Box>

      {/* --------------------------------------------------
    Action Buttons
-------------------------------------------------- */}

      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* Action Buttons Group (Left Side) */}
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveWeek}
              disabled={weekFilter === "ALL" || loading}
            >
              Approve Week
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleApproveAll}
              disabled={loading}
            >
              Approve All
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCompleteWeek}
              disabled={weekFilter === "ALL" || loading}
            >
              Complete Week
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={handleCompleteMonth}
              disabled={loading}
            >
              Complete Month
            </Button>

            <Button
              variant="outlined"
              color="info"
              onClick={() => setNotifyDialogOpen(true)}
              disabled={
                weekFilter === "ALL" ||
                filteredSchedules.filter(
                  (schedule) => schedule.status === "APPROVED",
                ).length === 0
              }
            >
              Notify Week
            </Button>

            <IconButton
              color="primary"
              onClick={loadSchedules}
              disabled={loading}
              title="Refresh schedules"
            >
              <RefreshIcon />
            </IconButton>
          </Stack>

          {/* Print Button (Far Right) */}
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => setExportDialogOpen(true)}
            sx={{ ml: { sm: "auto" } }}
          >
            Print
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
          <TextField
            fullWidth
            label="Search schedules"
            placeholder="Center, course, or lecturer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl sx={{ minWidth: { xs: 0, sm: 150 } }}>
            <InputLabel>Year</InputLabel>

            <Select
              value={yearFilter}
              label="Year"
              onChange={(e) => setYearFilter(Number(e.target.value))}
            >
              <MenuItem value={2026}>2026</MenuItem>

              <MenuItem value={2027}>2027</MenuItem>

              <MenuItem value={2028}>2028</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: 0, sm: 180 } }}>
            <InputLabel>Month</InputLabel>

            <Select
              value={monthFilter}
              label="Month"
              onChange={(e) => setMonthFilter(e.target.value)}
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

          <FormControl sx={{ minWidth: { xs: 0, sm: 180 } }}>
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

              <MenuItem value={5}>Week 5</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

        {loading ? (
          <Paper
            sx={{ display: "grid", placeItems: "center", minHeight: 300 }}
          >
            <CircularProgress aria-label="Loading schedules" />
          </Paper>
        ) : compact ? (
          <Stack spacing={1.5} aria-label="Schedules">
            {filteredSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule._id}
                center={schedule.branch?.name}
                detail={[`Week ${schedule.week}`, schedule.branch?.region, schedule.level].filter(Boolean).join(" · ")}
                course={[schedule.course?.code, schedule.course?.name].filter(Boolean).join(" · ")}
                note={[schedule.lecturer?.name || "Unassigned lecturer", schedule.lecturer?.phone].filter(Boolean).join(" · ")}
                status={<Chip label={schedule.status} color={statusColor(schedule.status)} size="small" />}
                action="Edit schedule"
                onAction={() => editSchedule(schedule)}
              />
            ))}
            {filteredSchedules.length === 0 && <Alert severity="info">No schedules found.</Alert>}
          </Stack>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Week</b>
                  </TableCell>

                  <TableCell>
                    <b>Center</b>
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
                    <TableCell colSpan={8} align="center">
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
                          onClick={() => editSchedule(schedule)}
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
      {/* Conditionally render Unassigned Classes section */}
      {pendingAssignments.length > 0 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Unassigned Classes
          </Typography>

          {compact ? (
            <Stack spacing={1.5}>
              {pendingAssignments.map((item) => (
                <ScheduleCard
                  key={item._id}
                  center={item.branch?.name}
                  detail={item.level}
                  course={[item.suggestedCourse?.code, item.suggestedCourse?.name].filter(Boolean).join(" · ")}
                  note={item.reason}
                  action="Assign class"
                  onAction={() => assignSchedule(item)}
                />
              ))}
            </Stack>
          ) : (
          <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Center</TableCell>

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
                      onClick={() => assignSchedule(item)}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
          )}
        </Paper>
      )}
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
      <NotifyWeekDialog
        open={notifyDialogOpen}
        onClose={() => setNotifyDialogOpen(false)}
        week={weekFilter}
        month={monthFilter}
        year={yearFilter}
        schedulesCount={
          filteredSchedules.filter((schedule) => schedule.status === "APPROVED")
            .length
        }
        onSuccess={(result) => {
          setSnackbarSeverity(result.failed > 0 ? "warning" : "success");

          setSnackbarMessage(
            `${result.sent} SMS notification${
              result.sent === 1 ? "" : "s"
            } sent successfully. ${result.failed} failed.`,
          );

          setSnackbarOpen(true);
        }}
      />
      <PrintExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        month={monthFilter}
        year={yearFilter}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
