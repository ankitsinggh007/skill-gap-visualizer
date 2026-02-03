import { mapApiError } from "@/api/apiError";
import { analyzeResumeMock } from "@/api/mockAnalyzeApi";

const flag = import.meta.env.VITE_USE_MOCK_API;
const USE_MOCK_API =
  typeof flag === "string" ? flag === "true" : import.meta.env.DEV;

const DEFAULT_BENCHMARK = {
  role: "react",
  level: "junior",
  companyType: "unicorn",
  experienceYears: 0,
};

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeBenchmarkPayload(payload) {
  const safePayload = payload && typeof payload === "object" ? payload : {};

  const role =
    typeof safePayload.role === "string"
      ? safePayload.role.trim().toLowerCase()
      : "";

  const level =
    typeof safePayload.level === "string"
      ? safePayload.level.trim().toLowerCase()
      : "";

  const companyType =
    typeof safePayload.companyType === "string"
      ? safePayload.companyType.trim().toLowerCase()
      : "";

  return {
    ...safePayload,
    role: role || DEFAULT_BENCHMARK.role,
    level: level || DEFAULT_BENCHMARK.level,
    companyType: companyType || DEFAULT_BENCHMARK.companyType,
    experienceYears: clampInt(
      safePayload.experienceYears,
      0,
      50,
      DEFAULT_BENCHMARK.experienceYears
    ),
  };
}

export async function analyzeResume(payload) {
  const normalizedPayload = normalizeBenchmarkPayload(payload);

  if (USE_MOCK_API) {
    return analyzeResumeMock(normalizedPayload);
  }

  try {
    const res = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedPayload),
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
