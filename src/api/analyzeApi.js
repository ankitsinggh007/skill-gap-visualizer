import { mapApiError } from "@/api/apiError";
import { analyzeResumeMock } from "@/api/mockAnalyzeApi";

const flag = import.meta.env.VITE_USE_MOCK_API;
const USE_MOCK_API =
  typeof flag === "string" ? flag === "true" : import.meta.env.DEV;

export async function analyzeResume(payload) {
  if (USE_MOCK_API) {
    return analyzeResumeMock(payload);
  }

  try {
    const res = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        return mapApiError(
          res,
          errorData,
          "Failed to analyze resume. Please try again."
        );
      } catch {
        return mapApiError(
          res,
          null,
          "Failed to analyze resume. Please try again."
        );
      }
    }

    return await res.json();
  } catch (error) {
    console.error("Frontend → analyze API failed:", error);
    return mapApiError(
      null,
      null,
      "Network error. Please check your connection and try again."
    );
  }
}
