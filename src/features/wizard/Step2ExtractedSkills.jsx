import { useState } from "react";
import { useAnalyze } from "@/context/AnalyzeContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";

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
    <div className="space-y-6">
      {/* Status Alerts */}
      {isIdle && (
        <Alert variant="info">
          <div className="font-medium">No extraction yet</div>
          <div className="mt-1 text-sm">
            Upload a resume to extract skills, or add them manually.
          </div>
        </Alert>
      )}

      {isError && (
        <Alert variant="error">
          <div className="font-medium">Extraction error</div>
          <div className="mt-1 text-sm">
            {extractionError || "Something went wrong earlier."}
          </div>
        </Alert>
      )}

      {isEmpty && (
        <Alert variant="warning">
          <div className="font-medium">Add skills manually</div>
          <div className="mt-1 text-sm">
            No skills were detected, so start by adding your own.
          </div>
        </Alert>
      )}

      {/* EXTRACTED SKILLS */}
      {extractedSkills.length > 0 && (
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((s) => {
                const skill = s?.skill;
                const normalized = skill ? normalizeSkillName(skill) : "";
                if (!normalized) return null;
                return (
                  <Badge key={normalized} variant="primary">
                    <div className="flex items-center gap-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-lg opacity-70 hover:opacity-100"
                        title="Remove skill"
                      >
                        ×
                      </button>
                    </div>
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* INFERRED SKILLS */}
      {inferredSkills.length > 0 && (
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Inferred Skills</h3>
            <div className="flex flex-wrap gap-2">
              {inferredSkills.map((s) => {
                const skill = s?.skill;
                const normalized = skill ? normalizeSkillName(skill) : "";
                if (!normalized) return null;
                return (
                  <Badge key={normalized} variant="success">
                    <div className="flex items-center gap-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-lg opacity-70 hover:opacity-100"
                        title={s?.source || "Remove skill"}
                      >
                        ×
                      </button>
                    </div>
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* DELETED SKILLS */}
      {deletedSkills.length > 0 && (
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Deleted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {deletedSkills.map((skill) => {
                const normalized = skill ? normalizeSkillName(skill) : "";
                if (!normalized) return null;
                return (
                  <Badge key={normalized} variant="default">
                    <div className="flex items-center gap-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => undoSkill(skill)}
                        className="ml-1 text-lg opacity-70 hover:opacity-100"
                        title="Restore skill"
                      >
                        ↺
                      </button>
                    </div>
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ADD CUSTOM SKILL */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Add Custom Skill</h3>
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <Input
              name="skill"
              type="text"
              placeholder="e.g., React, Python, UX Design"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                if (inputError) setInputError("");
              }}
              error={!!inputError}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!normalizeSkillName(newSkill)}
              size="md"
            >
              Add
            </Button>
          </form>
          {inputError && (
            <div className="text-sm text-red-600">{inputError}</div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {(isIdle || isError) && (
          <Button
            type="button"
            onClick={() => setCurrentStep(1)}
            variant="secondary"
            className="flex-1"
          >
            Back
          </Button>
        )}

        <Button
          type="button"
          onClick={() => setCurrentStep(3)}
          disabled={!canContinue}
          className="flex-1"
        >
          Continue to Benchmark
        </Button>
      </div>

      {!canContinue && (
        <Alert variant="warning">
          <div className="text-sm">Add at least 1 skill to continue.</div>
        </Alert>
      )}
    </div>
  );
}
