import { X, Calendar, Mail, BookOpen, Award, CheckCircle2, AlertCircle, Edit, Trash2 } from "lucide-react";
import { calculateGradeInfo } from "../utils/gradeUtils";

function StudentDetailModal({ student, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !student) return null;

  const info = calculateGradeInfo(student.grade);
  const initials = student.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Student Academic Profile</h3>
          <button className="btn-icon-only btn-ghost" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Profile Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 20,
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              marginBottom: 20
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.25rem",
                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)"
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {student.name}
              </h2>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                {student.studentId}
              </div>
            </div>

            <span className={`badge ${info.badgeColor}`} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
              {info.letter} ({info.label})
            </span>
          </div>

          {/* Quick Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 20
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-secondary)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <BookOpen size={14} />
                Program
              </div>
              <div style={{ fontWeight: 700, marginTop: 4, color: "var(--text-primary)" }}>
                {student.course}
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-secondary)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <Mail size={14} />
                Contact
              </div>
              <div style={{ fontWeight: 600, marginTop: 4, color: "var(--text-primary)", fontSize: "0.85rem", wordBreak: "break-all" }}>
                {student.email}
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-secondary)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <Award size={14} />
                Academic Standing
              </div>
              <div
                style={{
                  fontWeight: 700,
                  marginTop: 4,
                  color: info.status === "Passed" ? "var(--success-text)" : "var(--danger-text)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                {info.status === "Passed" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {info.status}
              </div>
            </div>

            <div
              style={{
                padding: "12px 14px",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-secondary)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase" }}>
                <Calendar size={14} />
                Enrollment Date
              </div>
              <div style={{ fontWeight: 600, marginTop: 4, color: "var(--text-primary)" }}>
                {student.enrollDate || "N/A"}
              </div>
            </div>
          </div>

          {/* Progress Bars Section */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>
                <span>Final Grade Score</span>
                <span style={{ color: info.text, fontWeight: 800 }}>{student.grade}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${student.grade}%`,
                    backgroundColor: info.text
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>
                <span>Course Attendance Rate</span>
                <span style={{ fontWeight: 800 }}>{student.attendance || 0}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${student.attendance || 0}%`,
                    backgroundColor: "var(--accent)"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          {student.notes && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--radius-sm)",
                borderLeft: "4px solid var(--primary)",
                fontSize: "0.85rem",
                color: "var(--text-secondary)"
              }}
            >
              <strong>Advisory Remarks:</strong> {student.notes}
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: "space-between" }}>
          <button
            className="btn btn-danger"
            onClick={() => {
              onClose();
              onDelete(student);
            }}
          >
            <Trash2 size={16} />
            <span>Delete Record</span>
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
            >
              <Edit size={16} />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
