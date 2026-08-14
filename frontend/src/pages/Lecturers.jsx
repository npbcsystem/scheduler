import React from "react";
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
import AddLecturerDialog from "../components/dialogs/AddLecturerDialog";

const Lecturers = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  return (
    <Container maxWidth="xl">
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
      <AddLecturerDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={() => {
          loadLecturers();
        }}
      />
    </Container>
  );
};

export default Lecturers;
