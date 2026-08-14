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
} from "@mui/material";

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
                {branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No branches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  branches.map((branch) => (
                    <TableRow key={branch._id} hover>
                      {/* Branch */}

                      <TableCell>
                        <Typography fontWeight="bold">{branch.name}</Typography>
                      </TableCell>

                      {/* Region */}

                      <TableCell>{branch.region || "-"}</TableCell>

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
