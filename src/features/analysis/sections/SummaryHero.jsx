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
      <div className="space-y-6 print:space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 print:text-black">
              Overall Score
            </p>
            <p className="mt-1 text-5xl font-bold text-gray-900 print:text-4xl print:text-black">
              {score}
            </p>
          </div>
          <div
            className={`rounded px-4 py-2 text-lg font-semibold ${levelColor} print:border print:border-gray-400 print:bg-transparent print:text-black`}
          >
            {levelLabel}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 print:grid-cols-2 print:gap-3">
          {metadata?.role && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 print:text-gray-800">
                Role
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 print:text-black">
                {toTitleCase(metadata.role)}
              </p>
            </div>
          )}
          {metadata?.level && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 print:text-gray-800">
                Level
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 print:text-black">
                {toTitleCase(metadata.level)}
              </p>
            </div>
          )}
          {metadata?.companyType && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 print:text-gray-800">
                Company Type
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 print:text-black">
                {toTitleCase(metadata.companyType)}
              </p>
            </div>
          )}
          {metadata?.experienceYears > 0 && (
            <div>
              <p className="text-xs font-medium uppercase text-gray-500 print:text-gray-800">
                Experience
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-900 print:text-black">
                {metadata.experienceYears} yrs
              </p>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
