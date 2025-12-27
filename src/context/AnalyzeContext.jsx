import { createContext, useContext, useState } from "react";
import { extractSkillsMock } from "@/api/mockApi";
import PropTypes from "prop-types";
const AnalyzeContext = createContext(null);

export function AnalyzeProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeText, setResumeText] = useState("");
  const [extractionResult, setExtractionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: role:level:comapnyType for benchmark

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);

  // NEW: editable skill lists
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [inferredSkills, setInferredSkills] = useState([]);
  const [deletedSkills, setDeletedSkills] = useState([]);

  async function runExtraction(rawText) {
    setIsLoading(true);

    // store the raw resume text
    setResumeText(rawText);

    const result = await extractSkillsMock(rawText);

    // store full result
    setExtractionResult(result);

    // initialize editable skills
    setExtractedSkills(result.extractedSkills || []);
    setInferredSkills(result.inferredSkills || []);
    setDeletedSkills([]); // reset any previous deletion

    setIsLoading(false);
  }
  // -----------------------------
  // SKILL EDITING LOGIC
  // -----------------------------
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
        runExtraction,
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
