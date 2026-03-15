// Progress indicator for completed Story Cloze gaps.
export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-3 w-full rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
