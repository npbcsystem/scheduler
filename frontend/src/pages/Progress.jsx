import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox,
  Chip, CircularProgress, FormControl, LinearProgress, MenuItem, Paper, Select,
  Stack, Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { getBranches } from "../services/branchService";
import { getBranchProgress, removeCompletedCourses } from "../services/progressService";
import ManualProgressDialog from "../components/dialogs/ManualProgressDialog";
import PageHeader from "../components/layout/PageHeader";

function CourseList({ title, entries, selected, onToggle, actions, empty }) {
  return (
    <Box sx={{ minWidth: 0, border: "1px solid", borderColor: "divider", borderRadius: 2.5, overflow: "hidden" }}>
      <Stack spacing={1} sx={{ px: 2, py: 1.5, bgcolor: "action.hover" }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography component="h3" fontWeight={750}>{title}</Typography>
          <Chip label={entries.length} size="small" />
        </Stack>
        {actions}
      </Stack>
      {entries.length === 0 && <Typography color="text.secondary" sx={{ p: 2 }}>{empty}</Typography>}
      {entries.map(({ course, completedDate, manuallyCompleted, key }) => {
        const checked = selected.includes(course?._id);
        return (
          <Stack
            component="label"
            key={key}
            direction="row"
            sx={{
              alignItems: "flex-start",
              borderTop: "1px solid", borderColor: "divider", px: 1, py: 0.5,
              bgcolor: checked ? "primary.light" : "background.paper",
            }}
          >
            <Checkbox
              size="small"
              checked={checked}
              disabled={!course}
              onChange={() => onToggle(course._id)}
              slotProps={{ input: { "aria-label": course ? `Select ${course.code || course.name}` : "Unavailable course" } }}
            />
            <Box sx={{ minWidth: 0, py: 0.75, overflowWrap: "anywhere" }}>
              <Typography variant="body2" fontWeight={700}>{course?.name || "Unavailable course"}</Typography>
              <Typography variant="caption" color="text.secondary">
                {[course?.code, completedDate && new Date(completedDate).toLocaleDateString(), manuallyCompleted && "Manual"]
                  .filter(Boolean).join(" · ")}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Box>
  );
}

function ProgressOverview({ center, overall }) {
  const percentage = Math.min(overall.percentage, 100);
  return (
    <Paper component="section" aria-label="Center overview" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">{center.name}</Typography>
          <Typography variant="body2" color="text.secondary">{center.region}</Typography>
          <Stack direction="row" sx={{ mt: 2, justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">Overall completion</Typography>
            <Typography variant="body2" fontWeight={750}>{percentage}%</Typography>
          </Stack>
          <LinearProgress
            aria-label="Overall completion"
            variant="determinate"
            value={percentage}
            color={percentage === 100 ? "success" : "primary"}
            sx={{ height: 8, borderRadius: 4, mt: 1 }}
          />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1 }}>
          {[
            { label: "Completed", value: overall.completed, color: "success.main" },
            { label: "Remaining", value: Math.max(overall.remaining, 0), color: "primary.main" },
            { label: "Total courses", value: overall.total, color: "text.primary" },
          ].map(({ label, value, color }) => (
            <Box key={label} sx={{ bgcolor: "background.default", borderRadius: 2, p: { xs: 1, sm: 2 } }}>
              <Typography variant="h5" color={color}>{value}</Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Progress() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [centers, setCenters] = useState(null);
  const [centerError, setCenterError] = useState("");
  const [result, setResult] = useState(null);
  const [revision, setRevision] = useState(0);
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [selection, setSelection] = useState({});

  const selectedCenter = centers?.find((center) => center._id === searchParams.get("center")) ?? centers?.[0];
  const centerId = selectedCenter?._id;
  const currentResult = result?.centerId === centerId && result?.revision === revision ? result : null;
  const progress = currentResult?.data;

  useEffect(() => {
    let cancelled = false;
    getBranches()
      .then((data) => { if (!cancelled) setCenters(data); })
      .catch(() => { if (!cancelled) setCenterError("Unable to load centers."); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!centerId) return;
    let cancelled = false;
    getBranchProgress(centerId)
      .then((data) => { if (!cancelled) setResult({ centerId, revision, data }); })
      .catch(() => {
        if (!cancelled) setResult({ centerId, revision, error: "Unable to load center progress." });
      });
    return () => { cancelled = true; };
  }, [centerId, revision]);

  function setSelected(key, ids) {
    setSelection((previous) => ({ ...previous, [key]: ids }));
  }

  function toggleSelected(key, courseId) {
    setSelection((previous) => {
      const ids = previous[key] ?? [];
      return {
        ...previous,
        [key]: ids.includes(courseId) ? ids.filter((id) => id !== courseId) : [...ids, courseId],
      };
    });
  }

  async function undoCompleted(progressId, key, ids) {
    if (!window.confirm(`Undo completion for ${ids.length} selected course(s)?`)) return;
    setSaving(true);
    setActionError("");
    try {
      await removeCompletedCourses(progressId, ids);
      setSelected(key, []);
      setRevision((previous) => previous + 1);
    } catch (error) {
      setActionError(error.response?.data?.message || "Unable to undo course completion.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader title="Center Progress" description="Review courses by level and record completions.">
        <FormControl size="small" sx={{ minWidth: { md: 230 } }}>
          <Typography component="label" id="center-select-label" variant="body2" sx={{ mb: 0.75, color: "#d8e7f6" }}>
            Center
          </Typography>
          <Select
            labelId="center-select-label"
            value={centerId ?? ""}
            displayEmpty
            disabled={!centers?.length || saving}
            onChange={(event) => {
              setSearchParams({ center: event.target.value }, { replace: true });
              setSelection({});
              setActionError("");
            }}
          >
            {!centers?.length && <MenuItem value="">Select center</MenuItem>}
            {centers?.map((center) => <MenuItem key={center._id} value={center._id}>{center.name}</MenuItem>)}
          </Select>
        </FormControl>
      </PageHeader>

      {(centerError || actionError || currentResult?.error) && (
        <Alert severity="error">{centerError || actionError || currentResult.error}</Alert>
      )}
      {((!centers && !centerError) || (centerId && !currentResult)) && (
        <CircularProgress aria-label="Loading center progress" />
      )}
      {centers?.length === 0 && <Alert severity="info">No centers are available.</Alert>}

      {progress && (
        <>
          <ProgressOverview center={selectedCenter} overall={progress.overall} />
          <Stack component="section" aria-labelledby="course-progress-heading" spacing={1.5} key={centerId}>
            <Typography component="h2" variant="h6" id="course-progress-heading">Course progress by level</Typography>
            {Object.entries(progress.levels).map(([level, data], index) => {
              const remainingKey = `${level}-remaining`;
              const completedKey = `${level}-completed`;
              const remaining = data.remainingCourses;
              const completed = data.completedCourses;
              const selectedRemaining = selection[remainingKey] ?? [];
              const selectedCompleted = selection[completedKey] ?? [];
              const allSelected = remaining.length === selectedRemaining.length;

              return (
                <Accordion key={level} defaultExpanded={index === 0} disableGutters sx={{ "&::before": { display: "none" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`level-${level}`}
                    aria-controls={`courses-${level}`}
                    sx={{ px: 2, py: 0.5 }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ width: "100%", pr: 1, alignItems: "center" }}>
                      <SchoolOutlinedIcon color="primary" />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={750} sx={{ textTransform: "capitalize" }}>{level.toLowerCase()}</Typography>
                        <Typography variant="caption" color="text.secondary">{data.completed} of {data.total} completed</Typography>
                      </Box>
                      <Chip size="small" label={`${remaining.length} left`} color={data.total && !remaining.length ? "success" : "default"} />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: { xs: 1, sm: 2 }, pt: 0 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" }, gap: 2, alignItems: "start" }}>
                      <CourseList
                        title="Remaining courses"
                        entries={remaining.map((course) => ({ course, key: course._id }))}
                        selected={selectedRemaining}
                        onToggle={(id) => toggleSelected(remainingKey, id)}
                        empty={data.total ? "All courses completed." : "No courses are configured for this level."}
                        actions={remaining.length > 0 && (
                          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
                            <Button size="small" onClick={() => setSelected(remainingKey, allSelected ? [] : remaining.map((course) => course._id))}>
                              {allSelected ? "Clear selection" : "Select all"}
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={!selectedRemaining.length || !data.progressId || saving}
                              onClick={() => setDialog({
                                progressId: data.progressId,
                                courses: remaining.filter((course) => selectedRemaining.includes(course._id)),
                              })}
                            >
                              Mark complete{selectedRemaining.length > 0 && ` (${selectedRemaining.length})`}
                            </Button>
                          </Stack>
                        )}
                      />
                      <CourseList
                        title="Completed courses"
                        entries={completed.map((item, index) => ({ ...item, key: item._id || index }))}
                        selected={selectedCompleted}
                        onToggle={(id) => toggleSelected(completedKey, id)}
                        empty="No courses completed yet."
                        actions={selectedCompleted.length > 0 && (
                          <Button
                            size="small"
                            color="error"
                            sx={{ alignSelf: "flex-start" }}
                            disabled={!data.progressId || saving}
                            onClick={() => undoCompleted(data.progressId, completedKey, selectedCompleted)}
                          >
                            Undo completion ({selectedCompleted.length})
                          </Button>
                        )}
                      />
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Stack>
        </>
      )}

      <ManualProgressDialog
        open={Boolean(dialog)}
        progressId={dialog?.progressId}
        courses={dialog?.courses ?? []}
        onClose={() => setDialog(null)}
        onCompleted={() => {
          setDialog(null);
          setSelection({});
          setActionError("");
          setRevision((previous) => previous + 1);
        }}
      />
    </Stack>
  );
}
