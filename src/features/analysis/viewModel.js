function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getLevelLabel(score) {
  if (score >= 70) return "Strong";
  if (score >= 40) return "Average";
  return "Weak";
}

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

function buildRecommendationsByPriority(recommendations) {
  const grouped = { P0: [], P1: [], P2: [] };
  recommendations.forEach((item) => {
    const priority = typeof item?.priority === "string" ? item.priority : "P2";
    if (priority === "P0" || priority === "P1" || priority === "P2") {
      grouped[priority].push(item);
    } else {
      grouped.P2.push(item);
    }
  });
  return grouped;
}

function normalizeRecommendations(recommendations) {
  return recommendations.map((item) =>
    typeof item === "string" ? { title: item, priority: "P2" } : item
  );
}

function normalizeInsights(insights) {
  return insights.map((item) => {
    if (!item || typeof item !== "object") return item;
    const percentage = toSafeNumber(item.percentage, null);
    const severity =
      item.severity ??
      (percentage === null
        ? "medium"
        : percentage < 0.4
          ? "high"
          : percentage < 0.7
            ? "medium"
            : "low");

    return {
      ...item,
      severity,
      message: item.message ?? `${item.category || "Area"} needs improvement`,
      tip: item.tip ?? "",
    };
  });
}

export function buildAnalysisVM(analysisResult) {
  const hasAnalysis = Number.isFinite(
    Number(analysisResult?.analysis?.finalScore)
  );

  if (!hasAnalysis) {
    return {
      hasAnalysis: false,
      score: 0,
      levelLabel: "Weak",
      roleLabel: "",
      categoryScores: [],
      categoryScoresRaw: [],
      coverageByCategory: [],
      matched: [],
      missing: [],
      weakSignals: [],
      extra: [],
      matchesRaw: {},
      strengths: [],
      weaknesses: [],
      recommendationsByPriority: { P0: [], P1: [], P2: [] },
      recommendationsRaw: [],
      insights: [],
      insightsRaw: [],
      atsReadiness: {
        score: 0,
        total: 0,
        percentage: 0,
        matchedKeywords: [],
        missingKeywords: [],
      },
      atsReadinessRaw: {},
      metadata: {
        role: "",
        level: "",
        companyType: "",
        experienceYears: 0,
      },
      metadataRaw: {},
      analysisRaw: {},
      raw: analysisResult,
    };
  }

  const score = toSafeNumber(analysisResult?.analysis?.finalScore, 0);
  const role = analysisResult?.metadata?.role ?? "";
  const rawRecommendations = toSafeArray(
    analysisResult?.analysis?.recommendations
  );
  const recommendations = normalizeRecommendations(rawRecommendations);
  const strengths = toSafeArray(
    analysisResult?.analysis?.strengthWeakness?.strengths
  );
  const weaknesses = toSafeArray(
    analysisResult?.analysis?.strengthWeakness?.weaknesses
  );
  const atsReadinessRaw = analysisResult?.analysis?.atsReadiness;
  const rawCategoryScores = toSafeArray(
    analysisResult?.analysis?.categoryScores
  );
  const normalizedCategoryScores = rawCategoryScores.map((item) => ({
    ...item,
    max: item?.max ?? item?.possible,
  }));
  const rawInsights = toSafeArray(analysisResult?.analysis?.insights);
  const normalizedInsights = normalizeInsights(rawInsights);
  const matches = analysisResult?.matches || {};
  const matched = toSafeArray(matches.matched || matches.matchedSkills);
  const missing = toSafeArray(matches.missing || matches.missingSkills);
  const analysisRaw = analysisResult?.analysis || {};

  return {
    hasAnalysis: true,
    score,
    levelLabel: getLevelLabel(score),
    roleLabel: toTitleCase(role),
    categoryScores: normalizedCategoryScores,
    categoryScoresRaw: rawCategoryScores,
    coverageByCategory: toSafeArray(matches.coverageByCategory),
    matched,
    missing,
    weakSignals: toSafeArray(matches.weakSignals),
    extra: toSafeArray(matches.extra),
    matchesRaw: matches,
    strengths,
    weaknesses,
    recommendationsByPriority: buildRecommendationsByPriority(recommendations),
    recommendationsRaw: rawRecommendations,
    insights: normalizedInsights,
    insightsRaw: rawInsights,
    atsReadiness: {
      score: toSafeNumber(atsReadinessRaw?.score, 0),
      total: toSafeNumber(atsReadinessRaw?.total, 0),
      percentage: toSafeNumber(atsReadinessRaw?.percentage, 0),
      matchedKeywords: toSafeArray(atsReadinessRaw?.matchedKeywords),
      missingKeywords: toSafeArray(atsReadinessRaw?.missingKeywords),
    },
    atsReadinessRaw,
    metadata: {
      role,
      level: analysisResult?.metadata?.level ?? "",
      companyType: analysisResult?.metadata?.companyType ?? "",
      experienceYears: toSafeNumber(
        analysisResult?.metadata?.experienceYears,
        0
      ),
    },
    metadataRaw: analysisResult?.metadata || {},
    analysisRaw,
    raw: analysisResult,
  };
}
