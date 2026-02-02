/**
 * Alert Component
 * Centralized alert with variants (info, success, warning, error)
 */
export default function Alert({
  children,
  variant = "info",
  closeable = false,
  onClose = () => {},
  className = "",
}) {
  const variants = {
    info: "bg-blue-50 border border-blue-200 text-blue-800",
    success: "bg-green-50 border border-green-200 text-green-800",
    warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
    error: "bg-red-50 border border-red-200 text-red-800",
  };

  const baseStyles = "rounded-lg p-4 flex items-start justify-between gap-3";

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      <div className="flex-1">{children}</div>
      {closeable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
