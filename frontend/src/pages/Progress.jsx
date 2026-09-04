import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
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

import {
  getBranchProgress,
  removeCompletedCourses,
} from "../services/progressService";

import ManualProgressDialog from "../components/dialogs/ManualProgressDialog";

export default function Progress() {
  // ==================================================
  // BASIC STATE
  // ==================================================

  const [branches, setBranches] = useState([]);

  const [selectedBranch, setSelectedBranch] =
    useState("");

  const [progress, setProgress] = useState(null);

  const [loadingBranches, setLoadingBranches] =
    useState(true);

  const [loadingProgress, setLoadingProgress] =
    useState(false);

  const [error, setError] = useState("");

  // ==================================================
  // MANUAL PROGRESS STATE
  // ==================================================

  const [manualDialogOpen, setManualDialogOpen] =
    useState(false);

  const [selectedProgressId, setSelectedProgressId] =
    useState(null);

  const [selectedCourses, setSelectedCourses] =
    useState([]);

  // ==================================================
  // COURSE SELECTION STATE
  // ==================================================

  const [selectedRemaining, setSelectedRemaining] =
    useState({});

  const [selectedCompleted, setSelectedCompleted] =
    useState({});

  // ==================================================
  // LOAD BRANCHES
  // ==================================================

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
      console.error(
        "LOAD BRANCHES ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load branches."
      );
    } finally {
      setLoadingBranches(false);
    }
  };

  // ==================================================
  // LOAD PROGRESS
  // ==================================================

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
      console.error(
        "LOAD PROGRESS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load branch progress."
      );
    } finally {
      setLoadingProgress(false);
    }
  };

  // ==================================================
  // REMAINING COURSE SELECTION
  // ==================================================

  const toggleRemainingCourse = (
    level,
    courseId
  ) => {
    setSelectedRemaining((previous) => {
      const current =
        previous[level] || [];

      const exists =
        current.includes(courseId);

      return {
        ...previous,

        [level]: exists
          ? current.filter(
              (id) => id !== courseId
            )
          : [...current, courseId],
      };
    });
  };

  // ==================================================
  // COMPLETED COURSE SELECTION
  // ==================================================

  const toggleCompletedCourse = (
    level,
    courseId
  ) => {
    setSelectedCompleted((previous) => {
      const current =
        previous[level] || [];

      const exists =
        current.includes(courseId);

      return {
        ...previous,

        [level]: exists
          ? current.filter(
              (id) => id !== courseId
            )
          : [...current, courseId],
      };
    });
  };

  // ==================================================
  // SELECT ALL REMAINING
  // ==================================================

  const selectAllRemaining = (
    level,
    courses
  ) => {
    setSelectedRemaining((previous) => ({
      ...previous,

      [level]: courses.map(
        (course) => course._id
      ),
    }));
  };

  // ==================================================
  // CLEAR REMAINING SELECTION
  // ==================================================

  const clearRemainingSelection = (
    level
  ) => {
    setSelectedRemaining((previous) => ({
      ...previous,

      [level]: [],
    }));
  };

  // ==================================================
  // CLEAR COMPLETED SELECTION
  // ==================================================

  const clearCompletedSelection = (
    level
  ) => {
    setSelectedCompleted((previous) => ({
      ...previous,

      [level]: [],
    }));
  };

  // ==================================================
  // MARK SELECTED COURSES COMPLETE
  // ==================================================

  const handleMarkSelectedComplete = (
    level,
    data
  ) => {
    const selectedIds =
      selectedRemaining[level] || [];

    if (selectedIds.length === 0) {
      alert(
        "Please select at least one course."
      );

      return;
    }

    const courses =
      data.remainingCourses.filter(
        (course) =>
          selectedIds.includes(course._id)
      );

    if (courses.length === 0) {
      alert(
        "No valid courses selected."
      );

      return;
    }

    if (!data.progressId) {
      alert(
        "This level does not have a progress record."
      );

      return;
    }

    setSelectedCourses(courses);

    setSelectedProgressId(
      data.progressId
    );

    setManualDialogOpen(true);
  };

  // ==================================================
  // UNDO SELECTED COMPLETED COURSES
  // ==================================================

  const handleUndoSelected = async (
    level
  ) => {
    const selectedIds =
      selectedCompleted[level] || [];

    if (selectedIds.length === 0) {
      alert(
        "Please select at least one completed course."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${selectedIds.length} course(s) from completed progress?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const levelData =
        progress.levels[level];

      if (!levelData?.progressId) {
        setError(
          "Progress record not found for this level."
        );

        return;
      }

      await removeCompletedCourses(
        levelData.progressId,
        selectedIds
      );

      clearCompletedSelection(level);

      await loadProgress(
        selectedBranch
      );
    } catch (err) {
      console.error(
        "UNDO PROGRESS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to remove completed courses."
      );
    }
  };

  // ==================================================
  // BRANCH CHANGE
  // ==================================================

  const handleBranchChange = (event) => {
    const branchId =
      event.target.value;

    setSelectedBranch(branchId);

    setSelectedRemaining({});

    setSelectedCompleted({});

    setSelectedCourses([]);

    setSelectedProgressId(null);
  };

  // ==================================================
  // LOADING BRANCHES
  // ==================================================

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

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <Box>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

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
            onChange={handleBranchChange}
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

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* ==================================================
          PROGRESS LOADING
      ================================================== */}

      {loadingProgress ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <CircularProgress />
        </Box>
      ) : !progress ? (
        <Paper sx={{ p: 4 }}>
          <Typography
            color="text.secondary"
            align="center"
          >
            No progress information available.
          </Typography>
        </Paper>
      ) : (
        <>

          {/* ==================================================
              BRANCH OVERVIEW
          ================================================== */}

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

                <Typography color="text.secondary">
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

                    <Typography fontWeight="bold">
                      {
                        progress.overall
                          ?.percentage
                      }%
                    </Typography>

                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={
                      progress.overall
                        ?.percentage || 0
                    }
                    sx={{
                      height: 12,
                      borderRadius: 6,
                    }}
                  />

                </Stack>

              </Box>

            </Stack>

            {/* ==================================================
                OVERALL STATISTICS
            ================================================== */}

            <Grid
              container
              spacing={2}
              sx={{ mt: 2 }}
            >

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Card variant="outlined">
                  <CardContent>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall
                          ?.completed || 0
                      }
                    </Typography>

                    <Typography color="text.secondary">
                      Completed Courses
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Card variant="outlined">
                  <CardContent>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall
                          ?.remaining || 0
                      }
                    </Typography>

                    <Typography color="text.secondary">
                      Remaining Courses
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
              >
                <Card variant="outlined">
                  <CardContent>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {
                        progress.overall
                          ?.total || 0
                      }
                    </Typography>

                    <Typography color="text.secondary">
                      Total Courses
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>

            </Grid>

          </Paper>

          {/* ==================================================
              PROGRESS BY LEVEL
          ================================================== */}

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
              progress.levels || {}
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
                      value={
                        data.percentage || 0
                      }
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

          {/* ==================================================
              COURSE PROGRESS
          ================================================== */}

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
            progress.levels || {}
          ).map(([level, data]) => {

            const remainingSelected =
              selectedRemaining[level] ||
              [];

            const completedSelected =
              selectedCompleted[level] ||
              [];

            const remainingCourses =
              data.remainingCourses || [];

            const completedCourses =
              data.completedCourses || [];

            const allRemainingSelected =
              remainingCourses.length > 0 &&
              remainingSelected.length ===
                remainingCourses.length;

            return (
              <Paper
                key={level}
                sx={{
                  p: 3,
                  mb: 3,
                }}
              >

                {/* ==================================================
                    LEVEL HEADER
                ================================================== */}

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
                      variant="h6"
                      fontWeight="bold"
                    >
                      {level}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {data.completed} /{" "}
                      {data.total} completed
                      {" • "}
                      {data.percentage}%
                    </Typography>

                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                  >

                    {remainingCourses.length >
                      0 && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {

                            if (
                              allRemainingSelected
                            ) {
                              clearRemainingSelection(
                                level
                              );
                            } else {
                              selectAllRemaining(
                                level,
                                remainingCourses
                              );
                            }

                          }}
                        >
                          {allRemainingSelected
                            ? "Clear Selection"
                            : "Select All Remaining"}
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          disabled={
                            remainingSelected.length ===
                            0
                          }
                          onClick={() =>
                            handleMarkSelectedComplete(
                              level,
                              data
                            )
                          }
                        >
                          Mark Selected Complete
                          {remainingSelected.length >
                            0 &&
                            ` (${remainingSelected.length})`}
                        </Button>

                      </>
                    )}

                    {completedSelected.length >
                      0 && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() =>
                          handleUndoSelected(
                            level
                          )
                        }
                      >
                        Undo Selected (
                        {
                          completedSelected.length
                        }
                        )
                      </Button>
                    )}

                  </Stack>

                </Stack>

                {/* ==================================================
                    COURSES
                ================================================== */}

                <Grid
                  container
                  spacing={3}
                >

                  {/* ==================================================
                      COMPLETED
                  ================================================== */}

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

                    {completedCourses.length >
                    0 ? (
                      <Stack spacing={1}>

                        {completedCourses.map(
                          (item, index) => {

                            const courseId =
                              item.course?._id;

                            const isSelected =
                              completedSelected.includes(
                                courseId
                              );

                            return (
                              <Box
                                key={
                                  courseId ||
                                  index
                                }
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor:
                                    isSelected
                                      ? "error.50"
                                      : "success.50",
                                  border:
                                    "1px solid",
                                  borderColor:
                                    isSelected
                                      ? "error.light"
                                      : "success.light",
                                  display: "flex",
                                  alignItems:
                                    "flex-start",
                                }}
                              >

                                <Checkbox
                                  size="small"
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    toggleCompletedCourse(
                                      level,
                                      courseId
                                    )
                                  }
                                />

                                <Box
                                  sx={{
                                    pt: 0.5,
                                  }}
                                >

                                  <Typography
                                    fontWeight="bold"
                                  >
                                    {
                                      item
                                        .course
                                        ?.code
                                    }
                                  </Typography>

                                  <Typography variant="body2">
                                    {
                                      item
                                        .course
                                        ?.name
                                    }
                                  </Typography>

                                  {item.completedDate && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      Completed:{" "}
                                      {new Date(
                                        item.completedDate
                                      ).toLocaleDateString()}
                                    </Typography>
                                  )}

                                  {item.manuallyCompleted && (
                                    <Chip
                                      label="Manual"
                                      size="small"
                                      color="info"
                                      sx={{
                                        mt: 0.5,
                                      }}
                                    />
                                  )}

                                </Box>

                              </Box>
                            );
                          }
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

                  {/* ==================================================
                      REMAINING
                  ================================================== */}

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

                    {remainingCourses.length >
                    0 ? (
                      <Stack spacing={1}>

                        {remainingCourses.map(
                          (course) => {

                            const isSelected =
                              remainingSelected.includes(
                                course._id
                              );

                            return (
                              <Box
                                key={course._id}
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor:
                                    isSelected
                                      ? "primary.50"
                                      : "action.hover",
                                  border:
                                    "1px solid",
                                  borderColor:
                                    isSelected
                                      ? "primary.main"
                                      : "transparent",
                                  display: "flex",
                                  alignItems:
                                    "flex-start",
                                }}
                              >

                                <Checkbox
                                  size="small"
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    toggleRemainingCourse(
                                      level,
                                      course._id
                                    )
                                  }
                                />

                                <Box
                                  sx={{
                                    pt: 0.5,
                                  }}
                                >

                                  <Typography
                                    fontWeight="bold"
                                  >
                                    {course.code}
                                  </Typography>

                                  <Typography variant="body2">
                                    {course.name}
                                  </Typography>

                                </Box>

                              </Box>
                            );
                          }
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
            );
          })}

        </>
      )}

      {/* ==================================================
          MANUAL PROGRESS DIALOG
      ================================================== */}

      <ManualProgressDialog
        open={manualDialogOpen}

        onClose={() => {
          setManualDialogOpen(false);

          setSelectedCourses([]);

          setSelectedProgressId(null);
        }}

        progressId={
          selectedProgressId
        }

        courses={selectedCourses}

        onCompleted={() => {
          setManualDialogOpen(false);

          setSelectedCourses([]);

          setSelectedProgressId(null);

          setSelectedRemaining({});

          setSelectedCompleted({});

          loadProgress(
            selectedBranch
          );
        }}
      />

    </Box>
  );
}