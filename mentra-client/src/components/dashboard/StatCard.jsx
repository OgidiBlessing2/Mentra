import Card from "../common/Card";

export default function StatCard({
  icon: Icon,
  title,
  value,
  color,
}) {
  return (
    <Card className="flex items-center gap-4">

      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <Icon className="text-white" size={28} />
      </div>

      <div>

        <p className="text-slate-500">
          {title}
        </p>

        <h2 className="text-2xl font-bold">
          {value}
        </h2>

      </div>

    </Card>
  );
}