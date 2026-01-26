import { useState } from "react";
import { useResumeParser } from "@/hooks/useResumeParser";
import { useAnalyze } from "@/context/AnalyzeContext";

export default function Step1Upload() {
  const {
    parseFile,
    error: parseError,
    text,
    isLoading: isParsing,
  } = useResumeParser();
  const {
    runExtraction,
    setCurrentStep,
    extractionError,
    extractionStatus,
    isLoading: isExtracting,
    clearExtractionError,
  } = useAnalyze();

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text || isSubmitting || isParsing || isExtracting) return;

    setIsSubmitting(true);
    clearExtractionError();

    try {
      await runExtraction(text);
      // runExtraction updates extractionStatus in context automatically
      // No need for setTimeout or second hook call
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle step advance based on extraction status
  const handleRetry = async () => {
    setIsSubmitting(true);
    clearExtractionError();
    try {
      await runExtraction(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled =
    !text || isSubmitting || isParsing || isExtracting || Boolean(parseError);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset extraction state on new upload so old error/success UI doesn't show
      clearExtractionError();
      await parseFile(file);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Upload Resume</h2>
      <p className="text-gray-600">Supported formats: PDF, DOCX, TXT</p>

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleUpload}
        disabled={isParsing || isExtracting || isSubmitting}
        className="rounded border p-2 disabled:bg-gray-100"
      />

      {/* Parse Error */}
      {parseError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <div className="font-medium">Parse Error</div>
          <div>{parseError}</div>
        </div>
      )}

      {/* Extraction Loading State */}
      {isExtracting && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          <div className="font-medium">Extracting Skills...</div>
          <div>Please wait while we analyze your resume.</div>
        </div>
      )}

      {/* Extraction Error State */}
      {extractionStatus === "error" && extractionError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <div className="font-medium">Extraction Failed</div>
          <div>{extractionError}</div>
          <button
            onClick={handleRetry}
            disabled={isSubmitting || isExtracting}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 disabled:bg-gray-400"
          >
            Retry
          </button>
        </div>
      )}

      {/* Extraction Empty State */}
      {extractionStatus === "empty" && (
        <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          <div className="font-medium">No Skills Found</div>
          <div>
            Your resume was parsed but no skills were detected. You can add
            skills manually on the next step, or try uploading a different
            resume.
          </div>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={isSubmitting}
            className="mt-2 rounded bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 disabled:bg-gray-400"
          >
            Continue
          </button>
        </div>
      )}

      {/* Extraction Success - Ready to advance */}
      {extractionStatus === "success" && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <div className="font-medium">Skills Extracted Successfully</div>
          <div>Ready to proceed to the next step.</div>
          <button
            onClick={() => setCurrentStep(2)}
            disabled={isSubmitting}
            className="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            Continue to Review
          </button>
        </div>
      )}

      {/* Initial Submit Button */}
      {extractionStatus === "idle" && (
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isParsing
            ? "Parsing..."
            : isSubmitting
              ? "Processing..."
              : "Continue"}
        </button>
      )}
    </div>
  );
}
