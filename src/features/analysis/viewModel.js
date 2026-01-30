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
      coverageByCategory: [],
      matched: [],
      missing: [],
      weakSignals: [],
      extra: [],
      strengths: [],
      weaknesses: [],
      recommendationsByPriority: { P0: [], P1: [], P2: [] },
      atsReadiness: {
        score: 0,
        total: 0,
        percentage: 0,
        matchedKeywords: [],
        missingKeywords: [],
      },
      metadata: {
        role: "",
        level: "",
        companyType: "",
        experienceYears: 0,
      },
    };
  }

  const score = toSafeNumber(analysisResult?.analysis?.finalScore, 0);
  const role = analysisResult?.metadata?.role ?? "";
  const recommendations = toSafeArray(
    analysisResult?.analysis?.recommendations
  );
  const strengths = toSafeArray(
    analysisResult?.analysis?.strengthWeakness?.strengths
  );
  const weaknesses = toSafeArray(
    analysisResult?.analysis?.strengthWeakness?.weaknesses
  );
  const atsReadinessRaw = analysisResult?.analysis?.atsReadiness;

  return {
    hasAnalysis: true,
    score,
    levelLabel: getLevelLabel(score),
    roleLabel: toTitleCase(role),
    categoryScores: toSafeArray(analysisResult?.analysis?.categoryScores),
    coverageByCategory: toSafeArray(
      analysisResult?.matches?.coverageByCategory
    ),
    matched: toSafeArray(analysisResult?.matches?.matched),
    missing: toSafeArray(analysisResult?.matches?.missing),
    weakSignals: toSafeArray(analysisResult?.matches?.weakSignals),
    extra: toSafeArray(analysisResult?.matches?.extra),
    strengths,
    weaknesses,
    recommendationsByPriority: buildRecommendationsByPriority(recommendations),
    atsReadiness: {
      score: toSafeNumber(atsReadinessRaw?.score, 0),
      total: toSafeNumber(atsReadinessRaw?.total, 0),
      percentage: toSafeNumber(atsReadinessRaw?.percentage, 0),
      matchedKeywords: toSafeArray(atsReadinessRaw?.matchedKeywords),
      missingKeywords: toSafeArray(atsReadinessRaw?.missingKeywords),
    },
    metadata: {
      role,
      level: analysisResult?.metadata?.level ?? "",
      companyType: analysisResult?.metadata?.companyType ?? "",
      experienceYears: toSafeNumber(
        analysisResult?.metadata?.experienceYears,
        0
      ),
    },
  };
}
