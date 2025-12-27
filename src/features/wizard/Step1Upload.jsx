// import { useState } from "react";
import { useResumeParser } from "@/hooks/useResumeParser";
import { useAnalyze } from "@/context/AnalyzeContext";

export default function Step1Upload() {
  const { parseFile, error: parseError, text, isLoading } = useResumeParser();
  const { runExtraction, setCurrentStep } = useAnalyze();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    await runExtraction(text);
    setCurrentStep(2); // move to next step
  }
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await parseFile(file);
  };

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Upload Resume</h2>
      <p className="text-gray-600">Supported formats: PDF, DOCX</p>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleUpload}
        className="rounded border p-2"
      />

      {parseError && <div className="text-sm text-red-600">{parseError}</div>}

      <button
        onClick={handleSubmit}
        disabled={Boolean(!text || isLoading || parseError)}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}
