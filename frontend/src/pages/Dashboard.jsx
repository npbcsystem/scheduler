import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Apartment, AutoAwesome, CalendarMonth, CheckCircle, Groups, MenuBook, MoreHoriz, WarningAmber } from "@mui/icons-material";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getBranches } from "../services/branchService";
import { getLecturers } from "../services/lecturerService";
import { getSchedules } from "../services/scheduleService";
import { getProgress } from "../services/progressService";
import { getPendingAssignments } from "../services/pendingAssignmentService";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const levelColors = { CERTIFICATE: "#6845F5", ASSOCIATE: "#E57718", DIPLOMA: "#1769E0" };

export default function Dashboard() {
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [branches, setBranches] = useState([]); const [lecturers, setLecturers] = useState([]);
  const [schedules, setSchedules] = useState([]); const [progress, setProgress] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const loadDashboard = async () => {
    try {
      setLoading(true); setError("");
      const [branchData, lecturerData, scheduleData, progressData, pendingData] = await Promise.all([getBranches(), getLecturers(), getSchedules(), getProgress(), getPendingAssignments()]);
      setBranches(branchData || []); setLecturers(lecturerData || []); setSchedules(scheduleData || []); setProgress(progressData || []); setPendingAssignments(pendingData || []);
    } catch (err) { setError(err.response?.data?.message || "Unable to load the dashboard."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadDashboard(); }, []);

  const periodSchedules = useMemo(() => schedules.filter((item) => Number(item.month) === selectedMonth && Number(item.year) === selectedYear), [schedules, selectedMonth, selectedYear]);
  const activeBranches = branches.filter((item) => item.active !== false);
  const activeLecturers = lecturers.filter((item) => item.active !== false);
  const completedCourses = progress.reduce((total, item) => total + (item.completedCourses?.length || 0), 0);
  const totalCourses = branches.length * 36;
  const approvedCount = periodSchedules.filter((item) => item.status === "APPROVED").length;
  const completedCount = periodSchedules.filter((item) => item.status === "COMPLETED").length;
  const draftCount = periodSchedules.filter((item) => item.status === "DRAFT").length;
  const weekData = [1, 2, 3, 4, 5].map((week) => ({ week: `Week ${week}`, schedules: periodSchedules.filter((item) => Number(item.week) === week).length }));
  const visibleSchedules = [...periodSchedules].sort((a, b) => Number(a.week) - Number(b.week));
  const upcomingSchedules = visibleSchedules.slice(0, 5);

  if (loading) return <LoadingState />;
  return <Container maxWidth="xl" sx={{ pb: 5 }}>
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={2} sx={{ mb: 3.5 }}>
      <Box><Typography variant="h4">Dashboard</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Overview of your class scheduling system</Typography></Box>
      <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
        <FormControl size="small" sx={{ minWidth: 130 }}><InputLabel>Month</InputLabel><Select value={selectedMonth} label="Month" onChange={(e) => setSelectedMonth(Number(e.target.value))}>{months.map((month, index) => <MenuItem key={month} value={index + 1}>{month}</MenuItem>)}</Select></FormControl>
        <FormControl size="small" sx={{ minWidth: 106 }}><InputLabel>Year</InputLabel><Select value={selectedYear} label="Year" onChange={(e) => setSelectedYear(Number(e.target.value))}>{[2026, 2027, 2028].map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}</Select></FormControl>
        <Button variant="outlined" onClick={loadDashboard}>Refresh</Button>
      </Stack>
    </Stack>
    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} lg={3}><MetricCard icon={<CalendarMonth />} iconBg="#ECE7FF" iconColor="#6845F5" label="Total Schedules" value={periodSchedules.length} caption={`${months[selectedMonth - 1]} ${selectedYear}`} trend={weekData} color="#6845F5" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><MetricCard icon={<Apartment />} iconBg="#E2F8EC" iconColor="#168B5A" label="Active Branches" value={activeBranches.length} caption={`${branches.length} centers total`} trend={weekData} color="#168B5A" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><MetricCard icon={<MenuBook />} iconBg="#E5F0FF" iconColor="#1769E0" label="Courses Scheduled" value={new Set(periodSchedules.map((item) => item.course?._id || item.course)).size} caption="Unique courses this period" trend={weekData} color="#1769E0" /></Grid>
      <Grid item xs={12} sm={6} lg={3}><MetricCard icon={<Groups />} iconBg="#FFF0DF" iconColor="#E57718" label="Lecturers Involved" value={new Set(periodSchedules.map((item) => item.lecturer?._id || item.lecturer).filter(Boolean)).size} caption={`${activeLecturers.length} active lecturers`} trend={weekData} color="#E57718" /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: { xs: 2, md: 2.75 }, minHeight: 307, borderRadius: 3 }}><SectionHeader title="Schedule Overview" subtitle="Classes generated by teaching week" /><Box sx={{ height: 220, mt: 1 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={weekData} margin={{ top: 14, right: 10, left: -22, bottom: 0 }}><defs><linearGradient id="scheduleFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1769E0" stopOpacity={0.25} /><stop offset="100%" stopColor="#1769E0" stopOpacity={0.015} /></linearGradient></defs><XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#62738A", fontSize: 12 }} dy={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#62738A", fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E6ECF4", boxShadow: "0 8px 20px rgba(16,42,67,.12)" }} /><Area type="monotone" dataKey="schedules" name="Schedules" stroke="#1769E0" strokeWidth={2.5} fill="url(#scheduleFill)" dot={{ r: 3.5, fill: "#1769E0", strokeWidth: 0 }} activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer></Box></Paper>
        <Paper sx={{ p: { xs: 2, md: 2.75 }, mt: 2.5, borderRadius: 3 }}><SectionHeader title="Recent Schedules" subtitle="Latest assignments for the selected period" action="View schedules" /><TableContainer sx={{ mt: 1.75, border: "1px solid #E6ECF4", borderRadius: 2, overflow: "hidden" }}><Table size="small"><TableHead><TableRow><TableCell>Branch</TableCell><TableCell>Level</TableCell><TableCell>Course</TableCell><TableCell>Lecturer</TableCell><TableCell>Week</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{visibleSchedules.slice(0, 6).map((item) => <TableRow key={item._id} hover><TableCell sx={{ fontWeight: 650 }}>{item.branch?.name || "—"}</TableCell><TableCell><LevelChip level={item.level} /></TableCell><TableCell>{item.course?.code || item.course?.name || "—"}</TableCell><TableCell>{item.lecturer?.name || "Unassigned"}</TableCell><TableCell>Week {item.week}</TableCell><TableCell><StatusChip status={item.status} /></TableCell></TableRow>)}{!visibleSchedules.length && <EmptyTable />}</TableBody></Table></TableContainer></Paper>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: { xs: 2, md: 2.75 }, borderRadius: 3 }}><SectionHeader title="Upcoming Schedules" subtitle="Assignments in this period" action="View schedules" /><Stack divider={<Box sx={{ borderBottom: "1px solid #EDF1F6" }} />} sx={{ mt: 1 }}>{upcomingSchedules.map((item) => <Stack key={item._id} direction="row" spacing={1.4} alignItems="center" sx={{ py: 1.45 }}><Avatar sx={{ width: 38, height: 38, bgcolor: "#E8F1FF", color: "primary.main" }}><Apartment fontSize="small" /></Avatar><Box sx={{ minWidth: 0, flex: 1 }}><Typography fontWeight={700} noWrap>{item.branch?.name || "Unknown Branch"}</Typography><Typography variant="caption" color="text.secondary" noWrap>{item.course?.code || item.course?.name || "Course not set"}</Typography></Box><Stack alignItems="flex-end" spacing={0.5}><Typography variant="caption" color="text.secondary">Week {item.week}</Typography><LevelChip level={item.level} /></Stack></Stack>)}{!upcomingSchedules.length && <EmptyList text="No schedules for this period yet." />}</Stack></Paper>
        <Paper sx={{ p: { xs: 2, md: 2.75 }, mt: 2.5, borderRadius: 3 }}><SectionHeader title="Schedule Health" subtitle="A quick view of your current period" /><Stack spacing={2.2} sx={{ mt: 2.25 }}><ProgressLine label="Approved schedules" value={approvedCount} total={periodSchedules.length} color="#168B5A" /><ProgressLine label="Completed classes" value={completedCount} total={periodSchedules.length} color="#1769E0" /><ProgressLine label="Academic progress" value={completedCourses} total={totalCourses} color="#6845F5" /></Stack></Paper>
        <Paper sx={{ p: { xs: 2, md: 2.75 }, mt: 2.5, borderRadius: 3 }}><SectionHeader title="Needs attention" /><Stack spacing={1.35} sx={{ mt: 1.6 }}><Activity icon={<WarningAmber />} color="#E57718" title="Unassigned classes" detail={`${pendingAssignments.length} assignment${pendingAssignments.length === 1 ? "" : "s"} need review`} /><Activity icon={<AutoAwesome />} color="#6845F5" title="Draft schedules" detail={`${draftCount} schedule${draftCount === 1 ? "" : "s"} awaiting approval`} /><Activity icon={<CheckCircle />} color="#168B5A" title="Academic progress" detail={`${completedCourses} of ${totalCourses || 0} courses completed`} /></Stack></Paper>
      </Grid>
    </Grid>
  </Container>;
}

