import SectionCard from "./SectionCard";

function PriorityBadge({ priority }) {
  const styles = {
    P0: "bg-red-100 text-red-800",
    P1: "bg-yellow-100 text-yellow-800",
    P2: "bg-blue-100 text-blue-800",
  };

  const labels = {
    P0: "Critical",
    P1: "Important",
    P2: "Nice to have",
  };

  return (
    <span
      className={`inline-block rounded px-2 py-1 text-xs font-semibold ${styles[priority] || styles.P2}`}
    >
      {labels[priority] || priority}
    </span>
  );
}

export default function PersonalizedPlan({ recommendationsByPriority }) {
  if (!recommendationsByPriority) {
    return (
      <SectionCard title="Personalized Plan">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  const p0 = recommendationsByPriority.P0 || [];
  const p1 = recommendationsByPriority.P1 || [];
  const p2 = recommendationsByPriority.P2 || [];

  const hasRecommendations = p0.length > 0 || p1.length > 0 || p2.length > 0;

  if (!hasRecommendations) {
    return (
      <SectionCard title="Personalized Plan">
        <p className="text-gray-600">None found</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Personalized Plan">
      <div className="space-y-6">
        {p0.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Critical (P0)
            </h3>
            <ul className="space-y-3">
              {p0.map((item) => (
                <li
                  key={`P0-${item.title}-${item.action || item.reason || ""}`}
                  className="space-y-2 border-l-4 border-red-500 bg-red-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <PriorityBadge priority="P0" />
                  </div>
                  {item.reason && (
                    <p className="text-sm text-gray-700">{item.reason}</p>
                  )}
                  {item.action && (
                    <p className="text-sm italic text-gray-600">
                      {item.action}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p1.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Important (P1)
            </h3>
            <ul className="space-y-3">
              {p1.map((item) => (
                <li
                  key={`P1-${item.title}-${item.action || item.reason || ""}`}
                  className="space-y-2 border-l-4 border-yellow-500 bg-yellow-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <PriorityBadge priority="P1" />
                  </div>
                  {item.reason && (
                    <p className="text-sm text-gray-700">{item.reason}</p>
                  )}
                  {item.action && (
                    <p className="text-sm italic text-gray-600">
                      {item.action}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {p2.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Nice to Have (P2)
            </h3>
            <ul className="space-y-3">
              {p2.map((item) => (
                <li
                  key={`P2-${item.title}-${item.action || item.reason || ""}`}
                  className="space-y-2 border-l-4 border-blue-500 bg-blue-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <PriorityBadge priority="P2" />
                  </div>
                  {item.reason && (
                    <p className="text-sm text-gray-700">{item.reason}</p>
                  )}
                  {item.action && (
                    <p className="text-sm italic text-gray-600">
                      {item.action}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
