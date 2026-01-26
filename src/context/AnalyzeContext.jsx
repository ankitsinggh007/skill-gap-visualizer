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
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);

  // NEW: editable skill lists
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [inferredSkills, setInferredSkills] = useState([]);
  const [deletedSkills, setDeletedSkills] = useState([]);

  async function runExtraction(resumeText) {
    setIsLoading(true);
    setExtractionStatus("loading");
    setExtractionError(null);

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
  function removeSkill(skillName) {
    // remove from extracted
    setExtractedSkills((prev) => prev.filter((s) => s.skill !== skillName));

    // remove from inferred
    setInferredSkills((prev) => prev.filter((s) => s.skill !== skillName));

    // add to deleted
    setDeletedSkills((prev) => [...prev, skillName]);
  }

  function undoSkill(skillName) {
    // remove from deleted
    setDeletedSkills((prev) => prev.filter((s) => s !== skillName));

    // add back (as extracted, safe default)
    setExtractedSkills((prev) => [...prev, { skill: skillName }]);
  }

  function addSkill(skillName) {
    // prevent duplicates
    if (
      extractedSkills.some((s) => s.skill === skillName) ||
      inferredSkills.some((s) => s.skill === skillName)
    ) {
      return;
    }

    // add as extracted (safe default)
    setExtractedSkills((prev) => [...prev, { skill: skillName }]);
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
