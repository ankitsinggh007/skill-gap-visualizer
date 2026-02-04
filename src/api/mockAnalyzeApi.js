import mockAnalysisResult from "@/mock/analysisResult.json";

export async function analyzeResumeMock(payload) {
  const extracted = Array.isArray(payload?.extractedSkills)
    ? payload.extractedSkills
    : [];
  const inferred = Array.isArray(payload?.inferredSkills)
    ? payload.inferredSkills
    : [];

  if (extracted.length + inferred.length < 1) {
    return {
      success: false,
      message: "At least 1 skill required.",
      status: 400,
    };
  }

  const resumeText = payload?.resumeText;

  if (typeof resumeText !== "string" || resumeText.trim().length === 0) {
    return {
      success: false,
      message: "resumeText is required and must be a string.",
      status: 400,
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysisResult);
    }, 700);
  });
}
