import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  getCourses,
  deleteCourse,
} from "../services/courseService";

import AddCourseDialog from "../components/dialogs/AddCourseDialog";
import EditCourseDialog from "../components/dialogs/EditCourseDialog";

export default function Courses() {
  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [levelFilter, setLevelFilter] =
    useState("ALL");

  const [addDialogOpen, setAddDialogOpen] =
    useState(false);

  const [editDialogOpen, setEditDialogOpen] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCourses();

      setCourses(data || []);
    } catch (error) {
      console.error(
        "LOAD COURSES ERROR:",
        error
      );

      setError(
        "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return courses.filter(
        (course) => {
          const matchesSearch =
            !query ||
            course.code
              ?.toLowerCase()
              .includes(query) ||
            course.name
              ?.toLowerCase()
              .includes(query);

          const matchesLevel =
            levelFilter === "ALL" ||
            course.level === levelFilter;

          return (
            matchesSearch &&
            matchesLevel
          );
        }
      );
    }, [
      courses,
      search,
      levelFilter,
    ]);

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setEditDialogOpen(true);
  };

  const handleDelete = async (
    course
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${course.code} - ${course.name}"?`
      );

    if (!confirmed) return;

    try {
      await deleteCourse(
        course._id
      );

      await loadCourses();
    } catch (error) {
      console.error(
        "DELETE COURSE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete course."
      );
    }
  };

  const getLevelLabel = (
    level
  ) => {
    switch (level) {
      case "CERTIFICATE":
        return "Certificate";

      case "ASSOCIATE":
        return "Associate";

      case "DIPLOMA":
        return "Diploma";

      default:
        return level;
    }
  };

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
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Courses
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage courses, codes and
            academic levels.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setAddDialogOpen(true)
          }
        >
          Add Course
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Filters */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Search courses"
            placeholder="Search by code or name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <FormControl
            sx={{
              minWidth: 220,
            }}
          >
            <InputLabel>
              Level
            </InputLabel>

            <Select
              value={levelFilter}
              label="Level"
              onChange={(e) =>
                setLevelFilter(
                  e.target.value
                )
              }
            >
              <MenuItem value="ALL">
                All Levels
              </MenuItem>

              <MenuItem value="CERTIFICATE">
                Certificate
              </MenuItem>

              <MenuItem value="ASSOCIATE">
                Associate
              </MenuItem>

              <MenuItem value="DIPLOMA">
                Diploma
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Course Table */}

      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              py: 8,
              display: "flex",
              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Code</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Course Name</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Level</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCourses.length ===
                0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                    >
                      <Typography
                        color="text.secondary"
                        sx={{ py: 4 }}
                      >
                        No courses found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map(
                    (course, index) => (
                      <TableRow
                        key={
                          course._id
                        }
                        hover
                      >
                        <TableCell>
                          {index + 1}
                        </TableCell>

                        <TableCell>
                          <Typography fontWeight="bold">
                            {course.code}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {course.name}
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={getLevelLabel(
                              course.level
                            )}
                            size="small"
                            color="primary"
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleEdit(
                                course
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>

                          {/* <IconButton
                            color="error"
                            onClick={() =>
                              handleDelete(
                                course
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton> */}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add Course */}

      <AddCourseDialog
        open={addDialogOpen}
        onClose={() =>
          setAddDialogOpen(false)
        }
        onCreated={() => {
          loadCourses();
        }}
      />

      {/* Edit Course */}

      <EditCourseDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onUpdated={() => {
          loadCourses();
        }}
      />
    </Container>
  );
}