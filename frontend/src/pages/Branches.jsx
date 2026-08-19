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

import EditBranchDialog from "../components/dialogs/EditBranchDialog";

import { getBranches } from "../services/branchService";

import AddBranchDialog from "../components/dialogs/AddBranchDialog";

export default function Branches() {
  // ---------------------------------------------
  // State
  // ---------------------------------------------

  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [weekFilter, setWeekFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ---------------------------------------------
  // Load branches
  // ---------------------------------------------

  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBranches();

      setBranches(data);
    } catch (err) {
      console.error("LOAD BRANCHES ERROR:", err);

      setError(err.response?.data?.message || "Unable to load branches.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------
  // Open edit dialog
  // ---------------------------------------------

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);

    setEditDialogOpen(true);
  };

  // ---------------------------------------------
  // Render
  // ---------------------------------------------

  // --------------------------------------------
  // search filter
  // --------------------------------------------
  const filteredBranches = branches.filter((branch) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      branch.name?.toLowerCase().includes(searchText) ||
      branch.region?.toLowerCase().includes(searchText);

    const matchesLevel =
      levelFilter === "ALL" || branch.levels?.includes(levelFilter);

    const matchesWeek =
      weekFilter === "ALL" || Number(branch.week) === Number(weekFilter);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && branch.active) ||
      (statusFilter === "INACTIVE" && !branch.active);

    return matchesSearch && matchesLevel && matchesWeek && matchesStatus;
  });

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
            Branches
          </Typography>

          <Typography color="text.secondary">
            Manage branches, levels, teaching weeks and status.
          </Typography>
        </Box>

        <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
          Add Center
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
            label="Search Branches"
            placeholder="Name or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Level</InputLabel>

            <Select
              value={levelFilter}
              label="Level"
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Levels</MenuItem>

              <MenuItem value="CERTIFICATE">Certificate</MenuItem>

              <MenuItem value="ASSOCIATE">Associate</MenuItem>

              <MenuItem value="DIPLOMA">Diploma</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
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
              setLevelFilter("ALL");
              setWeekFilter("ALL");
              setStatusFilter("ALL");
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* ========================================= */}
      {/* TABLE */}
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
                    <b>Branch</b>
                  </TableCell>

                  <TableCell>
                    <b>Region</b>
                  </TableCell>
                  
                  <TableCell>
                    <b>Coordinator</b>
                  </TableCell>

                  <TableCell>
                    <b>Levels</b>
                  </TableCell>

                  <TableCell>
                    <b>Teaching Week</b>
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
                {filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No branches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBranches.map((branch) => (
                    <TableRow key={branch._id} hover>
                      {/* Branch */}

                      <TableCell>
                        <Typography fontWeight="bold">{branch.name}</Typography>
                      </TableCell>

                      {/* Region */}

                      <TableCell>{branch.region || "-"}</TableCell>

                      {/* Coordinator */}
                      <TableCell>
                        <Typography fontWeight="bold">
                          {branch.coordinatorName || "Not assigned"}
                        </Typography>

                        {branch.coordinatorPhone && (
                          <Typography variant="body2" color="text.secondary">
                            {branch.coordinatorPhone}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Levels */}

                      <TableCell>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {branch.levels?.map((level) => (
                            <Chip key={level} label={level} size="small" />
                          ))}
                        </Stack>
                      </TableCell>

                      {/* Week */}

                      <TableCell>Week {branch.week}</TableCell>

                      {/* Active */}

                      <TableCell>
                        <Chip
                          label={branch.active ? "Active" : "Inactive"}
                          color={branch.active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      {/* Actions */}

                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditBranch(branch)}
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
      {/* EDIT BRANCH DIALOG */}
      {/* ========================================= */}

      <EditBranchDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);

          setSelectedBranch(null);
        }}
        branch={selectedBranch}
        onUpdated={() => {
          loadBranches();
        }}
      />

      <AddBranchDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={() => {
          loadBranches();
        }}
      />
    </Container>
  );
}
