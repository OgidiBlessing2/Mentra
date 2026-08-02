export default function LessonCard({ lesson }) {

  const icon =
    lesson.status === "completed"
      ? "✅"
      : lesson.status === "active"
      ? "▶"
      : "🔒";

  return (
    <div className="flex justify-between items-center py-3 border-b">

      <div className="flex gap-3">

        <span>{icon}</span>

        <span>{lesson.title}</span>

      </div>

      <span className="text-gray-500">
        {lesson.estimatedMinutes} mins
      </span>

    </div>
  );
}