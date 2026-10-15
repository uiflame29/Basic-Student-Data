import { GraduationCap, Plus, Moon, Sun, Download, RotateCcw, Search } from "lucide-react";

function Navbar({
  theme,
  onToggleTheme,
  onOpenAddModal,
  onExportCSV,
  onResetData,
  searchTerm,
  onSearchChange,
  studentCount
}) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <div className="brand-icon-wrapper">
          <GraduationCap size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <h1>EduPulse</h1>
          <p>Student Analytics & Records</p>
        </div>
      </div>

      <div className="nav-search">
        <Search size={16} />
        <input
          type="text"
          placeholder={`Search ${studentCount} students...`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="nav-actions">
        <button
          className="btn btn-secondary btn-icon-only"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
        </button>

        <button
          className="btn btn-secondary"
          onClick={onExportCSV}
          title="Export records to CSV"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>

        <button
          className="btn btn-ghost btn-icon-only"
          onClick={onResetData}
          title="Reset to Demo Data"
          aria-label="Reset to Demo Data"
        >
          <RotateCcw size={16} />
        </button>

        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
