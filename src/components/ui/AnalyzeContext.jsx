import { createContext, useContext, useState } from "react";
import { extractSkillsFromResume } from "@/api/extractApi";

const AnalyzeContext = createContext(null);

// Toggle between mock and real API via environment variable

export function AnalyzeProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [extractionResult, setExtractionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractionError, setExtractionError] = useState(null);
  const [extractionStatus, setExtractionStatus] = useState("idle"); // idle | loading | success | empty | error

  // NEW: role:level:companyType for benchmark
  const [selectedRole, setSelectedRole] = useState("react");
  const [selectedLevel, setSelectedLevel] = useState("junior");
  const [selectedCompanyType, setSelectedCompanyType] = useState("unicorn");

  const [analysisResult, setAnalysisResult] = useState(null);

  // NEW: editable skill lists
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [inferredSkills, setInferredSkills] = useState([]);
  const [deletedSkills, setDeletedSkills] = useState([]);

  async function runExtraction(resumeText) {
    setIsLoading(true);
    setExtractionStatus("loading");
    setExtractionError(null);
    setExtractionResult(null);
    setAnalysisResult(null);
    setExtractedSkills([]);
    setInferredSkills([]);
    setDeletedSkills([]);

    if ((resumeText || "").length > 100000) {
      setExtractionStatus("error");
      setExtractionError(
        "Resume text is too long. Please upload a smaller file."
      );
      setIsLoading(false);
      return;
    }

    // store the raw resume text
    setResumeText(resumeText);

    try {
      const result = await extractSkillsFromResume(resumeText);

      // Check if the result is an error response from the API client
      if (result.success === false) {
        setExtractionStatus("error");
        setExtractionError(result.message);
        setIsLoading(false);
        return;
      }

      // store full result
      setExtractionResult(result);

      // Check if extraction returned empty arrays
      const hasExtractedSkills =
        result.extractedSkills && result.extractedSkills.length > 0;
      const hasInferredSkills =
        result.inferredSkills && result.inferredSkills.length > 0;

      if (!hasExtractedSkills && !hasInferredSkills) {
        setExtractionStatus("empty");
        setExtractedSkills([]);
        setInferredSkills([]);
      } else {
        setExtractionStatus("success");
        // initialize editable skills
        setExtractedSkills(result.extractedSkills || []);
        setInferredSkills(result.inferredSkills || []);
      }

      setDeletedSkills([]); // reset any previous deletion
    } catch (error) {
      console.error("Extraction failed:", error);
      setExtractionStatus("error");
      setExtractionError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Reset extraction state for retry
  function clearExtractionError() {
    setExtractionError(null);
    setExtractionStatus("idle");
  }

  // -----------------------
  // SKILL EDITING LOGIC
  // -----------------------
  function normalizeSkillName(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }

  function removeSkill(skillName) {
    const normalized = normalizeSkillName(skillName);

    // Find where it came from (preserve original casing + inferred source)
    const inferredEntry = inferredSkills.find(
      (s) => normalizeSkillName(s?.skill) === normalized
    );
    const extractedEntry = extractedSkills.find(
      (s) => normalizeSkillName(s?.skill) === normalized
    );

    const origin = inferredEntry ? "inferred" : "extracted";
    const skill = (
      inferredEntry?.skill ||
      extractedEntry?.skill ||
      skillName ||
      ""
    ).trim();
    const source = inferredEntry?.source || "";

    // Remove from both lists (safe even if it's only in one)
    setExtractedSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s?.skill) !== normalized)
    );
    setInferredSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s?.skill) !== normalized)
    );

    // Add to deleted (no duplicates)
    setDeletedSkills((prev) => {
      if (prev.some((d) => normalizeSkillName(d?.skill) === normalized))
        return prev;
      return [...prev, { skill, origin, source }];
    });
  }

  function undoSkill(skillName) {
    const normalized = normalizeSkillName(skillName);

    // You need the entry BEFORE removing it
    const entry = deletedSkills.find(
      (d) => normalizeSkillName(d?.skill) === normalized
    );
    if (!entry) return;

    setDeletedSkills((prev) =>
      prev.filter((d) => normalizeSkillName(d?.skill) !== normalized)
    );

    // Prevent duplicates
    const exists =
      extractedSkills.some(
        (s) => normalizeSkillName(s?.skill) === normalized
      ) ||
      inferredSkills.some((s) => normalizeSkillName(s?.skill) === normalized);

    if (exists) return;

    if (entry.origin === "inferred") {
      setInferredSkills((prev) => [
        ...prev,
        { skill: entry.skill, source: entry.source || "" },
      ]);
      return;
    }

    setExtractedSkills((prev) => [...prev, { skill: entry.skill }]);
  }

  function addSkill(skillName) {
    const trimmed =
      typeof skillName === "string"
        ? skillName.trim()
        : String(skillName || "").trim();
    const normalized = normalizeSkillName(trimmed);
    if (normalized.length < 2) return;

    const exists =
      extractedSkills.some(
        (s) => normalizeSkillName(s?.skill) === normalized
      ) ||
      inferredSkills.some((s) => normalizeSkillName(s?.skill) === normalized);

    if (exists) return;

    // If it was deleted earlier, remove from deleted list
    setDeletedSkills((prev) =>
      prev.filter((d) => normalizeSkillName(d?.skill) !== normalized)
    );

    // Manual adds are "extracted" (fine for MVP)
    setExtractedSkills((prev) => [...prev, { skill: trimmed }]);
  }

  function clearAnalysisResult() {
    setAnalysisResult(null);
  }

  function resetSession() {
    setResumeText("");
    setExtractionResult(null);
    setExtractionError(null);
    setExtractionStatus("idle");
    setIsLoading(false);
    setExtractedSkills([]);
    setInferredSkills([]);
    setDeletedSkills([]);
    setAnalysisResult(null);
    setSelectedRole("react");
    setSelectedLevel("junior");
    setSelectedCompanyType("unicorn");
    setCurrentStep(1);
  }

  return (
    <AnalyzeContext.Provider
      value={{
        // session
        resumeText,
        extractionResult,
        isLoading,
        extractionError,
        extractionStatus,
        runExtraction,
        clearExtractionError,
        currentStep,
        setCurrentStep,
        selectedRole,
        setSelectedRole,
        selectedLevel,
        setSelectedLevel,
        selectedCompanyType,
        setSelectedCompanyType,
        analysisResult,
        setAnalysisResult,
        clearAnalysisResult,
        resetSession,
        // skill editing
        extractedSkills,
        inferredSkills,
        deletedSkills,
        addSkill,
        removeSkill,
        undoSkill,
      }}
    >
      {children}
    </AnalyzeContext.Provider>
  );
}

export function useAnalyze() {
  return useContext(AnalyzeContext);
}
