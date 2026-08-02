import LessonCard from "./LessonCard";

export default function ModuleCard({ module }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">

      <h2 className="text-2xl font-bold">
        {module.title}
      </h2>

      <p className="text-gray-500 mt-2">
        {module.description}
      </p>

      <div className="mt-6">

        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
          />
        ))}

      </div>

    </div>
  );
}