export const centerStatuses = {
  complete: { label: "Completed centers", color: "success" },
  final: { label: "1–2 classes left", color: "info" },
  near: { label: "3–4 classes left", color: "warning" },
  inProgress: { label: "In progress", color: "primary" },
  notStarted: { label: "No classes completed", color: "default" },
  unconfigured: { label: "No required classes", color: "default" },
};

function getStatus({ total, completed }) {
  const remaining = total - completed;
  if (!total) return "unconfigured";
  if (!remaining) return "complete";
  if (remaining <= 2) return "final";
  if (remaining <= 4) return "near";
  if (!completed) return "notStarted";
  return "inProgress";
}

export function summarizeProgress(branches, courses, progress) {
  const coursesByLevel = new Map();
  for (const course of courses) {
    if (!coursesByLevel.has(course.level)) coursesByLevel.set(course.level, []);
    coursesByLevel.get(course.level).push(course);
  }

  const progressByBranch = new Map();
  for (const record of progress) {
    const branchId = record.branch?._id;
    if (!branchId) continue;
    if (!progressByBranch.has(branchId)) progressByBranch.set(branchId, []);
    progressByBranch.get(branchId).push(record);
  }
  const levelTotals = new Map();
  const counts = Object.fromEntries(Object.keys(centerStatuses).map((status) => [status, 0]));

  const rows = branches.map((branch) => {
    const records = progressByBranch.get(branch._id) ?? [];
    let total = 0;
    let completed = 0;

    for (const level of new Set(branch.levels)) {
      const required = coursesByLevel.get(level) ?? [];
      const completedIds = new Set(
        records
          .filter((record) => record.level === level)
          .flatMap((record) => record.completedCourses.map((item) => item.course?._id)),
      );
      const levelCompleted = required.filter((course) => completedIds.has(course._id)).length;
      total += required.length;
      completed += levelCompleted;

      const summary = levelTotals.get(level) ?? { level, branches: 0, completed: 0, total: 0 };
      summary.branches += 1;
      summary.completed += levelCompleted;
      summary.total += required.length;
      levelTotals.set(level, summary);
    }

    const status = getStatus({ total, completed });
    counts[status] += 1;
    if ((status === "final" || status === "near") && completed === 0) counts.notStarted += 1;
    return { ...branch, status, completed, total, remaining: total - completed };
  });

  rows.sort((a, b) => a.remaining - b.remaining || a.name.localeCompare(b.name));
  const levels = [...levelTotals.values()].sort((a, b) => a.level.localeCompare(b.level));
  return { counts, rows, levels };
}
