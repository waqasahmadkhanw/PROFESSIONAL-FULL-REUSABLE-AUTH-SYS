interface AuthDividerProps {
  text?: string;
  className?: string;
}

export default function AuthDivider({
  text = "or continue with",
  className = "",
}: AuthDividerProps) {
  return (
    <div
      className={`flex items-center gap-4 py-2 ${className}`}
      role="separator"
      aria-label={text}
    >
      <div className="h-px flex-1 bg-gray-200" />

      <span className="shrink-0 text-sm text-gray-500">
        {text}
      </span>

      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}