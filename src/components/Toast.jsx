import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const typeClass =
          toast.type === "danger"
            ? "toast-danger"
            : toast.type === "info"
            ? "toast-info"
            : "toast-success";

        const Icon =
          toast.type === "danger"
            ? AlertCircle
            : toast.type === "info"
            ? Info
            : CheckCircle;

        const iconColor =
          toast.type === "danger"
            ? "var(--danger)"
            : toast.type === "info"
            ? "var(--primary)"
            : "var(--success)";

        return (
          <div key={toast.id} className={`toast ${typeClass}`}>
            <Icon size={18} color={iconColor} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toast;
