import { AlertTriangle, X } from "lucide-react";

function ConfirmationModal({ isOpen, title, message, confirmText = "Delete", onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ maxWidth: "420px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 style={{ color: "var(--danger-text)" }}>
            <AlertTriangle size={20} />
            {title || "Confirm Action"}
          </h3>
          <button className="btn-icon-only btn-ghost" onClick={onCancel} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            {message || "Are you sure you want to proceed? This action cannot be undone."}
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
