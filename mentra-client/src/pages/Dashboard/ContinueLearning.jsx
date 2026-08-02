import Button from "../../components/common/Button";

export default function ContinueLearning({ lesson }) {
  if (!lesson) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-bold">
          Continue Learning
        </h2>

        <p className="text-gray-500 mt-3">
          No active lesson available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-2xl font-bold">
            Continue Learning
          </h2>

          <p className="text-gray-500 mt-2">
            Pick up where you left off.
          </p>

        </div>

        <Button>
          Continue
        </Button>

      </div>

      <div className="mt-8">

        <h3 className="text-xl font-semibold">
          {lesson.title}
        </h3>

        <p className="text-gray-500 mt-2">
          {lesson.module}
        </p>

        <p className="text-gray-500">
          {lesson.estimatedMinutes} mins
        </p>

        <div className="mt-6">

          <div className="h-3 bg-gray-200 rounded-full">

            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{
                width: `${lesson.progress ?? 0}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}