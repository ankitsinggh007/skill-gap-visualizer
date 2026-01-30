import SectionCard from "./SectionCard";

export default function Weaknesses({ weaknesses, missing }) {
  // Use provided weaknesses if available, fallback to missing skills
  let displayItems = weaknesses && weaknesses.length > 0 ? weaknesses : [];

  // Fallback: extract top 6 unique missing skills if no weaknesses found
  if (displayItems.length === 0 && missing && missing.length > 0) {
    const uniqueSkills = Array.from(
      new Map(missing.map((m) => [m.skill, m])).values()
    );
    displayItems = uniqueSkills.slice(0, 6).map((m) => m.skill);
  }

  if (displayItems.length === 0) {
    return (
      <SectionCard title="Weaknesses">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Weaknesses">
      <ul className="space-y-3">
        {displayItems.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
              ⚠
            </span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
