/**
 * Card Component
 * Centralized card container with consistent styling
 */
export default function Card({
  children,
  className = "",
  clickable = false,
  ...props
}) {
  const baseStyles = "bg-white rounded-lg border border-gray-200 shadow-sm";
  const hoverStyles = clickable
    ? "hover:shadow-md hover:border-gray-300 cursor-pointer transition-all"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
