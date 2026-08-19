import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { goalApi } from "../api/goalApi";
import { userApi } from "../api/userApi";
import { GoalCard } from "../components/GoalCard";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { useUser } from "../context/UserContext";
import type { Goal } from "../types";

export function GoalsPage() {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectingGoalId, setSelectingGoalId] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalApi.list();
      setGoals(data);
    } catch {
      setError("Unable to load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  const handleSelect = async (goal: Goal) => {
    setSelectingGoalId(goal.id);
    try {
      await userApi.setGoal(userId, goal.id);
      navigate("/learning-path");
    } catch {
      setError("Unable to set goal. Please try again.");
    } finally {
      setSelectingGoalId(null);
    }
  };

  if (loading) return <LoadingState message="Loading goals…" />;
  if (error) return <ErrorState message={error} onRetry={loadGoals} />;
  if (goals.length === 0)
    return (
      <EmptyState
        title="No goals available"
        description="There are no learning goals configured yet. Check back soon."
      />
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Choose your goal</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Pick a learning goal and we'll build your personalised path.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onSelect={(g) => void handleSelect(g)}
            loading={selectingGoalId === goal.id}
          />
        ))}
      </div>
    </div>
  );
}
