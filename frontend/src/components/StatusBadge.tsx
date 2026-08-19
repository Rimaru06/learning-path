import type { TopicStatus } from "../types";

const config: Record<TopicStatus, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  available: {
    label: "Available",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  locked: {
    label: "Locked",
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
};

export function StatusBadge({ status }: { status: TopicStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {status === "locked" && <span className="mr-1" aria-hidden>🔒</span>}
      {status === "completed" && <span className="mr-1" aria-hidden>✓</span>}
      {label}
    </span>
  );
}
