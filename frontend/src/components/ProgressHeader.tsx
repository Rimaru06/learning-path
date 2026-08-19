interface ProgressHeaderProps {
  goalName: string;
  completed: number;
  total: number;
}

export function ProgressHeader({ goalName, completed, total }: ProgressHeaderProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
            Current Goal
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{goalName}</h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Progress</p>
          <p className="text-2xl font-bold text-gray-900">
            {completed}
            <span className="text-gray-400 font-normal text-lg"> / {total}</span>
          </p>
          <p className="text-xs text-gray-400">topics completed</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{pct}% complete</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of topics completed`}
          className="h-2 bg-gray-100 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
