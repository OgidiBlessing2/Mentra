export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="group rounded-[28px] border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10">

      {/* TOP */}
      <div className="flex items-center justify-between">

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: `${color}20`,
          }}
        >
          <Icon
            size={26}
            color={color}
          />
        </div>

        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--mentra-text-subtle)]">
          Live
        </span>

      </div>

      {/* TITLE */}
      <h3 className="mt-8 text-[var(--mentra-text-muted)]">
        {title}
      </h3>

      {/* VALUE */}
      <div className="mt-2 text-4xl font-black text-[var(--mentra-text)]">
        {value}
      </div>

      {/* STATUS */}
      <div className="mt-6 flex items-center gap-2">

        <div className="h-2 w-2 rounded-full bg-emerald-400" />

        <span className="text-sm text-[var(--mentra-text-muted)]">
          Updated just now
        </span>

      </div>

    </div>
  );
}