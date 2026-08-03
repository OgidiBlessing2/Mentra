export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="group rounded-[28px] border border-white/10 bg-[#18181B] p-6 transition duration-300 hover:-translate-y-2 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/10">

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

        <span className="text-xs uppercase tracking-widest text-slate-500">

          Live

        </span>

      </div>

      <h3 className="mt-8 text-slate-400">

        {title}

      </h3>

      <div className="mt-2 text-4xl font-black text-white">

        {value}

      </div>

      <div className="mt-6 flex items-center gap-2">

        <div className="h-2 w-2 rounded-full bg-emerald-400" />

        <span className="text-sm text-slate-400">

          Updated just now

        </span>

      </div>

    </div>
  );
}