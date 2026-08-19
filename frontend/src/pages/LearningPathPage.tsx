import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { learningPathApi } from "../api/learningPathApi";
import { userApi } from "../api/userApi";
import { ApiRequestError } from "../api/client";
import { LearningPathCard } from "../components/LearningPathCard";
import { ProgressHeader } from "../components/ProgressHeader";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useUser } from "../context/UserContext";
import type { LearningPath, LearningPathTopic } from "../types";

function Section({
  title,
  topics,
  children,
}: {
  title: string;
  topics: LearningPathTopic[];
  children: (topic: LearningPathTopic) => React.ReactNode;
}) {
  if (topics.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        {title}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <div key={t.id}>{children(t)}</div>
        ))}
      </div>
    </section>
  );
}

export function LearningPathPage() {
  const { userId } = useUser();

  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await learningPathApi.get(userId);
      setLearningPath(data);
    } catch (err) {
      // 404 means no goal selected — treat as empty state, not an error
      if (err instanceof ApiRequestError && err.status === 404) {
        setLearningPath(null);
      } else {
        setError("Unable to load your learning path. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleMark = async (topicId: string, known: boolean) => {
    setActionLoadingId(topicId);
    try {
      if (known) {
        await userApi.markTopicKnown(userId, topicId);
      } else {
        await userApi.unmarkTopicKnown(userId, topicId);
      }
      await load();
    } catch {
      setError("Unable to update topic. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <LoadingState message="Building your learning path…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!learningPath)
    return (
      <EmptyState
        title="No learning goal selected"
        description="Pick a goal and we'll build your personalised learning path."
        action={
          <Link
            to="/goals"
            className="inline-block px-5 py-2 bg-blue-600 text-white text-sm font-medium
                       rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose a goal →
          </Link>
        }
      />
    );

  const { goal, topics, progress } = learningPath;
  const available = topics.filter((t) => t.status === "available");
  const locked = topics.filter((t) => t.status === "locked");
  const completed = topics.filter((t) => t.status === "completed");
  const allDone = topics.length > 0 && completed.length === topics.length;

  return (
    <div>
      <ProgressHeader
        goalName={goal.name}
        completed={progress.completed}
        total={progress.total}
      />

      {allDone && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm text-center">
          🎉 You've completed everything required for this goal. Great work!
        </div>
      )}

      <Section title="Next to learn" topics={available}>
        {(t) => (
          <LearningPathCard
            topic={t}
            onMarkKnown={(id) => void handleMark(id, true)}
            actionLoading={actionLoadingId === t.id}
          />
        )}
      </Section>

      <Section title="Locked" topics={locked}>
        {(t) => <LearningPathCard topic={t} />}
      </Section>

      <Section title="Completed" topics={completed}>
        {(t) => (
          <LearningPathCard
            topic={t}
            onUnmarkKnown={(id) => void handleMark(id, false)}
            actionLoading={actionLoadingId === t.id}
          />
        )}
      </Section>
    </div>
  );
}
