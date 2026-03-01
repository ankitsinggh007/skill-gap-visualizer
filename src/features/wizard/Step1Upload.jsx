import { useEffect, useRef, useState } from "react";
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
  const [turnstileToken, setTurnstileToken] = useState("");
  const [fileName, setFileName] = useState("");
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const requiresTurnstile = Boolean(turnstileSiteKey);
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);

  const isParseReady = Boolean(text) && !parseError && !isParsing;
  const showTurnstile =
    requiresTurnstile &&
    isParseReady &&
    (extractionStatus === "idle" || extractionStatus === "error");

  useEffect(() => {
    if (!requiresTurnstile) return;

    if (!showTurnstile) {
      if (turnstileWidgetId.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
      return;
    }

    if (!turnstileRef.current || !window.turnstile?.render) return;
    if (turnstileWidgetId.current) return;

    turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
    });

    return () => {
      if (turnstileWidgetId.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [requiresTurnstile, showTurnstile, turnstileSiteKey]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !text ||
      isSubmitting ||
      isParsing ||
      isExtracting ||
      (requiresTurnstile && !turnstileToken)
    )
      return;

    setIsSubmitting(true);
    clearExtractionError();

    try {
      await runExtraction(text, turnstileToken);
    } finally {
      setIsSubmitting(false);
      if (requiresTurnstile) setTurnstileToken("");
    }
  }

  const handleRetry = async () => {
    if (requiresTurnstile && !turnstileToken) return;
    setIsSubmitting(true);
    clearExtractionError();
    try {
      await runExtraction(text, turnstileToken);
    } finally {
      setIsSubmitting(false);
      if (requiresTurnstile) setTurnstileToken("");
    }
  };

  const isDisabled =
    !text ||
    isSubmitting ||
    isParsing ||
    isExtracting ||
    Boolean(parseError) ||
    (requiresTurnstile && !turnstileToken);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (requiresTurnstile) setTurnstileToken("");
      setFileName(file.name || "");
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

      {/* Parse Success */}
      {isParseReady && extractionStatus === "idle" && (
        <Alert variant="success">
          <div className="font-medium">Resume parsed successfully</div>
          <div className="mt-1 text-sm text-gray-700">
            {fileName
              ? `File: ${fileName}`
              : "Your resume is ready to analyze."}
          </div>
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
            disabled={
              isSubmitting ||
              isExtracting ||
              (requiresTurnstile && !turnstileToken)
            }
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

      {/* Turnstile Verification */}
      {showTurnstile && (
        <div className="flex flex-col items-center gap-2">
          <div ref={turnstileRef} />
          {turnstileToken ? (
            <p className="text-xs text-green-600">Verified ✓</p>
          ) : (
            <p className="text-xs text-gray-500">
              Complete the verification to continue.
            </p>
          )}
        </div>
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
