import SectionCard from "./SectionCard";

export default function Strengths({ strengths, matched }) {
  // Use provided strengths if available, fallback to top unique matched skills
  const displayItems = strengths && strengths.length > 0 ? strengths : [];

  if (displayItems.length === 0 && (!matched || matched.length === 0)) {
    return (
      <SectionCard title="Strengths">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Strengths">
      <ul className="space-y-3">
        {displayItems.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
              ✓
            </span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
