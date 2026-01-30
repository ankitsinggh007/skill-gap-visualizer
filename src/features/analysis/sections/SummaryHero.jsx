import SectionCard from "./SectionCard";

function toTitleCase(value) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}` : ""
    )
    .join(" ");
}

export default function SummaryHero({ score, levelLabel, metadata }) {
  const levelColors = {
    Strong: "text-green-700 bg-green-50",
    Average: "text-yellow-700 bg-yellow-50",
    Weak: "text-red-700 bg-red-50",
  };

  const levelColor = levelColors[levelLabel] || levelColors.Average;

  return (
    <SectionCard>
      <div className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">Overall Score</p>
            <p className="mt-1 text-5xl font-bold text-gray-900">{score}</p>
          </div>
          <div
            className={`rounded px-4 py-2 text-lg font-semibold ${levelColor}`}
          >
            {levelLabel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metadata?.role && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Role
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {toTitleCase(metadata.role)}
              </p>
            </div>
          )}
          {metadata?.level && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Level
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {toTitleCase(metadata.level)}
              </p>
            </div>
          )}
          {metadata?.companyType && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Company Type
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {toTitleCase(metadata.companyType)}
              </p>
            </div>
          )}
          {metadata?.experienceYears > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Experience
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {metadata.experienceYears} yrs
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
