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
  } = useAnalyze();

  function handleAddSkill(e) {
    e.preventDefault();
    const form = e.target;
    const skill = form.skill.value.trim();
    if (skill) {
      addSkill(skill);
      form.reset();
    }
  }

  return (
    <div className="space-y-6 rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Review Your Skills</h2>

      {/* MAIN SKILL LIST */}
      <div>
        <p className="mb-2 text-gray-600">Extracted & Inferred Skills:</p>
        <div className="flex flex-wrap gap-2">
          {extractedSkills.map((s, idx) => (
            <span
              key={`ex-${idx}`}
              title="extracted from resume"
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {s.skill}
              <button
                onClick={() => removeSkill(s.skill)}
                className="ml-1 text-red-600"
              >
                ×
              </button>
            </span>
          ))}

          {inferredSkills.map((s, idx) => (
            <span
              key={`inf-${idx}`}
              title={s.reason}
              className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
            >
              {s.skill}
              <button
                onClick={() => removeSkill(s.skill)}
                className="ml-1 text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* DELETED SKILLS */}
      {deletedSkills.length > 0 && (
        <div>
          <p className="mb-2 text-gray-600">Deleted Skills:</p>
          <div className="flex flex-wrap gap-2">
            {deletedSkills.map((skill, idx) => (
              <span
                key={`del-${idx}`}
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
            ))}
          </div>
        </div>
      )}

      {/* ADD CUSTOM SKILL */}
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <input
          name="skill"
          type="text"
          placeholder="Add a skill…"
          className="flex-1 rounded border px-3 py-1"
        />
        <button className="rounded bg-blue-600 px-4 py-1 text-white">
          Add
        </button>
      </form>

      {/* CONTINUE */}
      <button
        onClick={() => setCurrentStep(3)}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white"
      >
        Continue
      </button>
    </div>
  );
}
