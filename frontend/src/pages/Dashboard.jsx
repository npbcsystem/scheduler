import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import {
  Business,
  Groups,
  Event,
  Warning,
  School,
  TrendingUp,
  CheckCircle,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

import { getBranches } from "../services/branchService";
import { getLecturers } from "../services/lecturerService";
import { getSchedules } from "../services/scheduleService";
import { getProgress } from "../services/progressService";
import { getPendingAssignments } from "../services/pendingAssignmentService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [branches, setBranches] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  // --------------------------------------------------
  // Load dashboard data
  // --------------------------------------------------

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        branchesData,
        lecturersData,
        schedulesData,
        progressData,
        pendingData,
      ] = await Promise.all([
        getBranches(),
        getLecturers(),
        getSchedules(),
        getProgress(),
        getPendingAssignments(),
      ]);

      setBranches(branchesData || []);
      setLecturers(lecturersData || []);
      setSchedules(schedulesData || []);
      setProgress(progressData || []);
      setPendingAssignments(pendingData || []);
    } catch (err) {
      console.error("DASHBOARD ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // --------------------------------------------------
  // Active branches / lecturers
  // --------------------------------------------------

  const activeBranches = useMemo(
    () =>
      branches.filter(
        (branch) => branch.active !== false
      ),
    [branches]
  );

  const activeLecturers = useMemo(
    () =>
      lecturers.filter(
        (lecturer) => lecturer.active !== false
      ),
    [lecturers]
  );

  // --------------------------------------------------
  // Month/year schedules
  // --------------------------------------------------

  const monthSchedules = useMemo(() => {
    return schedules.filter(
      (schedule) =>
        Number(schedule.month) ===
          Number(selectedMonth) &&
        Number(schedule.year) ===
          Number(selectedYear)
    );
  }, [
    schedules,
    selectedMonth,
    selectedYear,
  ]);

  // --------------------------------------------------
  // Schedule status counts
  // --------------------------------------------------

  const draftCount = monthSchedules.filter(
    (schedule) => schedule.status === "DRAFT"
  ).length;

  const approvedCount = monthSchedules.filter(
    (schedule) => schedule.status === "APPROVED"
  ).length;

  const completedCount = monthSchedules.filter(
    (schedule) => schedule.status === "COMPLETED"
  ).length;

  const cancelledCount = monthSchedules.filter(
    (schedule) => schedule.status === "CANCELLED"
  ).length;

  // --------------------------------------------------
  // Progress
  // --------------------------------------------------

  const overallProgress = useMemo(() => {
    if (!progress.length) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
      };
    }

    let completed = 0;
    let total = 0;

    progress.forEach((item) => {
      completed +=
        item.completedCourses?.length || 0;
    });

    // There are 36 courses across the three levels
    // based on the current NPBC course structure.
    const branchCount = branches.length;

    total = branchCount * 36;

    const percentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    return {
      completed,
      total,
      percentage,
    };
  }, [progress, branches]);

  // --------------------------------------------------
  // Week statistics
  // --------------------------------------------------

  const weekStats = [1, 2, 3, 4].map(
    (week) => {
      const weekSchedules =
        monthSchedules.filter(
          (schedule) =>
            Number(schedule.week) === week
        );

      return {
        week,
        total: weekSchedules.length,
        approved:
          weekSchedules.filter(
            (schedule) =>
              schedule.status === "APPROVED"
          ).length,
        completed:
          weekSchedules.filter(
            (schedule) =>
              schedule.status === "COMPLETED"
          ).length,
      };
    }
  );

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const percentage = (
    value,
    total
  ) => {
    if (!total) return 0;

    return Math.round(
      (value / total) * 100
    );
  };

  const statusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";

      case "COMPLETED":
        return "primary";

      case "DRAFT":
        return "warning";

      case "CANCELLED":
        return "error";

      default:
        return "default";
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />
            <Typography color="text.secondary">
              Loading dashboard...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  // --------------------------------------------------
  // Dashboard
  // --------------------------------------------------

  return (
    <Container
      maxWidth="xl"
      sx={{ pb: 5 }}
    >
      {/* Header */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            NPBC Scheduler Management
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={2}
        >
          <FormControl
            size="small"
            sx={{ minWidth: 120 }}
          >
            <InputLabel>Year</InputLabel>

            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) =>
                setSelectedYear(
                  Number(e.target.value)
                )
              }
            >
              <MenuItem value={2026}>
                2026
              </MenuItem>

              <MenuItem value={2027}>
                2027
              </MenuItem>

              <MenuItem value={2028}>
                2028
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ minWidth: 140 }}
          >
            <InputLabel>Month</InputLabel>

            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) =>
                setSelectedMonth(
                  Number(e.target.value)
                )
              }
            >
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map(
                (month, index) => (
                  <MenuItem
                    key={month}
                    value={index + 1}
                  >
                    {month}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={loadDashboard}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Summary Cards */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Active Branches"
            value={activeBranches.length}
            icon={<Business />}
            subtitle={`${branches.length} total`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Active Lecturers"
            value={activeLecturers.length}
            icon={<Groups />}
            subtitle={`${lecturers.length} total`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Scheduled Classes"
            value={monthSchedules.length}
            icon={<Event />}
            subtitle="Selected month"
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Approved"
            value={approvedCount}
            icon={<CheckCircle />}
            subtitle={`${percentage(
              approvedCount,
              monthSchedules.length
            )}% of schedules`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Completed"
            value={completedCount}
            icon={<School />}
            subtitle={`${percentage(
              completedCount,
              monthSchedules.length
            )}% completed`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={2}
        >
          <SummaryCard
            title="Unassigned"
            value={pendingAssignments.length}
            icon={<Warning />}
            subtitle="Needs attention"
            danger={
              pendingAssignments.length > 0
            }
          />
        </Grid>
      </Grid>

      {/* Main Content */}

      <Grid
        container
        spacing={3}
      >
        {/* Monthly Schedule */}

        <Grid
          item
          xs={12}
          md={8}
        >
          <Paper
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 3,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Monthly Schedule
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Schedule status by week
                </Typography>
              </Box>

              <Chip
                label={`${monthSchedules.length} classes`}
                color="primary"
              />
            </Stack>

            <Stack spacing={2.5}>
              {weekStats.map(
                (item) => {
                  const completion =
                    percentage(
                      item.completed,
                      item.total
                    );

                  return (
                    <Box
                      key={item.week}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          mb: 0.8,
                        }}
                      >
                        <Typography fontWeight="bold">
                          Week{" "}
                          {item.week}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {item.total}{" "}
                          classes
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={completion}
                        sx={{
                          height: 9,
                          borderRadius: 5,
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          mt: 1,
                        }}
                      >
                        <Chip
                          size="small"
                          label={`Approved ${item.approved}`}
                          color="success"
                          variant="outlined"
                        />

                        <Chip
                          size="small"
                          label={`Completed ${item.completed}`}
                          color="primary"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                  );
                }
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Overall Progress */}

        <Grid
          item
          xs={12}
          md={4}
        >
          <Paper
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Overall Academic Progress
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Across all branches
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 170,
                  height: 170,
                  borderRadius: "50%",
                  border: "14px solid",
                  borderColor:
                    "primary.main",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  flexDirection:
                    "column",
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                >
                  {
                    overallProgress.percentage
                  }
                  %
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Complete
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Completed
                </Typography>

                <Typography fontWeight="bold">
                  {
                    overallProgress.completed
                  }
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Total Courses
                </Typography>

                <Typography fontWeight="bold">
                  {
                    overallProgress.total
                  }
                </Typography>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography>
                  Remaining
                </Typography>

                <Typography fontWeight="bold">
                  {Math.max(
                    overallProgress.total -
                      overallProgress.completed,
                    0
                  )}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Schedule Status */}

        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              Schedule Status
            </Typography>

            <Stack spacing={2}>
              <StatusRow
                label="Draft"
                value={draftCount}
                total={monthSchedules.length}
                color="warning"
              />

              <StatusRow
                label="Approved"
                value={approvedCount}
                total={monthSchedules.length}
                color="success"
              />

              <StatusRow
                label="Completed"
                value={completedCount}
                total={monthSchedules.length}
                color="primary"
              />

              <StatusRow
                label="Cancelled"
                value={cancelledCount}
                total={monthSchedules.length}
                color="error"
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Attention */}

        <Grid
          item
          xs={12}
          md={6}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              Attention Required
            </Typography>

            <Stack spacing={2}>
              <AttentionRow
                icon={<Warning />}
                label="Unassigned Classes"
                value={
                  pendingAssignments.length
                }
                danger={
                  pendingAssignments.length >
                  0
                }
              />

              <AttentionRow
                icon={<Groups />}
                label="Inactive Lecturers"
                value={
                  lecturers.filter(
                    (lecturer) =>
                      lecturer.active ===
                      false
                  ).length
                }
              />

              <AttentionRow
                icon={<Business />}
                label="Inactive Branches"
                value={
                  branches.filter(
                    (branch) =>
                      branch.active ===
                      false
                  ).length
                }
              />

              <AttentionRow
                icon={<ScheduleIcon />}
                label="Awaiting Approval"
                value={draftCount}
                danger={
                  draftCount > 0
                }
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// ==================================================
// Summary Card
// ==================================================

function SummaryCard({
  title,
  value,
  icon,
  subtitle,
  danger = false,
}) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: danger
          ? "error.light"
          : "divider",
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                bgcolor: danger
                  ? "error.lighter"
                  : "primary.lighter",
                color: danger
                  ? "error.main"
                  : "primary.main",
              }}
            >
              {icon}
            </Box>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ==================================================
// Status Row
// ==================================================

function StatusRow({
  label,
  value,
  total,
  color,
}) {
  const percentageValue =
    percentageHelper(value, total);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 0.7 }}
      >
        <Typography>
          {label}
        </Typography>

        <Typography fontWeight="bold">
          {value}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentageValue}
        color={color}
        sx={{
          height: 8,
          borderRadius: 5,
        }}
      />
    </Box>
  );
}

// ==================================================
// Attention Row
// ==================================================

function AttentionRow({
  icon,
  label,
  value,
  danger = false,
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
      >
        <Box
          sx={{
            display: "flex",
            color: danger
              ? "error.main"
              : "text.secondary",
          }}
        >
          {icon}
        </Box>

        <Typography>
          {label}
        </Typography>
      </Stack>

      <Chip
        label={value}
        color={
          danger
            ? "error"
            : "default"
        }
        size="small"
      />
    </Stack>
  );
}

function percentageHelper(
  value,
  total
) {
  if (!total) return 0;

  return Math.round(
    (value / total) * 100
  );
}