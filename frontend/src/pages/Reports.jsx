import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert, Box, Button, Card, CardActionArea, CardContent, CircularProgress,
  Chip, LinearProgress, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import TimelineIcon from "@mui/icons-material/Timeline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { getBranches } from "../services/branchService";
import { getCourses } from "../services/courseService";
import { getProgress } from "../services/progressService";
import { centerStatuses, summarizeProgress } from "../services/reportSummary";
import PageHeader from "../components/layout/PageHeader";

const statusIcons = {
  complete: CheckCircleOutlinedIcon,
  final: FlagOutlinedIcon,
  near: HourglassBottomOutlinedIcon,
  inProgress: TimelineIcon,
  notStarted: RadioButtonUncheckedIcon,
  unconfigured: MenuBookOutlinedIcon,
};

function ClassProgress({ completed, total }) {
  const percentage = total ? (completed / total) * 100 : 0;

  return (
    <Stack spacing={0.5} sx={{ minWidth: 120 }}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
        <Typography variant="body2" fontWeight={650}>{completed} / {total}</Typography>
        <Typography variant="caption" color="text.secondary">{total ? `${Math.floor(percentage)}%` : "—"}</Typography>
      </Stack>
      <LinearProgress
        aria-label="Class completion"
        variant="determinate"
        value={percentage}
        color={percentage === 100 ? "success" : "primary"}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Stack>
  );
}

export default function Reports() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getBranches(), getCourses(), getProgress()])
      .then(([branches, courses, progress]) => {
        if (!cancelled) setReport(summarizeProgress(branches, courses, progress));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Unable to load the reports.");
        }
      });

    return () => { cancelled = true; };
  }, [attempt]);

  const visibleRows = report?.rows.filter((row) => {
    if (!status) return true;
    if (status === "notStarted") return row.total > 0 && row.completed === 0;
    return row.status === status;
  });
  const totals = report?.levels.reduce(
    (sum, level) => ({ completed: sum.completed + level.completed, total: sum.total + level.total }),
    { completed: 0, total: 0 },
  );

  return (
    <Stack spacing={3}>
      <PageHeader title="Reports" description="Track class completion across centers and academic levels.">
        {totals && (
          <Stack
            direction="row"
            spacing={3}
            sx={{ p: 2, borderRadius: 2.5, border: "1px solid #ffffff33", bgcolor: "#ffffff12", flexShrink: 0 }}
          >
            <Box>
              <Typography variant="h5">{report.rows.length}</Typography>
              <Typography variant="caption" sx={{ color: "#d8e7f6" }}>Centers</Typography>
            </Box>
            <Box>
              <Typography variant="h5">{totals.completed} / {totals.total}</Typography>
              <Typography variant="caption" sx={{ color: "#d8e7f6" }}>Classes completed</Typography>
            </Box>
          </Stack>
        )}
      </PageHeader>

      {error && (
        <Alert severity="error" action={
          <Button color="inherit" onClick={() => {
            setError("");
            setAttempt((previous) => previous + 1);
          }}>Retry</Button>
        }>
          {error}
        </Alert>
      )}
      {!report && !error && <CircularProgress aria-label="Loading reports" />}

      {report && (
        <>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}>
            {Object.entries(centerStatuses).map(([key, item]) => {
              const Icon = statusIcons[key];
              const active = status === key;
              return (
              <Card key={key} variant="outlined" sx={{
                borderRadius: 3,
                borderColor: active ? "primary.main" : undefined,
                boxShadow: active ? "0 0 0 1px #1769e0" : undefined,
                transition: "border-color 0.18s, box-shadow 0.18s",
                "&:hover": { boxShadow: "0 6px 20px #102a4314" },
              }}>
                <CardActionArea
                  aria-pressed={active}
                  aria-controls="center-progress-report"
                  sx={{ height: "100%", bgcolor: active ? "primary.light" : undefined }}
                  onClick={() => setStatus(active ? null : key)}
                >
                  <CardContent sx={{ p: 2.25 }}>
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={(theme) => {
                        const color = theme.palette[item.color]?.main ?? theme.palette.text.secondary;
                        return { display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: 2, color, bgcolor: alpha(color, 0.12) };
                      }}>
                        <Icon fontSize="small" />
                      </Box>
                      <ArrowForwardIcon fontSize="small" sx={{ color: active ? "primary.main" : "text.secondary" }} />
                    </Stack>
                    <Typography variant="h4" component="p" sx={{ mt: 1.25, fontVariantNumeric: "tabular-nums" }}>
                      {report.counts[key]}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>{item.label}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              );
            })}
          </Box>

          <Paper component="section" id="center-progress-report" aria-labelledby="center-progress-heading" sx={{ overflow: "hidden", borderRadius: 3 }}>
            <Stack direction="row" spacing={1} sx={{ p: { xs: 2, sm: 2.5 }, alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography id="center-progress-heading" variant="h6" component="h2">Center performance</Typography>
                <Typography variant="body2" color="text.secondary" aria-live="polite">
                  {status ? centerStatuses[status].label : "All centers"} · {visibleRows.length} of {report.rows.length}
                </Typography>
              </Box>
              {status && <Button onClick={() => setStatus(null)}>Show all</Button>}
            </Stack>
            <TableContainer>
              <Table aria-labelledby="center-progress-heading" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Center</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Completed / required</TableCell>
                    <TableCell align="right">Classes left</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row) => (
                    <TableRow key={row._id} hover>
                      <TableCell component="th" scope="row">
                        <Link
                          component={RouterLink}
                          to={`/progress?center=${encodeURIComponent(row._id)}`}
                          underline="hover"
                          fontWeight={700}
                        >{row.name}</Link>
                        {row.active === false && <Typography display="block" variant="caption" color="error.main">Inactive</Typography>}
                      </TableCell>
                      <TableCell>{row.region}</TableCell>
                      <TableCell><ClassProgress completed={row.completed} total={row.total} /></TableCell>
                      <TableCell align="right">{row.total ? row.remaining : "—"}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          color={centerStatuses[row.status].color}
                          label={row.status === "complete" ? "Completed" : centerStatuses[row.status].label}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {!visibleRows.length && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No centers match this report.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Paper component="section" aria-labelledby="level-progress-heading" sx={{ overflow: "hidden", borderRadius: 3 }}>
            <Typography id="level-progress-heading" variant="h6" component="h2" sx={{ p: { xs: 2, sm: 2.5 } }}>
              Class progress by level
            </Typography>
            <TableContainer>
              <Table aria-labelledby="level-progress-heading" sx={{ minWidth: 480 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Level</TableCell>
                    <TableCell align="right">Centers offering level</TableCell>
                    <TableCell>Completed / required</TableCell>
                    <TableCell align="right">Classes left</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.levels.map((level) => (
                    <TableRow key={level.level}>
                      <TableCell component="th" scope="row" sx={{ textTransform: "capitalize", fontWeight: 700 }}>{level.level.toLowerCase()}</TableCell>
                      <TableCell align="right">{level.branches}</TableCell>
                      <TableCell><ClassProgress completed={level.completed} total={level.total} /></TableCell>
                      <TableCell align="right">{level.total - level.completed}</TableCell>
                    </TableRow>
                  ))}
                  {!report.levels.length && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No center levels are configured.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Stack>
  );
}
