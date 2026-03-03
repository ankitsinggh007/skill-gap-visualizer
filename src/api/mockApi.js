import mockData from "@/mock/extractionResult.json";

export async function extractSkillsMock(resumeText) {
  void resumeText;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 600); // artificial delay for realism
  });
}
