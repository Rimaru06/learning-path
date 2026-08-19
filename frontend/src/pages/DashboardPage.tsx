import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { learningPathApi } from "../api/learningPathApi";
import { LoadingState } from "../components/LoadingState";
import { useUser } from "../context/UserContext";
import type { LearningPath } from "../types";

export function DashboardPage() {
  const { userId } = useUser();
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningPathApi
      .get(userId)
      .then(setLearningPath)
      .catch(() => {/* no goal set yet – ok */})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingState />;

  const hasGoal = learningPath !== null;
  const available = learningPath?.topics.filter((t) => t.status === "available") ?? [];
  const { completed = 0, total = 0 } = learningPath?.progress ?? {};

  return (
    <div className="max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
      <p className="text-gray-500 mb-8 text-sm">
        {hasGoal
          ? `You're working towards ${learningPath!.goal.name}.`
          : "Get started by choosing a learning goal."}
      </p>

      {hasGoal ? (
        <div className="grid gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Progress</p>
            <p className="text-3xl font-bold text-gray-900">
              {completed}
              <span className="text-gray-400 font-normal text-xl"> / {total}</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">topics completed</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              Next to learn
            </p>
            {available.length === 0 ? (
              <p className="text-sm text-gray-500">
                {completed === total && total > 0
                  ? "🎉 Goal complete!"
                  : "Nothing available yet — keep completing prerequisites."}
              </p>
            ) : (
              <ul className="space-y-1">
                {available.slice(0, 3).map((t) => (
                  <li key={t.id} className="text-sm font-medium text-gray-800">
                    → {t.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            to="/learning-path"
            className="block text-center py-2.5 px-4 bg-blue-600 text-white text-sm font-medium
                       rounded-xl hover:bg-blue-700 transition-colors"
          >
            View full learning path
          </Link>
        </div>
      ) : (
        <Link
          to="/goals"
          className="inline-block py-2.5 px-6 bg-blue-600 text-white text-sm font-medium
                     rounded-xl hover:bg-blue-700 transition-colors"
        >
          Choose a goal →
        </Link>
      )}
    </div>
  );
}
