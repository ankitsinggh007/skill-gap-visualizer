import { useState } from "react";
import { analyzeResume } from "@/api/analyzeApi";
import { useAnalyze } from "@/context/AnalyzeContext";
import { useNavigate } from "react-router-dom";

const ROLE_OPTIONS = [
  { value: "react", label: "React" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
];

const LEVEL_OPTIONS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
];

const COMPANY_OPTIONS = [
  { value: "unicorn", label: "Unicorn" },
  { value: "enterprise", label: "Enterprise" },
  { value: "startup", label: "Startup" },
];

export default function Step3BenchmarkForm() {
  const {
    resumeText,
    extractedSkills,
    inferredSkills,
    selectedRole,
    setSelectedRole,
    selectedLevel,
    setSelectedLevel,
    selectedCompanyType,
    setSelectedCompanyType,
    setAnalysisResult,
  } = useAnalyze();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const navigate = useNavigate();

  const totalSkills = extractedSkills.length + inferredSkills.length;
  const hasResumeText = (resumeText || "").trim().length >= 20;
  const canAnalyze = totalSkills >= 1 && hasResumeText && !isAnalyzing;

  function buildPayload() {
    const safeExtracted = extractedSkills
      .map((s) => (typeof s?.skill === "string" ? { skill: s.skill } : null))
      .filter(Boolean);
    const safeInferred = inferredSkills
      .map((s) =>
        typeof s?.skill === "string"
          ? {
              skill: s.skill,
              source: typeof s?.source === "string" ? s.source : "",
            }
          : null
      )
      .filter(Boolean);

    return {
      resumeText: resumeText || "",
      extractedSkills: safeExtracted,
      inferredSkills: safeInferred,
      role: selectedRole,
      level: selectedLevel,
      companyType: selectedCompanyType,
      experienceYears: 0,
    };
  }

  async function runAnalysis() {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setAnalysisError("");
    const payload = buildPayload();
    const result = await analyzeResume(payload);
    if (result?.success === false) {
      setAnalysisError(result.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
      return;
    }
    setAnalysisResult(result);
    navigate("/analysis");
  }

  function handleSubmit(e) {
    e.preventDefault();
    runAnalysis();
  }

  return (
    <div className="space-y-6 rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Benchmark Setup</h2>

      {analysisError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <div className="font-medium">Analysis failed</div>
          <div>{analysisError}</div>
          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-white disabled:bg-gray-400"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="level"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Level
          </label>
          <select
            id="level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="company-type"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Company Type
          </label>
          <select
            id="company-type"
            value={selectedCompanyType}
            onChange={(e) => setSelectedCompanyType(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            {COMPANY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!canAnalyze}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {!hasResumeText && (
        <div className="text-sm text-gray-600">
          Upload resume first (we need resume text).
        </div>
      )}
    </div>
  );
}
