import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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

import { getBranches } from "../services/branchService";
import { getBranchProgress } from "../services/progressService";

export default function Progress() {
  const [branches, setBranches] = useState([]);

  const [selectedBranch, setSelectedBranch] =
    useState("");

  const [progress, setProgress] =
    useState(null);

  const [loadingBranches, setLoadingBranches] =
    useState(true);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  const [error, setError] =
    useState("");

  // --------------------------------------------------
  // Load branches
  // --------------------------------------------------

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoadingBranches(true);
      setError("");

      const data = await getBranches();

      setBranches(data);

      if (data.length > 0) {
        setSelectedBranch(data[0]._id);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load branches."
      );
    } finally {
      setLoadingBranches(false);
    }
  };

  // --------------------------------------------------
  // Load progress
  // --------------------------------------------------

  useEffect(() => {
    if (!selectedBranch) {
      return;
    }

    loadProgress(selectedBranch);
  }, [selectedBranch]);

  const loadProgress = async (branchId) => {
    try {
      setLoadingProgress(true);
      setError("");

      const data =
        await getBranchProgress(branchId);

      setProgress(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load branch progress."
      );
    } finally {
      setLoadingProgress(false);
    }
  };

  // --------------------------------------------------
  // Loading branches
  // --------------------------------------------------

  if (loadingBranches) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* ============================================ */}
      {/* PAGE HEADER */}
      {/* ============================================ */}

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
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Branch Progress
          </Typography>

          <Typography color="text.secondary">
            Track academic progress by branch
            and level.
          </Typography>
        </Box>

        <FormControl
          sx={{
            minWidth: 280,
          }}
        >
          <InputLabel>
            Select Branch
          </InputLabel>

          <Select
            value={selectedBranch}
            label="Select Branch"
            onChange={(e) =>
              setSelectedBranch(
                e.target.value
              )
            }
          >
            {branches.map((branch) => (
              <MenuItem
                key={branch._id}
                value={branch._id}
              >
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* ============================================ */}
      {/* ERROR */}
      {/* ============================================ */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* ============================================ */}
      {/* LOADING */}
      {/* ============================================ */}

      {loadingProgress ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <CircularProgress />
        </Box>
      ) : progress ? (
        <>
          {/* ======================================== */}
          {/* BRANCH OVERVIEW */}
          {/* ======================================== */}

          <Paper
            sx={{
              p: 3,
              mb: 3,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              spacing={3}
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                >
                  {progress.branch?.name}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  {progress.branch?.region}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 350,
                  },
                }}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography>
                      Overall Progress
                    </Typography>

                    <Typography
                      fontWeight="bold"
                    >
                      {progress.overall.percentage}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      progress.overall
                        .percentage
                    }
                    sx={{
                      height: 12,
                      borderRadius: 6,
                    }}
                  />
                </Stack>
              </Box>
            </Stack>

            {/* Overall statistics */}

            <Grid
              container
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Grid item xs={12} sm={4}>
                <Card
                  variant="outlined"
                >
                  <CardContent>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall
                          .completed
                      }
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Completed Courses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card
                  variant="outlined"
                >
                  <CardContent>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall
                          .remaining
                      }
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Remaining Courses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Card
                  variant="outlined"
                >
                  <CardContent>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall.total
                      }
                    </Typography>

                    <Typography
                      color="text.secondary"
                    >
                      Total Courses
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* ======================================== */}
          {/* LEVEL PROGRESS */}
          {/* ======================================== */}

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Progress by Level
          </Typography>

          <Grid
            container
            spacing={3}
          >
            {Object.entries(
              progress.levels
            ).map(([level, data]) => (
              <Grid
                item
                xs={12}
                md={4}
                key={level}
              >
                <Card
                  sx={{
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {level}
                      </Typography>

                      <Chip
                        label={`${data.percentage}%`}
                        color={
                          data.percentage === 100
                            ? "success"
                            : "primary"
                        }
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {data.completed} /{" "}
                      {data.total} courses
                      completed
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={data.percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        mb: 2,
                      }}
                    />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {data.remaining} courses
                      remaining
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ======================================== */}
          {/* COURSE DETAILS */}
          {/* ======================================== */}

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mt: 4,
              mb: 2,
            }}
          >
            Course Progress
          </Typography>

          {Object.entries(
            progress.levels
          ).map(([level, data]) => (
            <Paper
              key={level}
              sx={{
                p: 3,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {level}
              </Typography>

              <Grid
                container
                spacing={2}
              >
                {/* Completed */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <Typography
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    Completed Courses
                  </Typography>

                  {data.completedCourses
                    ?.length > 0 ? (
                    <Stack spacing={1}>
                      {data.completedCourses.map(
                        (item, index) => (
                          <Box
                            key={
                              item.course?._id ||
                              index
                            }
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                "success.50",
                              border:
                                "1px solid",
                              borderColor:
                                "success.light",
                            }}
                          >
                            <Typography
                              fontWeight="bold"
                            >
                              {
                                item.course
                                  ?.code
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                            >
                              {
                                item.course
                                  ?.name
                              }
                            </Typography>

                            {item.completedDate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Completed:{" "}
                                {new Date(
                                  item.completedDate
                                ).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        )
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      color="text.secondary"
                    >
                      No courses completed yet.
                    </Typography>
                  )}
                </Grid>

                {/* Remaining */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  <Typography
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    Remaining Courses
                  </Typography>

                  {data.remainingCourses
                    ?.length > 0 ? (
                    <Stack spacing={1}>
                      {data.remainingCourses.map(
                        (course) => (
                          <Box
                            key={course._id}
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor:
                                "action.hover",
                            }}
                          >
                            <Typography
                              fontWeight="bold"
                            >
                              {course.code}
                            </Typography>

                            <Typography
                              variant="body2"
                            >
                              {course.name}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Stack>
                  ) : (
                    <Typography
                      color="success.main"
                      fontWeight="bold"
                    >
                      All courses completed.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}
        </>
      ) : (
        <Paper sx={{ p: 4 }}>
          <Typography>
            Select a branch to view progress.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}