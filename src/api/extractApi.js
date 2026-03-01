import { mapApiError } from "@/api/apiError";
import { extractSkillsMock } from "./mockApi";
import apiUrl from "./apiClient";
const flag = import.meta.env.VITE_USE_MOCK_API;
const USE_MOCK_API =
  typeof flag === "string" ? flag === "true" : import.meta.env.DEV;

export async function extractSkillsFromResume(resumeText, turnstileToken) {
  if (USE_MOCK_API) {
    return extractSkillsMock(resumeText);
  }

  const payload = { resumeText };
  if (typeof turnstileToken === "string" && turnstileToken.trim().length > 0) {
    payload.turnstileToken = turnstileToken;
  }

  try {
    const res = await fetch(apiUrl("/api/extract"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Check if response is successful
    if (!res.ok) {
      try {
        const errorData = await res.json();
        return mapApiError(
          res,
          errorData,
          "Failed to extract skills. Please try again."
        );
      } catch {
        return mapApiError(
          res,
          null,
          "Failed to extract skills. Please try again."
        );
      }
    }

    return await res.json();
  } catch (error) {
    console.error("Frontend → extract API failed:", error);
    return mapApiError(
      null,
      null,
      "Network error. Please check your connection and try again."
    );
  }
}
