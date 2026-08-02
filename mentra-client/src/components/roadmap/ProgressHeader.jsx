export default function ProgressHeader({ roadmap }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">

      <h1 className="text-3xl font-bold">
        {roadmap.title}
      </h1>

      <p className="text-gray-500 mt-2">
        {roadmap.goal}
      </p>

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span className="font-medium">
            Overall Progress
          </span>

          <span>
            0%
          </span>

        </div>

        <div className="h-3 bg-gray-200 rounded-full">

          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{
              width: "0%",
            }}
          />

        </div>

      </div>

    </div>
  );
}