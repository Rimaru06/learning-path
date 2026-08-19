interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="text-4xl" aria-hidden>📭</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}
