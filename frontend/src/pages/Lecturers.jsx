import PageHeader from "../components/layout/PageHeader";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
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
  useMediaQuery,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

import AddLecturerDialog from "../components/dialogs/AddLecturerDialog";
import EditLecturerDialog from "../components/dialogs/EditLecturerDialog";

import { getLecturers } from "../services/lecturerService";

function LecturerCourses({ lecturer }) {
  const courses = (lecturer.courses ?? []).filter(Boolean);
  if (!courses.length) return <Typography variant="body2" color="text.secondary">No courses assigned</Typography>;

  return (
    <Box
      role="region"
      aria-label={`Courses for ${lecturer.name}`}
      tabIndex={0}
      sx={{ maxWidth: "100%", overflowX: "auto", pb: 1 }}
    >
      <Box component="ul" sx={{ display: "flex", gap: 0.75, width: "max-content", listStyle: "none" }}>
        {courses.map((course) => (
          <Box component="li" key={course._id ?? course}>
            <Chip
              size="small"
              label={typeof course === "string" ? course : [course.code, course.name].filter(Boolean).join(" ")}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function LecturerStatus({ active }) {
  return <Chip label={active ? "Active" : "Inactive"} color={active ? "success" : "error"} size="small" />;
}

function LecturerCard({ lecturer, onEdit }) {
  const regions = lecturer.preferredRegions?.join(", ") || "None listed";
  return (
    <Paper component="article" variant="outlined" sx={{ p: 2, minWidth: 0, overflowWrap: "anywhere" }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography component="h2" fontWeight={750}>{lecturer.name}</Typography>
            {lecturer.phone && <Typography variant="body2" color="text.secondary">{lecturer.phone}</Typography>}
          </Box>
          <LecturerStatus active={lecturer.active} />
        </Stack>
        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>Courses</Typography>
          <LecturerCourses lecturer={lecturer} />
        </Box>
        <Box>
          <Typography variant="body2" fontWeight={700}>Preferred regions</Typography>
          <Typography variant="body2" color="text.secondary">{regions}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Assignments: {lecturer.currentAssignments ?? 0} / {lecturer.maxAssignmentsPerMonth ?? 0}
        </Typography>
        <Button fullWidth variant="outlined" onClick={onEdit} sx={{ minHeight: 44 }}>Edit lecturer</Button>
      </Stack>
    </Paper>
  );
}

const Lecturers = () => {
  const compact = useMediaQuery((theme) => theme.breakpoints.down("md"));
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
        .filter((course) => course?._id)
        .map((course) => [course._id, course]),
    ).values(),
  ).sort((a, b) => (a.code ?? "").localeCompare(b.code ?? ""));

  const filteredLecturers = lecturers.filter((lecturer) => {
    const searchText = search.toLowerCase().trim();

    const courseText = (lecturer.courses || [])
      .filter(Boolean)
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
        (course) => (course?._id ?? course) === courseFilter,
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
    <Container disableGutters maxWidth="xl">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <Box sx={{ mb: 3 }}>
        <PageHeader title="Lecturers" description="Manage teaching assignments, regions, and lecturer availability.">
          <Button variant="contained" color="secondary" startIcon={<AddRoundedIcon />} onClick={() => setAddDialogOpen(true)}>
            Add lecturer
          </Button>
        </PageHeader>
      </Box>


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
            lg: "row",
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

          <FormControl sx={{ minWidth: { xs: 0, sm: 260 } }}>
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

          <FormControl sx={{ minWidth: { xs: 0, sm: 160 } }}>
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
            sx={{ alignSelf: { xs: "flex-end", lg: "center" }, width: 44, height: 44 }}
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

      {loading ? (
          <Paper
            sx={{ display: "grid", placeItems: "center", minHeight: 300 }}
          >
            <CircularProgress aria-label="Loading lecturers" />
          </Paper>
        ) : compact ? (
          <Stack spacing={1.5} aria-label="Lecturers">
            {filteredLecturers.map((lecturer) => (
              <LecturerCard key={lecturer._id} lecturer={lecturer} onEdit={() => handleEditLecturer(lecturer)} />
            ))}
            {filteredLecturers.length === 0 && <Alert severity="info">No lecturers found.</Alert>}
          </Stack>
        ) : (
          <TableContainer component={Paper}>
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
                          minWidth: { xs: 0, sm: 320 },
                          maxWidth: 320,
                        }}
                      >
                        <LecturerCourses lecturer={lecturer} />
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
                        <LecturerStatus active={lecturer.active} />
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
