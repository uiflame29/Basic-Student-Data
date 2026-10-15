import { useState, useEffect } from "react";
import { X, GraduationCap, Sparkles, CheckCircle2 } from "lucide-react";
import { calculateGradeInfo } from "../utils/gradeUtils";
import { AVAILABLE_COURSES } from "../data/mockStudents";

function StudentForm({ isOpen, onClose, onSave, studentToEdit }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState(AVAILABLE_COURSES[0]);
  const [grade, setGrade] = useState(85);
  const [attendance, setAttendance] = useState(90);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name || "");
      setStudentId(studentToEdit.studentId || "");
      setEmail(studentToEdit.email || "");
      setCourse(studentToEdit.course || AVAILABLE_COURSES[0]);
      setGrade(Number(studentToEdit.grade) ?? 85);
      setAttendance(Number(studentToEdit.attendance) ?? 90);
      setNotes(studentToEdit.notes || "");
    } else {
      // New student defaults
      const randomId = `STU-2024-${Math.floor(100 + Math.random() * 900)}`;
      setName("");
      setStudentId(randomId);
      setEmail("");
      setCourse(AVAILABLE_COURSES[0]);
      setGrade(85);
      setAttendance(90);
      setNotes("");
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const liveInfo = calculateGradeInfo(grade);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (grade < 0 || grade > 100 || isNaN(grade)) errs.grade = "Grade must be between 0 and 100";
    if (attendance < 0 || attendance > 100 || isNaN(attendance)) errs.attendance = "Attendance must be between 0 and 100";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      id: studentToEdit ? studentToEdit.id : `stu-${Date.now()}`,
      studentId: studentId.trim() || `STU-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@university.edu`,
      course,
      grade: Number(grade),
      attendance: Number(attendance),
      enrollDate: studentToEdit?.enrollDate || new Date().toISOString().slice(0, 10),
      notes: notes.trim()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <GraduationCap size={22} color="var(--primary)" />
            {studentToEdit ? "Edit Student Record" : "Enroll New Student"}
          </h3>
          <button className="btn-icon-only btn-ghost" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Student Name & Student ID */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Maria Santos"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  autoFocus
                />
                {errors.name && (
                  <span style={{ color: "var(--danger-text)", fontSize: "0.75rem", marginTop: 4, display: "block" }}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="STU-2024-XXX"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            </div>

            {/* Email & Academic Program */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Program</label>
                <select
                  className="form-input"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  {AVAILABLE_COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grade Slider with Live Preview */}
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Grade Mark (0 - 100%) *</label>
                <span className={`badge ${liveInfo.badgeColor}`}>
                  Standing: {liveInfo.letter} ({liveInfo.label})
                </span>
              </div>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="range-input"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="form-input"
                  style={{ width: "80px", textAlign: "center", fontWeight: "bold" }}
                />
              </div>

              <div className="live-grade-preview">
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                  Academic Status:
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: liveInfo.status === "Passed" ? "var(--success-text)" : "var(--danger-text)"
                  }}
                >
                  {liveInfo.status === "Passed" ? "✓ Eligible for Advancement (Passed)" : "⚠ Needs Academic Support (Below 60%)"}
                </span>
              </div>
            </div>

            {/* Attendance Slider */}
            <div className="form-group">
              <label className="form-label">Attendance Rate ({attendance}%)</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={(e) => setAttendance(Number(e.target.value))}
                  className="range-input"
                />
                <span className="range-badge">{attendance}%</span>
              </div>
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Advisory Notes & Remarks</label>
              <textarea
                className="form-input"
                rows="2"
                placeholder="Optional notes regarding project submissions, laboratory performance, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>{studentToEdit ? "Update Student" : "Save Student"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;