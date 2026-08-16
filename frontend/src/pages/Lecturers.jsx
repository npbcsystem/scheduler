import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

import AddLecturerDialog from "../components/dialogs/AddLecturerDialog";
import EditLecturerDialog from "../components/dialogs/EditLecturerDialog";

import { getLecturers } from "../services/lecturerService";

const Lecturers = () => {
  // ---------------------------------------------
  // State
  // ---------------------------------------------

  const [lecturers, setLecturers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ---------------------------------------------
  // Load lecturers
  // ---------------------------------------------

  useEffect(() => {
    loadLecturers();
  }, []);

  const loadLecturers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLecturers();

      setLecturers(data);
    } catch (err) {
      console.error("LOAD LECTURERS ERROR:", err);

      setError(err.response?.data?.message || "Unable to load lecturers.");
    } finally {
      setLoading(false);
    }
  };

  const availableCourses = Array.from(
    new Map(
      lecturers
        .flatMap((lecturer) => lecturer.courses || [])
        .filter((course) => typeof course === "object")
        .map((course) => [course._id, course]),
    ).values(),
  ).sort((a, b) => a.code.localeCompare(b.code));

  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchText = search.toLowerCase().trim();

    const courseText = (lecturer.courses || [])
      .map((course) =>
        typeof course === "object"
          ? `${course.code || ""} ${course.name || ""}`
          : course,
      )
      .join(" ")
      .toLowerCase();

    const preferredRegionText = (lecturer.preferredRegions || [])
      .join(" ")
      .toLowerCase();

    const secondaryRegionText = (lecturer.secondaryRegions || [])
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !searchText ||
      lecturer.name?.toLowerCase().includes(searchText) ||
      lecturer.phone?.toLowerCase().includes(searchText) ||
      courseText.includes(searchText) ||
      preferredRegionText.includes(searchText) ||
      secondaryRegionText.includes(searchText);

    const matchesCourse =
      courseFilter === "ALL" ||
      (lecturer.courses || []).some(
        (course) => typeof course === "object" && course._id === courseFilter,
      );

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && lecturer.active) ||
      (statusFilter === "INACTIVE" && !lecturer.active);

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // ---------------------------------------------
  // Edit lecturer
  // ---------------------------------------------

  const handleEditLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);

    setEditDialogOpen(true);
  };

  // ---------------------------------------------
  // Render
  // ---------------------------------------------

  return (
    <Container maxWidth="xl">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

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
          <Typography variant="h4" fontWeight="bold">
            Lecturers
          </Typography>

          <Typography color="text.secondary">
            Manage lecturers, courses, regions and teaching capacity.
          </Typography>
        </Box>

        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add Lecturer
        </Button>
      </Stack>

      {/* ========================================= */}
      {/* ERROR */}
      {/* ========================================= */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
        >
          <TextField
            fullWidth
            label="Search Lecturers"
            placeholder="Name, phone, course or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl sx={{ minWidth: 260 }}>
            <InputLabel>Course</InputLabel>

            <Select
              value={courseFilter}
              label="Course"
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Courses</MenuItem>

              {availableCourses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Status</MenuItem>

              <MenuItem value="ACTIVE">Active</MenuItem>

              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            aria-label="clear filters"
            color="primary"
            onClick={() => {
              setSearch("");
              setCourseFilter("ALL");
              setStatusFilter("ALL");
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* ========================================= */}
      {/* LECTURER TABLE */}
      {/* ========================================= */}

      <Paper>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>

                  <TableCell>
                    <b>Phone</b>
                  </TableCell>

                  <TableCell>
                    <b>Courses</b>
                  </TableCell>

                  <TableCell>
                    <b>Preferred Regions</b>
                  </TableCell>

                  <TableCell>
                    <b>Assignments</b>
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
                {filteredLecturers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No lecturers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLecturers.map((lecturer) => (
                    <TableRow key={lecturer._id} hover>
                      {/* Name */}

                      <TableCell>
                        <Typography fontWeight="bold">
                          {lecturer.name}
                        </Typography>
                      </TableCell>

                      {/* Phone */}

                      <TableCell>{lecturer.phone || "-"}</TableCell>

                      {/* Courses */}

                      <TableCell
                        sx={{
                          width: 320,
                          minWidth: 320,
                          maxWidth: 320,
                        }}
                      >
                        <Box
                          sx={{
                            maxHeight: 110,
                            overflowY: "auto",
                            overflowX: "hidden",
                            pr: 1,
                          }}
                        >
                          <Stack direction="row" spacing={0.5} flexWrap="wrap">
                            {(lecturer.courses || []).map((course) => {
                              const courseName =
                                typeof course === "object"
                                  ? `${course.code || ""} ${course.name || ""}`
                                  : course;

                              return (
                                <Chip
                                  key={
                                    typeof course === "object"
                                      ? course._id
                                      : course
                                  }
                                  label={courseName}
                                  size="small"
                                  sx={{
                                    mb: 0.5,
                                    maxWidth: "100%",
                                  }}
                                />
                              );
                            })}
                          </Stack>
                        </Box>
                      </TableCell>

                      {/* Preferred Regions */}

                      <TableCell>
                        {(lecturer.preferredRegions || []).join(", ") || "-"}
                      </TableCell>

                      {/* Assignments */}

                      <TableCell>
                        {lecturer.currentAssignments ?? 0}

                        {" / "}

                        {lecturer.maxAssignmentsPerMonth ?? 0}
                      </TableCell>

                      {/* Status */}

                      <TableCell>
                        <Chip
                          label={lecturer.active ? "Active" : "Inactive"}
                          color={lecturer.active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      {/* Actions */}

                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditLecturer(lecturer)}
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

      {/* ========================================= */}
      {/* ADD LECTURER DIALOG */}
      {/* ========================================= */}

      <AddLecturerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={() => {
          loadLecturers();
        }}
      />

      {/* ========================================= */}
      {/* EDIT LECTURER DIALOG */}
      {/* ========================================= */}

      <EditLecturerDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);

          setSelectedLecturer(null);
        }}
        lecturer={selectedLecturer}
        onUpdated={() => {
          loadLecturers();
        }}
      />
    </Container>
  );
};

export default Lecturers;
