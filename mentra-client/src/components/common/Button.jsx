export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5
        py-3
        rounded-xl
        bg-emerald-600
        text-white
        font-medium
        transition
        hover:bg-emerald-700
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}