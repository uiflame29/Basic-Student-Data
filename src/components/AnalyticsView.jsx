import { BarChart3, BookOpen, Trophy, ArrowUpRight } from "lucide-react";
import { calculateGradeInfo } from "../utils/gradeUtils";

function AnalyticsView({ stats, students, onSelectStudent }) {
  // Top 3 achievers
  const topStudents = [...students]
    .sort((a, b) => Number(b.grade) - Number(a.grade))
    .slice(0, 3);

  return (
    <div className="analytics-view">
      <div className="analytics-grid">
        {/* Grade Distribution Chart */}
        <div className="chart-card">
          <div className="card-title-group">
            <div>
              <h3>
                <BarChart3 size={20} color="var(--primary)" />
                Grade Distribution
              </h3>
              <p className="card-subtitle">Visual breakdown across standard academic grade brackets</p>
            </div>
            <span className="badge badge-blue">
              {stats.total} Total Submissions
            </span>
          </div>

          <div className="distribution-bars">
            {stats.distribution.map((bracket) => (
              <div key={bracket.key} className="bar-item">
                <div className="bar-meta">
                  <span className="bar-label">
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: bracket.color,
                        display: "inline-block"
                      }}
                    />
                    {bracket.label}
                  </span>
                  <span>
                    <strong>{bracket.count}</strong> students ({bracket.percentage}%)
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${bracket.percentage}%`,
                      backgroundColor: bracket.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Performance Breakdown */}
        <div className="chart-card">
          <div className="card-title-group">
            <div>
              <h3>
                <BookOpen size={20} color="var(--accent)" />
                Program Benchmarks
              </h3>
              <p className="card-subtitle">Performance sorted by course average</p>
            </div>
          </div>

          <div className="course-list">
            {stats.courseBreakdown.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No program data available.</p>
            ) : (
              stats.courseBreakdown.map((course) => (
                <div key={course.name} className="course-item">
                  <div className="course-item-info">
                    <h4>{course.name}</h4>
                    <span>{course.count} Enrolled • {course.passRate}% Pass Rate</span>
                  </div>
                  <div className="course-item-stat">
                    <div className="course-avg">{course.average}%</div>
                    <div className="course-rate">Avg Score</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Performers Leaderboard */}
      {topStudents.length > 0 && (
        <div className="chart-card" style={{ marginBottom: "28px" }}>
          <div className="card-title-group">
            <div>
              <h3>
                <Trophy size={20} color="#f59e0b" />
                Honor Roll & Top Achievers
              </h3>
              <p className="card-subtitle">Students with the highest overall academic marks</p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px"
            }}
          >
            {topStudents.map((stu, index) => {
              const info = calculateGradeInfo(stu.grade);
              const medalColors = ["#f59e0b", "#94a3b8", "#d97706"];
              return (
                <div
                  key={stu.id}
                  onClick={() => onSelectStudent(stu)}
                  style={{
                    backgroundColor: "var(--bg-tertiary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: medalColors[index] || "var(--primary)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "800",
                        fontSize: "0.85rem"
                      }}
                    >
                      #{index + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                        {stu.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {stu.course}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>
                      {stu.grade}%
                    </div>
                    <span className={`badge ${info.badgeColor}`}>
                      {info.letter}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsView;
