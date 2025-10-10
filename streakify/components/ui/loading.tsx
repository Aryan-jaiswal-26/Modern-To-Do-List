export function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
        <span className="text-sm text-slate-400">{text}</span>
      </div>
    </div>
  );
}