function MetricCard({ icon, iconBg, iconColor, label, value, caption, trend, color }) { return <Card sx={{ height: "100%", borderRadius: 3 }}><CardContent sx={{ p: "22px !important" }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Box sx={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: iconBg, color: iconColor }}>{icon}</Box><Box sx={{ width: 85, height: 42 }}><ResponsiveContainer><AreaChart data={trend}><Area type="monotone" dataKey="schedules" stroke={color} strokeWidth={1.7} fill={color} fillOpacity={0.12} /></AreaChart></ResponsiveContainer></Box></Stack><Typography variant="body2" sx={{ color: "text.secondary", mt: 2.1 }}>{label}</Typography><Typography variant="h4" sx={{ mt: 0.35 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{caption}</Typography></CardContent></Card>; }
function SectionHeader({ title, subtitle, action }) { return <Stack direction="row" alignItems="start" justifyContent="space-between" spacing={1}><Box><Typography variant="h6">{title}</Typography>{subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{subtitle}</Typography>}</Box>{action && <Button size="small" endIcon={<MoreHoriz />} sx={{ minWidth: "auto", px: 0 }}>{action}</Button>}</Stack>; }
function LevelChip({ level }) { const color = levelColors[level] || "#53657C"; return <Chip label={level || "—"} size="small" sx={{ height: 22, fontSize: "0.64rem", color, bgcolor: `${color}18`, fontWeight: 800 }} />; }
function StatusChip({ status }) { const map = { DRAFT: ["#E28A16", "#FFF2CD"], APPROVED: ["#168B5A", "#E3F7EC"], COMPLETED: ["#1769E0", "#E8F1FF"], CANCELLED: ["#D14343", "#FCE9E9"] }; const [color, bg] = map[status] || ["#53657C", "#EFF3F7"]; return <Chip label={status || "—"} size="small" sx={{ height: 22, fontSize: "0.64rem", color, bgcolor: bg, fontWeight: 800 }} />; }
function ProgressLine({ label, value, total, color }) { const percentage = total ? Math.round((value / total) * 100) : 0; return <Box><Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}><Typography variant="body2" fontWeight={650}>{label}</Typography><Typography variant="caption" color="text.secondary">{value} / {total} · {percentage}%</Typography></Stack><LinearProgress variant="determinate" value={percentage} sx={{ height: 7, borderRadius: 9, bgcolor: "#EAF0F6", "& .MuiLinearProgress-bar": { borderRadius: 9, bgcolor: color } }} /></Box>; }
function Activity({ icon, color, title, detail }) { return <Stack direction="row" spacing={1.4} alignItems="center"><Avatar sx={{ width: 34, height: 34, bgcolor: `${color}18`, color }}>{icon}</Avatar><Box><Typography variant="body2" fontWeight={700}>{title}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography></Box></Stack>; }
function EmptyTable() { return <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: "text.secondary" }}>No schedules have been created for this period.</TableCell></TableRow>; }
function EmptyList({ text }) { return <Typography color="text.secondary" variant="body2" sx={{ py: 3, textAlign: "center" }}>{text}</Typography>; }
function LoadingState() { return <Container maxWidth="xl"><Box sx={{ height: "65vh", display: "grid", placeItems: "center" }}><Stack spacing={2} alignItems="center"><CircularProgress /><Typography color="text.secondary">Loading your dashboard…</Typography></Stack></Box></Container>; }
