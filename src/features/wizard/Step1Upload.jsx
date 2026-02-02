import { useState } from "react";
import { useResumeParser } from "@/hooks/useResumeParser";
import { useAnalyze } from "@/context/AnalyzeContext";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";

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
    } finally {
      setIsSubmitting(false);
    }
  }

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
      clearExtractionError();
      await parseFile(file);
    }
  };

  return (
    <Card className="space-y-6">
      {/* File Upload Section */}
      <div className="space-y-3">
        <p className="mb-2 block text-sm font-medium text-gray-700">
          Choose Resume File
        </p>

        <input
          id="file-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleUpload}
          disabled={isParsing || isExtracting || isSubmitting}
          className="sr-only"
        />

        <label
          htmlFor="file-upload"
          aria-label="Upload resume file"
          className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
        >
          <div className="text-gray-600">
            <div className="text-sm font-medium">Click to upload</div>
            <div className="mt-1 text-xs text-gray-500">PDF, DOCX, or TXT</div>
          </div>
        </label>
      </div>

      {/* Parse Error */}
      {parseError && (
        <Alert variant="error">
          <div className="font-medium">Parse Error</div>
          <div className="mt-1 text-sm">{parseError}</div>
        </Alert>
      )}

      {/* Extraction Loading State */}
      {isExtracting && (
        <Alert variant="info">
          <div className="font-medium">Extracting Skills...</div>
          <div className="mt-1 text-sm">
            Please wait while we analyze your resume.
          </div>
        </Alert>
      )}

      {/* Extraction Error State */}
      {extractionStatus === "error" && extractionError && (
        <Alert variant="error">
          <div className="font-medium">Extraction Failed</div>
          <div className="mt-1 text-sm">{extractionError}</div>
          <Button
            onClick={handleRetry}
            disabled={isSubmitting || isExtracting}
            size="sm"
            variant="danger"
            className="mt-3"
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Extraction Empty State */}
      {extractionStatus === "empty" && (
        <Alert variant="warning">
          <div>
            <div className="font-medium">No Skills Found</div>
            <div className="mt-1 text-sm">
              Your resume was parsed but no skills were detected. You can add
              skills manually on the next step, or try uploading a different
              resume.
            </div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
              size="sm"
              variant="secondary"
              className="mt-3"
            >
              Continue to Review
            </Button>
          </div>
        </Alert>
      )}

      {/* Extraction Success - Ready to advance */}
      {extractionStatus === "success" && (
        <Alert variant="success">
          <div>
            <div className="font-medium">Skills Extracted Successfully</div>
            <div className="mt-1 text-sm">
              Ready to proceed to the next step.
            </div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
              size="sm"
              variant="secondary"
              className="mt-3"
            >
              Continue to Review
            </Button>
          </div>
        </Alert>
      )}

      {/* Initial Submit Button */}
      {extractionStatus === "idle" && (
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full"
          >
            {isParsing
              ? "Parsing..."
              : isSubmitting
                ? "Processing..."
                : "Continue"}
          </Button>
        </div>
      )}
    </Card>
  );
}
