import { StatusBadge } from "./StatusBadge";
import type { LearningPathTopic } from "../types";

interface LearningPathCardProps {
  topic: LearningPathTopic;
  onMarkKnown?: (topicId: string) => void;
  onUnmarkKnown?: (topicId: string) => void;
  actionLoading?: boolean;
}

export function LearningPathCard({
  topic,
  onMarkKnown,
  onUnmarkKnown,
  actionLoading = false,
}: LearningPathCardProps) {
  const lockedPrereqs = topic.prerequisites.filter((p) => !p.completed);

  return (
    <article
      className={`bg-white border rounded-xl p-5 transition-all ${
        topic.status === "completed"
          ? "border-green-200 bg-green-50/40"
          : topic.status === "available"
            ? "border-blue-200 hover:shadow-sm"
            : "border-gray-200 opacity-75"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900">{topic.name}</h3>
        <StatusBadge status={topic.status} />
      </div>

      {topic.status === "locked" && lockedPrereqs.length > 0 && (
        <p className="text-xs text-gray-500 mb-3">
          Requires:{" "}
          {lockedPrereqs.map((p) => p.name).join(", ")}
        </p>
      )}

      {topic.status === "available" && topic.prerequisites.length > 0 && (
        <p className="text-xs text-green-600 mb-3">
          Prerequisites completed ✓
        </p>
      )}

      {topic.status === "completed" && onUnmarkKnown && (
        <button
          onClick={() => onUnmarkKnown(topic.id)}
          disabled={actionLoading}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          aria-label={`Mark ${topic.name} as not completed`}
        >
          Mark as not completed
        </button>
      )}

      {topic.status === "available" && onMarkKnown && (
        <button
          onClick={() => onMarkKnown(topic.id)}
          disabled={actionLoading}
          className="mt-1 w-full py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={`Mark ${topic.name} as completed`}
        >
          {actionLoading ? "Saving…" : "Mark as completed"}
        </button>
      )}
    </article>
  );
}
