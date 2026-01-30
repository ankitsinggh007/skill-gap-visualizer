import SectionCard from "./SectionCard";

export default function CriticalGaps({ recommendations, insights }) {
  // Primary: P0 recommendations, fallback: high severity insights
  const displayItems =
    recommendations && recommendations.length > 0
      ? recommendations
      : insights || [];

  if (displayItems.length === 0) {
    return (
      <SectionCard title="Critical Gaps">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Critical Gaps">
      <ul className="space-y-4">
        {displayItems.map((item, idx) => (
          <li key={idx} className="border-l-4 border-red-500 bg-red-50 p-4">
            <p className="font-semibold text-gray-900">
              {item.title || item.message}
            </p>
            <p className="mt-2 text-sm text-gray-700">
              {item.reason || item.tip || ""}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
