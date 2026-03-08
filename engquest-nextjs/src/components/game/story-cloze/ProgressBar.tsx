// Progress indicator for completed Story Cloze gaps.
export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div
        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
