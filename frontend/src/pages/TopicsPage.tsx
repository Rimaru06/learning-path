import { useEffect, useState, useCallback } from "react";
import { learningPathApi } from "../api/learningPathApi";
import { userApi } from "../api/userApi";
import { StatusBadge } from "../components/StatusBadge";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useUser } from "../context/UserContext";
import type { LearningPathTopic } from "../types";

export function TopicsPage() {
  const { userId } = useUser();

  const [topics, setTopics] = useState<LearningPathTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await learningPathApi.get(userId);
      setTopics(data.topics);
    } catch {
      setError("Unable to load topics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleUnmark = async (topicId: string) => {
    setActionLoadingId(topicId);
    try {
      await userApi.unmarkTopicKnown(userId, topicId);
      await load();
    } catch {
      setError("Unable to update topic.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <LoadingState message="Loading your topics…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const known = topics.filter((t) => t.status === "completed");

  if (known.length === 0)
    return (
      <EmptyState
        title="No completed topics yet"
        description="Head to your learning path and mark topics as you complete them."
      />
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Topics</h1>
        <p className="text-sm text-gray-500 mt-1">
          {known.length} topic{known.length !== 1 ? "s" : ""} completed
        </p>
      </div>

      <ul className="divide-y divide-gray-100 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {known.map((topic) => (
          <li
            key={topic.id}
            className="flex items-center justify-between px-5 py-4 gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <StatusBadge status="completed" />
              <span className="text-sm font-medium text-gray-800 truncate">
                {topic.name}
              </span>
            </div>
            <button
              onClick={() => void handleUnmark(topic.id)}
              disabled={actionLoadingId === topic.id}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap
                         disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Remove ${topic.name} from completed topics`}
            >
              {actionLoadingId === topic.id ? "Removing…" : "Remove"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
