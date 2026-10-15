import { Users, Award, TrendingUp, AlertTriangle, UserCheck, CalendarCheck } from "lucide-react";
import { calculateGradeInfo } from "../utils/gradeUtils";

function Stats({ stats }) {
  const avgInfo = calculateGradeInfo(stats.average);
  const highestInfo = stats.highestStudent ? calculateGradeInfo(stats.highestStudent.grade) : null;

  return (
    <div className="stats-grid">
      {/* Total Students */}
      <div className="stat-card" style={{ "--stat-accent": "var(--primary)" }}>
        <div className="stat-header">
          <span className="stat-title">Total Enrolled</span>
          <div className="stat-icon" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
            <Users size={18} />
          </div>
        </div>
        <div className="stat-value">{stats.total}</div>
        <div className="stat-footer">
          <span>Active in <strong>{stats.courseBreakdown.length}</strong> academic programs</span>
        </div>
      </div>

      {/* Class Average */}
      <div className="stat-card" style={{ "--stat-accent": "var(--accent)" }}>
        <div className="stat-header">
          <span className="stat-title">Class Average</span>
          <div className="stat-icon" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="stat-value">{stats.average}%</div>
        <div className="stat-footer">
          <span>Overall Standing: <strong style={{ color: avgInfo.text }}>{avgInfo.letter} ({avgInfo.label})</strong></span>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="stat-card" style={{ "--stat-accent": "var(--success)" }}>
        <div className="stat-header">
          <span className="stat-title">Pass Rate</span>
          <div className="stat-icon" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
            <UserCheck size={18} />
          </div>
        </div>
        <div className="stat-value">{stats.passRate}%</div>
        <div className="stat-footer">
          <span><strong>{stats.passedCount}</strong> Passed / <strong>{stats.atRiskCount}</strong> At Risk</span>
        </div>
      </div>

      {/* Top Performer */}
      <div className="stat-card" style={{ "--stat-accent": "var(--purple)" }}>
        <div className="stat-header">
          <span className="stat-title">Top Score</span>
          <div className="stat-icon" style={{ backgroundColor: "var(--purple-bg)", color: "var(--purple)" }}>
            <Award size={18} />
          </div>
        </div>
        <div className="stat-value">{stats.highest}%</div>
        <div className="stat-footer">
          <span>Top Student: <strong>{stats.highestStudent ? stats.highestStudent.name : "None"}</strong></span>
        </div>
      </div>

      {/* Average Attendance */}
      <div className="stat-card" style={{ "--stat-accent": "var(--warning)" }}>
        <div className="stat-header">
          <span className="stat-title">Avg Attendance</span>
          <div className="stat-icon" style={{ backgroundColor: "var(--warning-bg)", color: "var(--warning)" }}>
            <CalendarCheck size={18} />
          </div>
        </div>
        <div className="stat-value">{stats.averageAttendance}%</div>
        <div className="stat-footer">
          <span>Target baseline: <strong>85.0%</strong></span>
        </div>
      </div>
    </div>
  );
}

export default Stats;