import { FiLoader } from "react-icons/fi";

export function LoadingSpinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-8 h-8",
  };

  return (
    <FiLoader
      className={`${sizeClasses[size]} text-primary animate-spin`}
      aria-label="Loading..."
    />
  );
}

export function PageLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="large" />
        <p className="text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-neutral-800 rounded animate-pulse"
          style={{ width: `${80 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
