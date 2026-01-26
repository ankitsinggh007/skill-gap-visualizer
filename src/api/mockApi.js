import mockData from "@/mock/extractionResult.json";

export async function extractSkillsMock(resumeText) {
  console.log(
    "Mock API called with resumeText (length):",
    resumeText?.length || 0
  );
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 600); // artificial delay for realism
  });
}
