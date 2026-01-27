import mockAnalysisResult from "@/mock/analysisResult.json";

export async function analyzeResumeMock(_payload) {
  const { resumeText, extractedSkills, inferredSkills } = _payload;
  console.log(extractedSkills, inferredSkills);
  if (resumeText.length < 20) {
    return {
      success: false,
      message: "Resume text too short for analysis (mock).",
      status: 400,
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysisResult);
    }, 700);
  });
}
