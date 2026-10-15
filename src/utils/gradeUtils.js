export function calculateGradeInfo(grade) {
  const numGrade = Number(grade);

  if (isNaN(numGrade)) {
    return { letter: "N/A", label: "Invalid", status: "Invalid", color: "var(--text-muted)" };
  }

  if (numGrade >= 95) {
    return { letter: "A+", label: "Outstanding", status: "Passed", badgeColor: "badge-purple", bgSoft: "rgba(168, 85, 247, 0.12)", text: "#9333ea" };
  } else if (numGrade >= 85) {
    return { letter: "A", label: "Excellent", status: "Passed", badgeColor: "badge-green", bgSoft: "rgba(16, 185, 129, 0.12)", text: "#059669" };
  } else if (numGrade >= 75) {
    return { letter: "B", label: "Good", status: "Passed", badgeColor: "badge-blue", bgSoft: "rgba(59, 130, 246, 0.12)", text: "#2563eb" };
  } else if (numGrade >= 65) {
    return { letter: "C", label: "Satisfactory", status: "Passed", badgeColor: "badge-amber", bgSoft: "rgba(245, 158, 11, 0.12)", text: "#d97706" };
  } else if (numGrade >= 60) {
    return { letter: "D", label: "Marginal Pass", status: "Passed", badgeColor: "badge-orange", bgSoft: "rgba(249, 115, 22, 0.12)", text: "#ea580c" };
  } else {
    return { letter: "F", label: "Needs Support", status: "At Risk", badgeColor: "badge-red", bgSoft: "rgba(239, 68, 68, 0.12)", text: "#dc2626" };
  }
}

export function calculateClassStats(students = []) {
  const total = students.length;
  if (total === 0) {
    return {
      total: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      highestStudent: null,
      lowestStudent: null,
      passRate: 0,
      passedCount: 0,
      atRiskCount: 0,
      distinctionCount: 0,
      averageAttendance: 0,
      distribution: [
        { label: "A+ (95-100)", count: 0, percentage: 0, color: "#a855f7" },
        { label: "A (85-94)", count: 0, percentage: 0, color: "#10b981" },
        { label: "B (75-84)", count: 0, percentage: 0, color: "#3b82f6" },
        { label: "C (65-74)", count: 0, percentage: 0, color: "#f59e0b" },
        { label: "D (60-64)", count: 0, percentage: 0, color: "#f97316" },
        { label: "F (<60)", count: 0, percentage: 0, color: "#ef4444" },
      ],
      courseBreakdown: []
    };
  }

  const grades = students.map((s) => Number(s.grade) || 0);
  const totalGrade = grades.reduce((acc, curr) => acc + curr, 0);
  const average = Number((totalGrade / total).toFixed(1));

  const highest = Math.max(...grades);
  const lowest = Math.min(...grades);

  const highestStudent = students.find((s) => Number(s.grade) === highest) || null;
  const lowestStudent = students.find((s) => Number(s.grade) === lowest) || null;

  const passedCount = students.filter((s) => Number(s.grade) >= 60).length;
  const atRiskCount = total - passedCount;
  const distinctionCount = students.filter((s) => Number(s.grade) >= 90).length;
  const passRate = Number(((passedCount / total) * 100).toFixed(1));

  const attendances = students.map((s) => Number(s.attendance) || 0);
  const averageAttendance = Number((attendances.reduce((a, b) => a + b, 0) / total).toFixed(1));

  // Distribution
  const distCounts = { "A+": 0, "A": 0, "B": 0, "C": 0, "D": 0, "F": 0 };
  students.forEach((s) => {
    const g = Number(s.grade);
    if (g >= 95) distCounts["A+"]++;
    else if (g >= 85) distCounts["A"]++;
    else if (g >= 75) distCounts["B"]++;
    else if (g >= 65) distCounts["C"]++;
    else if (g >= 60) distCounts["D"]++;
    else distCounts["F"]++;
  });

  const distribution = [
    { label: "A+ (95-100)", key: "A+", count: distCounts["A+"], percentage: Number(((distCounts["A+"] / total) * 100).toFixed(1)), color: "#a855f7" },
    { label: "A (85-94)", key: "A", count: distCounts["A"], percentage: Number(((distCounts["A"] / total) * 100).toFixed(1)), color: "#10b981" },
    { label: "B (75-84)", key: "B", count: distCounts["B"], percentage: Number(((distCounts["B"] / total) * 100).toFixed(1)), color: "#3b82f6" },
    { label: "C (65-74)", key: "C", count: distCounts["C"], percentage: Number(((distCounts["C"] / total) * 100).toFixed(1)), color: "#f59e0b" },
    { label: "D (60-64)", key: "D", count: distCounts["D"], percentage: Number(((distCounts["D"] / total) * 100).toFixed(1)), color: "#f97316" },
    { label: "F (<60)", key: "F", count: distCounts["F"], percentage: Number(((distCounts["F"] / total) * 100).toFixed(1)), color: "#ef4444" },
  ];

  // Course breakdown
  const coursesMap = {};
  students.forEach((s) => {
    const course = s.course || "General";
    if (!coursesMap[course]) {
      coursesMap[course] = { name: course, totalGrade: 0, count: 0, passed: 0 };
    }
    coursesMap[course].totalGrade += Number(s.grade) || 0;
    coursesMap[course].count += 1;
    if (Number(s.grade) >= 60) coursesMap[course].passed += 1;
  });

  const courseBreakdown = Object.values(coursesMap).map((c) => ({
    name: c.name,
    count: c.count,
    average: Number((c.totalGrade / c.count).toFixed(1)),
    passRate: Number(((c.passed / c.count) * 100).toFixed(1))
  })).sort((a, b) => b.average - a.average);

  return {
    total,
    average,
    highest,
    lowest,
    highestStudent,
    lowestStudent,
    passRate,
    passedCount,
    atRiskCount,
    distinctionCount,
    averageAttendance,
    distribution,
    courseBreakdown
  };
}

export function exportToCSV(students = []) {
  if (students.length === 0) return;
  const headers = ["Student ID", "Full Name", "Email", "Course", "Grade", "Letter Grade", "Status", "Attendance (%)", "Enroll Date", "Notes"];
  const rows = students.map((s) => {
    const info = calculateGradeInfo(s.grade);
    return [
      `"${s.studentId || ""}"`,
      `"${s.name || ""}"`,
      `"${s.email || ""}"`,
      `"${s.course || ""}"`,
      s.grade,
      `"${info.letter}"`,
      `"${info.status}"`,
      s.attendance || 0,
      `"${s.enrollDate || ""}"`,
      `"${(s.notes || "").replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `student_analytics_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(students = []) {
  if (students.length === 0) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `student_analytics_export_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
