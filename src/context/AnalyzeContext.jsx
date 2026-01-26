import { createContext, useContext, useState } from "react";
import { extractSkillsMock } from "@/api/mockApi";
import { extractSkillsFromResume } from "@/api/extractApi";
import PropTypes from "prop-types";

const AnalyzeContext = createContext(null);

// Toggle between mock and real API via environment variable
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

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
      // Use mock API or real API based on toggle
      const result = USE_MOCK_API
        ? await extractSkillsMock(resumeText)
        : await extractSkillsFromResume(resumeText);

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
    // remove from extracted
    setExtractedSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s.skill) !== normalized)
    );

    // remove from inferred
    setInferredSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s.skill) !== normalized)
    );

    // add to deleted
    setDeletedSkills((prev) => {
      if (prev.some((s) => normalizeSkillName(s) === normalized)) {
        return prev;
      }
      return [...prev, skillName];
    });
  }

  function undoSkill(skillName) {
    const normalized = normalizeSkillName(skillName);
    // remove from deleted
    setDeletedSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s) !== normalized)
    );

    // add back (as extracted, safe default)
    const alreadyExists =
      extractedSkills.some((s) => normalizeSkillName(s.skill) === normalized) ||
      inferredSkills.some((s) => normalizeSkillName(s.skill) === normalized);
    if (!alreadyExists) {
      setExtractedSkills((prev) => [...prev, { skill: skillName }]);
    }
  }

  function addSkill(skillName) {
    const normalized = normalizeSkillName(skillName);
    if (normalized.length < 2) return;
    // prevent duplicates
    if (
      extractedSkills.some((s) => normalizeSkillName(s.skill) === normalized) ||
      inferredSkills.some((s) => normalizeSkillName(s.skill) === normalized)
    ) {
      return;
    }

    setDeletedSkills((prev) =>
      prev.filter((s) => normalizeSkillName(s) !== normalized)
    );
    // add as extracted (safe default)
    setExtractedSkills((prev) => [...prev, { skill: normalized }]);
  }

  function clearAnalysisResult() {
    setAnalysisResult(null);
  }

  function resetSession() {
    setResumeText("");
    setExtractionResult(null);
    setExtractionError(null);
    setExtractionStatus("idle");
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

AnalyzeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
