import { useState } from "react";
import { useAnalyze } from "@/context/AnalyzeContext";

export default function Step2ExtractedSkills() {
  const {
    extractedSkills,
    inferredSkills,
    deletedSkills,
    addSkill,
    removeSkill,
    undoSkill,
    setCurrentStep,
    extractionStatus,
    extractionError,
  } = useAnalyze();
  const [newSkill, setNewSkill] = useState("");
  const [inputError, setInputError] = useState("");

  function normalizeSkillName(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
  }

  function handleAddSkill(e) {
    e.preventDefault();
    const normalized = normalizeSkillName(newSkill);
    if (normalized.length < 2) {
      setInputError("Skill must be at least 2 characters.");
      return;
    }
    addSkill(normalized);
    setNewSkill("");
    setInputError("");
  }

  const totalSkills = extractedSkills.length + inferredSkills.length;
  const isIdle = extractionStatus === "idle";
  const isEmpty = extractionStatus === "empty";
  const isError = extractionStatus === "error";
  const canContinue = totalSkills >= 1;

  return (
    <div className="space-y-6 rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Review Your Skills</h2>

      {isIdle && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
          <div className="font-medium">No extraction yet</div>
          <div>Upload a resume to extract skills, or add them manually.</div>
        </div>
      )}

      {isError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <div className="font-medium">Extraction error</div>
          <div>{extractionError || "Something went wrong earlier."}</div>
        </div>
      )}

      {isEmpty && (
        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          <div className="font-medium">Add skills manually</div>
          <div>No skills were detected, so start by adding your own.</div>
        </div>
      )}

      {/* EXTRACTED SKILLS */}
      <div>
        <p className="mb-2 text-gray-600">Extracted Skills:</p>
        {extractedSkills.length === 0 ? (
          <div className="text-sm text-gray-500">None yet.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((s) => {
              const skill = s?.skill;
              const normalized = skill ? normalizeSkillName(skill) : "";
              if (!normalized) return null;
              return (
                <span
                  key={normalized}
                  title="extracted from resume"
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-red-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* INFERRED SKILLS */}
      <div>
        <p className="mb-2 text-gray-600">Inferred Skills:</p>
        {inferredSkills.length === 0 ? (
          <div className="text-sm text-gray-500">None yet.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {inferredSkills.map((s) => {
              const skill = s?.skill;
              const normalized = skill ? normalizeSkillName(skill) : "";
              if (!normalized) return null;
              return (
                <span
                  key={normalized}
                  title={s?.source || ""}
                  className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 text-red-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETED SKILLS */}
      {deletedSkills.length > 0 && (
        <div>
          <p className="mb-2 text-gray-600">Deleted Skills:</p>
          <div className="flex flex-wrap gap-2">
            {deletedSkills.map((skill) => {
              const normalized = skill ? normalizeSkillName(skill) : "";
              if (!normalized) return null;
              return (
                <span
                  key={normalized}
                  className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700"
                >
                  {skill}
                  <button
                    onClick={() => undoSkill(skill)}
                    className="ml-1 text-green-600"
                  >
                    ↺
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD CUSTOM SKILL */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          name="skill"
          type="text"
          placeholder="Add a skill…"
          value={newSkill}
          onChange={(e) => {
            setNewSkill(e.target.value);
            if (inputError) setInputError("");
          }}
          className="flex-1 rounded border px-3 py-1"
        />
        <button
          type="submit"
          disabled={!normalizeSkillName(newSkill)}
          className="rounded bg-blue-600 px-4 py-1 text-white disabled:bg-gray-400"
        >
          Add
        </button>
      </form>
      {inputError && <div className="text-sm text-red-600">{inputError}</div>}

      {(isIdle || isError) && (
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="w-full rounded border border-gray-300 px-4 py-2 text-gray-700"
        >
          Back
        </button>
      )}

      {/* CONTINUE */}
      <button
        type="button"
        onClick={() => setCurrentStep(3)}
        disabled={!canContinue}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
      >
        Continue
      </button>
      {!canContinue && (
        <div className="text-sm text-gray-600">
          Add at least 1 skill to continue.
        </div>
      )}
    </div>
  );
}
