import type { Goal } from "../types";

interface GoalCardProps {
  goal: Goal;
  onSelect: (goal: Goal) => void;
  loading?: boolean;
}

export function GoalCard({ goal, onSelect, loading = false }: GoalCardProps) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-sm transition-all">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{goal.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{goal.description}</p>
      <button
        onClick={() => onSelect(goal)}
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg
                   hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        aria-label={`Select ${goal.name} as your goal`}
      >
        {loading ? "Setting goal…" : "Select this goal"}
      </button>
    </article>
  );
}
