import mockData from "@/mock/extractionResult.json";

export async function extractSkillsMock(rawText) {
  console.log("Mock API called with rawText:", rawText);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 600); // artificial delay for realism
  });
}
