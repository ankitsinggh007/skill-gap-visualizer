import { useState } from "react";
import { analyzeResume } from "@/api/analyzeApi";
import { useAnalyze } from "@/context/AnalyzeContext";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";

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
    setCurrentStep,
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

    try {
      const payload = buildPayload();
      const result = await analyzeResume(payload);

      if (result?.success === false) {
        setAnalysisError(
          result.message || "Analysis failed. Please try again."
        );
        return;
      }

      setAnalysisResult(result);
      navigate("/analysis");
    } catch {
      setAnalysisError("Network error. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    runAnalysis();
  }

  return (
    <div className="space-y-6">
      {/* Analysis Error */}
      {analysisError && (
        <Alert variant="error">
          <div>
            <div className="font-medium">Analysis failed</div>
            <div className="mt-1 text-sm">{analysisError}</div>
            <Button
              type="button"
              onClick={runAnalysis}
              disabled={isAnalyzing}
              size="sm"
              variant="danger"
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Target Role
            </label>
            <Select
              id="role"
              options={ROLE_OPTIONS}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              placeholder="Select your target role"
            />
            <p className="text-xs text-gray-500">
              Choose the role you want to be benchmarked against.
            </p>
          </div>

          {/* Level Selection */}
          <div className="space-y-2">
            <label
              htmlFor="level"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Level
            </label>
            <Select
              id="level"
              options={LEVEL_OPTIONS}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              placeholder="Select your experience level"
            />
            <p className="text-xs text-gray-500">
              This helps calibrate skill expectations.
            </p>
          </div>

          {/* Company Type Selection */}
          <div className="space-y-2">
            <label
              htmlFor="company-type"
              className="block text-sm font-medium text-gray-700"
            >
              Company Type
            </label>
            <Select
              id="company-type"
              options={COMPANY_OPTIONS}
              value={selectedCompanyType}
              onChange={(e) => setSelectedCompanyType(e.target.value)}
              placeholder="Select target company type"
            />
            <p className="text-xs text-gray-500">
              Different company sizes have different skill priorities.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!canAnalyze}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Requirements Check */}
      <Card className="bg-gray-50">
        <div className="space-y-2 text-sm">
          <h3 className="font-medium text-gray-900">Requirements:</h3>
          <div className="flex items-center gap-2">
            <span
              className={totalSkills >= 1 ? "text-green-600" : "text-gray-400"}
            >
              {totalSkills >= 1 ? "✓" : "○"}
            </span>
            <span
              className={totalSkills >= 1 ? "text-gray-700" : "text-gray-500"}
            >
              At least 1 skill
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={hasResumeText ? "text-green-600" : "text-gray-400"}
            >
              {hasResumeText ? "✓" : "○"}
            </span>
            <span className={hasResumeText ? "text-gray-700" : "text-gray-500"}>
              Resume text available
            </span>
          </div>
        </div>
      </Card>

      {/* Back Button */}
      <Button
        type="button"
        onClick={() => setCurrentStep(2)}
        variant="secondary"
        className="w-full"
      >
        Back to Skills Review
      </Button>
    </div>
  );
}
