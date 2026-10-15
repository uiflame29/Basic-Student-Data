import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import Stats from "./components/Stats";
import AnalyticsView from "./components/AnalyticsView";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import StudentDetailModal from "./components/StudentDetailModal";
import ConfirmationModal from "./components/ConfirmationModal";
import Toast from "./components/Toast";
import { INITIAL_STUDENTS } from "./data/mockStudents";
import { calculateClassStats, exportToCSV } from "./utils/gradeUtils";
import { BarChart3, Users, LayoutDashboard, Plus } from "lucide-react";

const STORAGE_KEY = "edupulse_students_data_v1";
const THEME_KEY = "edupulse_theme_v1";

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || "light";
  });

  // Students state with localStorage persistence
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse local storage students:", e);
    }
    return INITIAL_STUDENTS;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'directory' | 'analytics'

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Confirm delete modal state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    targetStudent: null,
    targetIds: null
  });

  // Global search input state in navbar
  const [navSearchTerm, setNavSearchTerm] = useState("");

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Sync theme to root DOM
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist students to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  // Toast helper
  const showToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Compute overall class statistics
  const stats = useMemo(() => {
    return calculateClassStats(students);
  }, [students]);

  // Add / Edit Student handler
  const handleSaveStudent = (studentData) => {
    if (studentToEdit) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentData.id ? studentData : s))
      );
      showToast(`Updated ${studentData.name}'s record successfully!`, "success");
    } else {
      setStudents((prev) => [studentData, ...prev]);
      showToast(`Enrolled ${studentData.name} successfully!`, "success");
    }
    setStudentToEdit(null);
    setIsFormModalOpen(false);
  };

  // Delete single student
  const handleDeleteStudentPrompt = (student) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Student Record",
      message: `Are you sure you want to delete ${student.name} (${student.studentId || "ID: N/A"})? This action cannot be undone.`,
      targetStudent: student,
      targetIds: null
    });
  };

  // Batch delete prompt
  const handleBatchDeletePrompt = (ids) => {
    setDeleteDialog({
      isOpen: true,
      title: "Delete Selected Students",
      message: `Are you sure you want to delete ${ids.length} selected student records?`,
      targetStudent: null,
      targetIds: ids
    });
  };

  // Confirm delete execution
  const handleConfirmDelete = () => {
    if (deleteDialog.targetStudent) {
      const name = deleteDialog.targetStudent.name;
      setStudents((prev) => prev.filter((s) => s.id !== deleteDialog.targetStudent.id));
      showToast(`Deleted ${name}'s record.`, "danger");
    } else if (deleteDialog.targetIds) {
      const count = deleteDialog.targetIds.length;
      const idsSet = new Set(deleteDialog.targetIds);
      setStudents((prev) => prev.filter((s) => !idsSet.has(s.id)));
      showToast(`Deleted ${count} student records.`, "danger");
    }
    setDeleteDialog({ isOpen: false, title: "", message: "", targetStudent: null, targetIds: null });
  };

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(students);
    showToast(`Exported ${students.length} students to CSV file.`, "info");
  };

  const handleBatchExport = (ids) => {
    const idsSet = new Set(ids);
    const selected = students.filter((s) => idsSet.has(s.id));
    exportToCSV(selected);
    showToast(`Exported ${selected.length} selected students to CSV.`, "info");
  };

  // Reset to default sample dataset
  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    showToast("Restored initial sample dataset with 10 students.", "info");
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAddModal={() => {
          setStudentToEdit(null);
          setIsFormModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onResetData={handleResetData}
        searchTerm={navSearchTerm}
        onSearchChange={(val) => {
          setNavSearchTerm(val);
          if (val) setActiveTab("directory");
        }}
        studentCount={students.length}
      />

      {/* Main Container */}
      <main className="main-container">
        {/* Welcome Hero Banner */}
        <HeroBanner
          stats={stats}
          onOpenAddModal={() => {
            setStudentToEdit(null);
            setIsFormModalOpen(true);
          }}
        />

        {/* Dynamic KPI Stat Cards */}
        <Stats stats={stats} />

        {/* View Selection Tabs */}
        <div className="view-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={17} />
            <span>Overview & Directory</span>
            <span className="tab-badge">{students.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "directory" ? "active" : ""}`}
            onClick={() => setActiveTab("directory")}
          >
            <Users size={17} />
            <span>Student Directory</span>
            <span className="tab-badge">{students.length}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 size={17} />
            <span>Grade Analytics</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <>
            <AnalyticsView
              stats={stats}
              students={students}
              onSelectStudent={(stu) => setViewingStudent(stu)}
            />
            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  All Student Records
                </h3>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setStudentToEdit(null);
                    setIsFormModalOpen(true);
                  }}
                >
                  <Plus size={16} />
                  <span>Enroll Student</span>
                </button>
              </div>
              <StudentList
                students={students}
                onEditStudent={(stu) => {
                  setStudentToEdit(stu);
                  setIsFormModalOpen(true);
                }}
                onDeleteStudent={handleDeleteStudentPrompt}
                onViewStudent={(stu) => setViewingStudent(stu)}
                onBatchDelete={handleBatchDeletePrompt}
                onBatchExport={handleBatchExport}
              />
            </div>
          </>
        )}

        {activeTab === "directory" && (
          <StudentList
            students={students}
            onEditStudent={(stu) => {
              setStudentToEdit(stu);
              setIsFormModalOpen(true);
            }}
            onDeleteStudent={handleDeleteStudentPrompt}
            onViewStudent={(stu) => setViewingStudent(stu)}
            onBatchDelete={handleBatchDeletePrompt}
            onBatchExport={handleBatchExport}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsView
            stats={stats}
            students={students}
            onSelectStudent={(stu) => setViewingStudent(stu)}
          />
        )}
      </main>

      {/* Add / Edit Student Modal */}
      <StudentForm
        isOpen={isFormModalOpen}
        studentToEdit={studentToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
      />

      {/* Student Profile Detail Modal */}
      <StudentDetailModal
        isOpen={Boolean(viewingStudent)}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(stu) => {
          setViewingStudent(null);
          setStudentToEdit(stu);
          setIsFormModalOpen(true);
        }}
        onDelete={(stu) => {
          setViewingStudent(null);
          handleDeleteStudentPrompt(stu);
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.title}
        message={deleteDialog.message}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteDialog({ isOpen: false, title: "", message: "", targetStudent: null, targetIds: null })
        }
      />

      {/* Toast System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;