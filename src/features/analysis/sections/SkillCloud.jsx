import SectionCard from "./SectionCard";

function SkillChip({ label, variant = "matched" }) {
  const styles = {
    matched: "bg-green-100 text-green-800",
    weak: "bg-yellow-100 text-yellow-800",
    missing: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export default function SkillCloud({ matched, missing, weakSignals }) {
  const hasMatched = matched && matched.length > 0;
  const hasMissing = missing && missing.length > 0;
  const hasWeak = weakSignals && weakSignals.length > 0;

  if (!hasMatched && !hasMissing && !hasWeak) {
    return (
      <SectionCard title="Skill Cloud">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Skill Cloud">
      <div className="space-y-6">
        {hasMatched && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Matched Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {matched.map((item) => (
                <SkillChip
                  key={`${item.skill}-${item.category}`}
                  label={item.skill}
                  variant="matched"
                />
              ))}
            </div>
          </div>
        )}

        {hasWeak && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Weak Signals
            </h3>
            <div className="flex flex-wrap gap-2">
              {weakSignals.map((item) => (
                <SkillChip
                  key={`${item.skill}-${item.category}`}
                  label={item.skill}
                  variant="weak"
                />
              ))}
            </div>
          </div>
        )}

        {hasMissing && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Missing Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {missing.map((item) => (
                <SkillChip
                  key={`${item.skill}-${item.category}`}
                  label={item.skill}
                  variant="missing"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
