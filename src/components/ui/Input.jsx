/**
 * Input Component
 * Centralized input field with consistent styling
 */
export default function Input({
  type = "text",
  placeholder = "",
  className = "",
  error = false,
  disabled = false,
  ...props
}) {
  const baseStyles =
    "w-full px-4 py-2 border rounded-lg text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0";

  const borderStyles = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  const disabledStyles = disabled
    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
    : "bg-white text-gray-900";

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`${baseStyles} ${borderStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
}
