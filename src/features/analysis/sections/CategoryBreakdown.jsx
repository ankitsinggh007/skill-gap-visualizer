import SectionCard from "./SectionCard";

export default function CategoryBreakdown({ categoryScores }) {
  if (!categoryScores || categoryScores.length === 0) {
    return (
      <SectionCard title="Category Breakdown">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Category Breakdown">
      <div className="space-y-4">
        {categoryScores.map((item) => {
          const percentage = item.percentage || 0;
          return (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-medium capitalize text-gray-900">
                  {item.category}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {percentage}%
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {item.score !== undefined && item.max !== undefined && (
                <p className="mt-1 text-xs text-gray-500">
                  {item.score} / {item.max} points
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
