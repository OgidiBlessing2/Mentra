export default function ProgressBar({
  value,
}) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-3">

      <div
        className="bg-emerald-500 h-3 rounded-full transition-all"
        style={{
          width: `${value}%`,
        }}
      />

    </div>
  );
}