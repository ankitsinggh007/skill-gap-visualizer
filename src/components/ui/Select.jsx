/**
 * Select Component
 * Centralized select dropdown with consistent styling
 */
export default function Select({
  options = [],
  placeholder = "Select an option",
  className = "",
  error = false,
  disabled = false,
  ...props
}) {
  const baseStyles =
    "w-full px-4 py-2 border rounded-lg text-base bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 appearance-none cursor-pointer";

  const borderStyles = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  const disabledStyles = disabled
    ? "bg-gray-100 text-gray-500 cursor-not-allowed opacity-60"
    : "text-gray-900";

  return (
    <select
      className={`${baseStyles} ${borderStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
