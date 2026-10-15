import { Users, TrendingUp, CheckCircle, PlusCircle } from "lucide-react";

function HeroBanner({ stats, onOpenAddModal }) {
  return (
    <div className="hero-banner">
      <div className="hero-text">
        <h2>Academic Performance Dashboard</h2>
        <p>
          Monitor grade distributions, track student performance metrics, and manage enrolled courses in real time.
        </p>
      </div>

      <div className="hero-stats-pill-group">
        <div className="hero-pill">
          <Users size={16} color="var(--primary)" />
          <span>Total: <strong>{stats.total} Students</strong></span>
        </div>
        <div className="hero-pill">
          <TrendingUp size={16} color="var(--accent)" />
          <span>Avg Grade: <strong>{stats.average}%</strong></span>
        </div>
        <div className="hero-pill">
          <CheckCircle size={16} color="var(--success)" />
          <span>Pass Rate: <strong>{stats.passRate}%</strong></span>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
