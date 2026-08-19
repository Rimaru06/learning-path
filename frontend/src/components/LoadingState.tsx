export function LoadingState({ message = "Loading…" }: { message?: string }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
