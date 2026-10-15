import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Edit2,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  UserX
} from "lucide-react";
import { calculateGradeInfo } from "../utils/gradeUtils";
import { AVAILABLE_COURSES } from "../data/mockStudents";

function StudentList({
  students,
  onEditStudent,
  onDeleteStudent,
  onViewStudent,
  onBatchDelete,
  onBatchExport
}) {
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("grade-desc");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    return students
      .filter((stu) => {
        // Search term
        const matchSearch =
          stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (stu.studentId && stu.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (stu.email && stu.email.toLowerCase().includes(searchTerm.toLowerCase()));

        // Course filter
        const matchCourse = courseFilter === "ALL" || stu.course === courseFilter;

        // Status filter
        const grade = Number(stu.grade) || 0;
        let matchStatus = true;
        if (statusFilter === "PASSED") matchStatus = grade >= 60;
        else if (statusFilter === "AT_RISK") matchStatus = grade < 60;
        else if (statusFilter === "DISTINCTION") matchStatus = grade >= 90;

        return matchSearch && matchCourse && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === "grade-desc") return Number(b.grade) - Number(a.grade);
        if (sortBy === "grade-asc") return Number(a.grade) - Number(b.grade);
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        if (sortBy === "attendance-desc") return (Number(b.attendance) || 0) - (Number(a.attendance) || 0);
        return 0;
      });
  }, [students, searchTerm, courseFilter, statusFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredStudents.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="table-card">
      {/* Toolbar / Search & Filter Controls */}
      <div className="table-toolbar">
        <div className="toolbar-left">
          <div className="search-field">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search name, ID, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="filter-select"
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Academic Programs</option>
            {AVAILABLE_COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Standings</option>
            <option value="PASSED">Passed (≥60%)</option>
            <option value="DISTINCTION">Distinction (≥90%)</option>
            <option value="AT_RISK">Needs Support (&lt;60%)</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="grade-desc">Sort: Grade (High to Low)</option>
            <option value="grade-asc">Sort: Grade (Low to High)</option>
            <option value="name-asc">Sort: Name (A - Z)</option>
            <option value="name-desc">Sort: Name (Z - A)</option>
            <option value="attendance-desc">Sort: Attendance Rate</option>
          </select>
        </div>

        <div className="toolbar-right">
          {/* Batch Actions when items are selected */}
          {selectedIds.size > 0 && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                className="btn btn-secondary"
                style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                onClick={() => onBatchExport(Array.from(selectedIds))}
                title="Export selected students to CSV"
              >
                <FileSpreadsheet size={15} />
                <span>Export ({selectedIds.size})</span>
              </button>
              <button
                className="btn btn-danger"
                style={{ padding: "6px 10px", fontSize: "0.8rem" }}
                onClick={() => {
                  onBatchDelete(Array.from(selectedIds));
                  setSelectedIds(new Set());
                }}
              >
                <Trash2 size={15} />
                <span>Delete ({selectedIds.size})</span>
              </button>
            </div>
          )}

          {/* View toggle (Table vs Cards) */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "var(--radius-sm)",
              padding: "2px"
            }}
          >
            <button
              className={`btn-icon-only btn-ghost ${viewMode === "table" ? "active" : ""}`}
              style={{
                width: 32,
                height: 32,
                backgroundColor: viewMode === "table" ? "var(--bg-secondary)" : "transparent",
                color: viewMode === "table" ? "var(--primary)" : "var(--text-muted)"
              }}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              className={`btn-icon-only btn-ghost ${viewMode === "grid" ? "active" : ""}`}
              style={{
                width: 32,
                height: 32,
                backgroundColor: viewMode === "grid" ? "var(--bg-secondary)" : "transparent",
                color: viewMode === "grid" ? "var(--primary)" : "var(--text-muted)"
              }}
              onClick={() => setViewMode("grid")}
              title="Card Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {paginatedStudents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserX size={32} />
          </div>
          <h4>No student records match your criteria</h4>
          <p>Try refining your search query, changing program filters, or clearing status restrictions.</p>
          {(searchTerm || courseFilter !== "ALL" || statusFilter !== "ALL") && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setCourseFilter("ALL");
                setStatusFilter("ALL");
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      selectedIds.size === filteredStudents.length
                    }
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th>Student</th>
                <th>Academic Program</th>
                <th>Grade Score</th>
                <th>Standing</th>
                <th>Attendance</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => {
                const info = calculateGradeInfo(student.grade);
                const isSelected = selectedIds.has(student.id);

                return (
                  <tr
                    key={student.id}
                    style={{
                      backgroundColor: isSelected ? "var(--primary-light)" : "transparent"
                    }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(student.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar">
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <div
                            className="student-info-name"
                            onClick={() => onViewStudent(student)}
                            title="Click to view details"
                          >
                            {student.name}
                          </div>
                          <div className="student-info-id">
                            {student.studentId || "ID: N/A"} • {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="course-tag">{student.course || "General"}</span>
                    </td>
                    <td>
                      <div className="grade-progress-cell">
                        <span className="grade-val">{student.grade}%</span>
                        <div className="mini-progress-track">
                          <div
                            className="mini-progress-fill"
                            style={{
                              width: `${Math.min(100, Math.max(0, student.grade))}%`,
                              backgroundColor: info.text
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${info.badgeColor}`}>
                        {info.letter} ({info.label})
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                        {student.attendance || 0}%
                      </span>
                    </td>
                    <td>
                      {info.status === "Passed" ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--success-text)",
                            fontWeight: 700,
                            fontSize: "0.78rem"
                          }}
                        >
                          <CheckCircle2 size={14} />
                          Passed
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            color: "var(--danger-text)",
                            fontWeight: 700,
                            fontSize: "0.78rem"
                          }}
                        >
                          <AlertCircle size={14} />
                          At Risk
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                        <button
                          className="btn-table-action"
                          onClick={() => onViewStudent(student)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-table-action"
                          onClick={() => onEditStudent(student)}
                          title="Edit Record"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-table-action delete-action"
                          onClick={() => onDeleteStudent(student)}
                          title="Delete Student"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="student-grid">
          {paginatedStudents.map((student) => {
            const info = calculateGradeInfo(student.grade);
            return (
              <div key={student.id} className="student-card">
                <div className="student-card-top">
                  <div className="student-cell">
                    <div className="student-avatar">{getInitials(student.name)}</div>
                    <div>
                      <div
                        className="student-info-name"
                        onClick={() => onViewStudent(student)}
                      >
                        {student.name}
                      </div>
                      <div className="student-info-id">{student.studentId}</div>
                    </div>
                  </div>
                  <span className={`badge ${info.badgeColor}`}>
                    {info.letter}
                  </span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <span className="course-tag">{student.course}</span>
                </div>

                <div className="card-metrics">
                  <div className="metric-col">
                    <div className="metric-col-title">Grade</div>
                    <div className="metric-col-val" style={{ color: info.text }}>
                      {student.grade}%
                    </div>
                  </div>
                  <div className="metric-col">
                    <div className="metric-col-title">Attendance</div>
                    <div className="metric-col-val">{student.attendance}%</div>
                  </div>
                  <div className="metric-col">
                    <div className="metric-col-title">Status</div>
                    <div
                      className="metric-col-val"
                      style={{
                        fontSize: "0.85rem",
                        color: info.status === "Passed" ? "var(--success-text)" : "var(--danger-text)"
                      }}
                    >
                      {info.status}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {student.email}
                  </span>
                  <div className="action-buttons">
                    <button
                      className="btn-table-action"
                      onClick={() => onViewStudent(student)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="btn-table-action"
                      onClick={() => onEditStudent(student)}
                      title="Edit Student"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-table-action delete-action"
                      onClick={() => onDeleteStudent(student)}
                      title="Delete Student"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="table-footer">
        <div>
          Showing{" "}
          <strong>
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, totalItems)}
          </strong>{" "}
          of <strong>{totalItems}</strong> students
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>Rows:</span>
            <select
              className="filter-select"
              style={{ padding: "4px 8px", fontSize: "0.8rem" }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;